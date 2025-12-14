import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper: Calculate Standard Deviation
const calculateStdDev = (values) => {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquareDiff);
};

// Helper: Calculate Median
const calculateMedian = (values) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export async function POST(request) {
  console.log('📊 [Update Summary API] Starting update');

  try {
    const body = await request.json();
    const { user_id } = body;

    console.log('📊 [Update Summary API] User ID:', user_id);

    // Validate user_id
    if (!user_id) {
      return Response.json(
        { status: 'fail', message: 'User ID is required.' },
        { status: 401 }
      );
    }

    const userId = parseInt(user_id, 10);

    if (isNaN(userId)) {
      return Response.json(
        { status: 'fail', message: 'Invalid user ID.' },
        { status: 400 }
      );
    }

    // 1. Fetch Raw Data
    const [activitiesResult, examsResult] = await Promise.all([
      supabase
        .from('user_activity_tracking')
        .select('*')
        .eq('user_id', userId),
      supabase
        .from('exam_submissions')
        .select('*')
        .eq('user_id', userId)
    ]);

    if (activitiesResult.error) {
      throw new Error(`Failed to fetch activities: ${activitiesResult.error.message}`);
    }

    if (examsResult.error) {
      throw new Error(`Failed to fetch exams: ${examsResult.error.message}`);
    }

    const activities = activitiesResult.data || [];
    const examSubmissions = examsResult.data || [];

    console.log(`📊 Activities: ${activities.length}, Exams: ${examSubmissions.length}`);

    // 2. Process Activity Stats
    // Count accessed tutorials (UNIQUE tutorial_id) ✅
    const accessedTutorials = new Set(activities.map(a => a.tutorial_id)).size;

    // Count completed tutorials (UNIQUE tutorial_id) ✅ FIX!
    const completedTutorials = new Set(
      activities.filter(a => a.is_completed).map(a => a.tutorial_id)
    ).size;

    // Calculate completion rate
    const completionRate = accessedTutorials > 0 
      ? (completedTutorials / accessedTutorials) * 100 
      : 0;

    // Count completed journeys (all tutorials in journey completed)
    const journeyProgress = {};
    activities.forEach(a => {
      if (!a.journey_id) return;
      if (!journeyProgress[a.journey_id]) {
        journeyProgress[a.journey_id] = { total: new Set(), completed: new Set() };
      }
      journeyProgress[a.journey_id].total.add(a.tutorial_id);
      if (a.is_completed) {
        journeyProgress[a.journey_id].completed.add(a.tutorial_id);
      }
    });

    const totalJourneysCompleted = Object.values(journeyProgress).filter(
      jp => jp.total.size > 0 && jp.total.size === jp.completed.size
    ).length;

    // Calculate Time Stats (Duration)
    const durations = activities
      .map(a => (a.duration_seconds || 0) / 3600) // Convert to hours
      .filter(d => d > 0);

    const totalStudyHours = durations.reduce((a, b) => a + b, 0);
    const avgStudyDuration = durations.length ? totalStudyHours / durations.length : 0;
    const medianStudyDuration = calculateMedian(durations);
    const maxStudyDuration = durations.length ? Math.max(...durations) : 0;
    const minStudyDuration = durations.length ? Math.min(...durations) : 0;

    // Calculate Daily Stats (Consistency)
    const activitiesByDay = activities.reduce((acc, curr) => {
      const date = curr.last_viewed_at ? curr.last_viewed_at.split('T')[0] : null;
      if (date) {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    const dailyCounts = Object.values(activitiesByDay);
    const totalStudyDays = dailyCounts.length;
    const avgTutorialPerDay = totalStudyDays ? dailyCounts.reduce((a, b) => a + b, 0) / totalStudyDays : 0;
    const stdTutorialPerDay = calculateStdDev(dailyCounts);
    const maxTutorialInDay = dailyCounts.length ? Math.max(...dailyCounts) : 0;

    // 3. Process Exam Stats
    const totalExamsTaken = examSubmissions.length;
    const totalExamsPassed = examSubmissions.filter(e => e.is_passed).length;
    const scores = examSubmissions.map(e => e.score || 0);
    const avgExamScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const examPassRate = totalExamsTaken ? (totalExamsPassed / totalExamsTaken) * 100 : 0;

    // 4. Prepare data for upsert
    const summaryData = {
      user_id: userId,
      total_tutorial_accessed: accessedTutorials,
      total_tutorial_completed: completedTutorials,
      completion_rate: Math.round(completionRate * 100) / 100,
      total_journeys_completed: totalJourneysCompleted,
      total_exams_taken: totalExamsTaken,
      total_exams_passed: totalExamsPassed,
      avg_study_duration_hours: Math.round(avgStudyDuration * 100000) / 100000,
      median_study_duration_hours: Math.round(medianStudyDuration * 100000) / 100000,
      max_study_duration_hours: Math.round(maxStudyDuration * 100000) / 100000,
      min_study_duration_hours: Math.round(minStudyDuration * 100000) / 100000,
      total_study_days: totalStudyDays,
      avg_tutorial_per_day: Math.round(avgTutorialPerDay * 100) / 100,
      std_tutorial_per_day: Math.round(stdTutorialPerDay * 100) / 100,
      max_tutorial_in_day: maxTutorialInDay,
      avg_exam_score: Math.round(avgExamScore * 100) / 100,
      exam_pass_rate: Math.round(examPassRate * 100) / 100,
      last_updated: new Date().toISOString()
    };

    console.log('📊 Summary Data:', summaryData);

    // 5. Upsert to database
    console.log('📊 [Update Summary API] Attempting upsert...');
    
    const { data: result, error: upsertError } = await supabase
      .from('user_progress_summary')
      .upsert(summaryData, { 
        onConflict: 'user_id',
        returning: 'representation'
      })
      .select()
      .single();

    if (upsertError) {
      console.error('❌ [Update Summary API] Upsert error:', upsertError);
      console.error('❌ [Update Summary API] Upsert error details:', JSON.stringify(upsertError, null, 2));
      throw new Error(`Failed to upsert summary: ${upsertError.message}`);
    }

    console.log('✅ [Update Summary API] Summary updated successfully');
    console.log('✅ [Update Summary API] Result:', result);

    return Response.json({
      status: 'success',
      message: 'User progress summary berhasil diperbarui.',
      data: result
    });

  } catch (error) {
    console.error('❌ [Update Summary API] Error:', error);
    console.error('❌ [Update Summary API] Error stack:', error.stack);

    return Response.json(
      { status: 'fail', message: 'Gagal memperbarui summary.', error: error.message },
      { status: 500 }
    );
  }
}
