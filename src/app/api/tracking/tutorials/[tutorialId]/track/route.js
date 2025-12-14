import supabase from '@/lib/supabaseClient';

// Helper: Update or create tracking record
async function updateLastViewed(userId, tutorialId, journeyId = null) {
  const now = new Date().toISOString();
  const tutorialIdNum = parseInt(tutorialId, 10);

  // 1. Try to get journey_id from tutorial (optional validation)
  let tutorialJourneyId = journeyId;
  
  const { data: tutorial, error: tutorialError } = await supabase
    .from('tutorial')
    .select('journey_id')
    .eq('tutorial_id', tutorialIdNum)
    .maybeSingle();

  if (tutorial) {
    tutorialJourneyId = tutorial.journey_id;
    console.log('✅ [Track API] Tutorial found, journey_id:', tutorialJourneyId);
  } else {
    console.warn('⚠️ [Track API] Tutorial not found in database, using provided journey_id or null');
  }

  // 2. Check if tracking record exists
  const { data: existing, error: fetchError } = await supabase
    .from('user_activity_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('tutorial_id', tutorialIdNum)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching tracking record:', fetchError);
  }

  // 3A. If exists → Update last_viewed_at only
  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from('user_activity_tracking')
      .update({ last_viewed_at: now })
      .eq('tracking_id', existing.tracking_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update tracking: ${updateError.message}`);
    }

    return updated;
  }

  // 3B. If not exists → Create new record
  const { data: created, error: createError } = await supabase
    .from('user_activity_tracking')
    .insert({
      user_id: userId,
      tutorial_id: tutorialIdNum,
      journey_id: tutorialJourneyId, // May be null if tutorial not found
      first_opened_at: now,
      last_viewed_at: now,
      progress_percentage: 0,
      is_completed: false,
      duration_seconds: 0
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create tracking: ${createError.message}`);
  }

  return created;
}

export async function POST(request, context) {
  // Next.js 15: params is now a Promise
  const { tutorialId } = await context.params;
  
  console.log('📝 [Track API] Tutorial ID:', tutorialId);

  try {
    const body = await request.json();
    const { action, user_id } = body;

    console.log('📝 [Track API] Action:', action, 'User ID:', user_id);

    // Validate input
    if (!action || !['start', 'complete'].includes(action)) {
      return Response.json(
        { status: 'fail', message: 'Invalid action. Use "start" or "complete".' },
        { status: 400 }
      );
    }

    if (!user_id) {
      return Response.json(
        { status: 'fail', message: 'User ID is required.' },
        { status: 401 }
      );
    }

    const userId = parseInt(user_id, 10);
    const tutorialIdNum = parseInt(tutorialId, 10);

    if (isNaN(userId) || isNaN(tutorialIdNum)) {
      return Response.json(
        { status: 'fail', message: 'Invalid user ID or tutorial ID.' },
        { status: 400 }
      );
    }

    // Handle "start" action
    if (action === 'start') {
      await updateLastViewed(userId, tutorialIdNum);
      
      console.log('✅ [Track API] Started tracking for tutorial:', tutorialIdNum);

      return Response.json({
        status: 'success',
        message: 'Pelacakan materi dimulai atau diperbarui.'
      });
    }

    // Handle "complete" action
    const now = new Date().toISOString();

    // Get or create tracking record
    let trackingRecord = await updateLastViewed(userId, tutorialIdNum);

    // Check if already completed
    if (trackingRecord.is_completed) {
      console.log('⚠️ [Track API] Tutorial already completed:', tutorialIdNum);
      
      return Response.json({
        status: 'success',
        message: 'Materi sudah diselesaikan sebelumnya.',
        data: trackingRecord
      });
    }

    // Mark as completed
    const { data: updatedRecord, error: updateError } = await supabase
      .from('user_activity_tracking')
      .update({
        completed_at: now,
        last_viewed_at: now,
        is_completed: true,
        progress_percentage: 100
        // duration_seconds NOT overwritten; relies on accumulated heartbeat time
      })
      .eq('tracking_id', trackingRecord.tracking_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to mark as completed: ${updateError.message}`);
    }

    console.log('✅ [Track API] Tutorial completed:', tutorialIdNum);

    return Response.json({
      status: 'success',
      message: 'Materi berhasil diselesaikan.',
      data: updatedRecord
    });

  } catch (error) {
    console.error('❌ [Track API] Error:', error);

    if (error.message === 'Tutorial not found') {
      return Response.json(
        { status: 'fail', message: error.message },
        { status: 404 }
      );
    }

    return Response.json(
      { status: 'fail', message: 'Gagal memproses tracking materi.', error: error.message },
      { status: 500 }
    );
  }
}
