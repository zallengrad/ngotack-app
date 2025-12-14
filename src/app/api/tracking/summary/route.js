import supabase from '@/lib/supabaseClient';

export async function GET(request) {
  console.log('📊 [Summary API] Fetching tracking summary');

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const user_id = searchParams.get('user_id');

    console.log('📊 [Summary API] Params:', { startDate, endDate, user_id });

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

    // Determine date range
    let start, end;
    
    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // Default: Last 7 days
      const now = new Date();
      start = new Date();
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);

      end = new Date();
      end.setHours(23, 59, 59, 999);
    }

    console.log('📊 [Summary API] Date range:', start.toISOString(), 'to', end.toISOString());

    // Fetch all activities in date range
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activity_tracking')
      .select('tutorial_id, is_completed, duration_seconds')
      .eq('user_id', userId)
      .gte('last_viewed_at', start.toISOString())
      .lte('last_viewed_at', end.toISOString());

    if (activitiesError) {
      console.error('❌ [Summary API] Error fetching activities:', activitiesError);
      throw new Error(`Failed to fetch activities: ${activitiesError.message}`);
    }

    console.log(`📊 [Summary API] Fetched ${activities?.length || 0} activity records`);

    // Count UNIQUE completed tutorials (fix duplicate issue)
    const completedTutorials = new Set(
      activities?.filter(a => a.is_completed).map(a => a.tutorial_id) || []
    );

    // Count UNIQUE in-progress tutorials (fix duplicate issue)
    const inProgressTutorials = new Set(
      activities?.filter(a => !a.is_completed).map(a => a.tutorial_id) || []
    );

    // Calculate total duration
    const totalDurationSeconds = activities?.reduce((sum, record) => {
      return sum + (record.duration_seconds || 0);
    }, 0) || 0;

    const totalDurationHours = Math.round((totalDurationSeconds / 3600) * 100) / 100;

    const result = {
      completed: completedTutorials.size,
      inProgress: inProgressTutorials.size,
      totalDurationSeconds,
      totalDurationHours
    };

    console.log('✅ [Summary API] Result:', result);

    return Response.json({
      status: 'success',
      message: 'Ringkasan tracking berhasil diambil.',
      data: result
    });

  } catch (error) {
    console.error('❌ [Summary API] Error:', error);

    return Response.json(
      { status: 'fail', message: 'Gagal mengambil ringkasan tracking.', error: error.message },
      { status: 500 }
    );
  }
}
