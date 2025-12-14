import supabase from '@/lib/supabaseClient';

export async function POST(request) {
  console.log('💓 [Heartbeat API] Received heartbeat');

  try {
    const body = await request.json();
    const { tutorialId, journeyId, user_id } = body;

    console.log('💓 [Heartbeat API] Tutorial:', tutorialId, 'Journey:', journeyId, 'User:', user_id);

    // Validate input
    if (!tutorialId || !journeyId || !user_id) {
      return Response.json(
        { status: 'fail', message: 'tutorialId, journeyId, and user_id are required.' },
        { status: 400 }
      );
    }

    const userId = parseInt(user_id, 10);
    const tutorialIdNum = parseInt(tutorialId, 10);
    const journeyIdNum = parseInt(journeyId, 10);

    if (isNaN(userId) || isNaN(tutorialIdNum) || isNaN(journeyIdNum)) {
      return Response.json(
        { status: 'fail', message: 'Invalid user ID, tutorial ID, or journey ID.' },
        { status: 400 }
      );
    }

    // Find existing tracking record (not completed)
    const { data: existingRecord, error: fetchError } = await supabase
      .from('user_activity_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('tutorial_id', tutorialIdNum)
      .eq('journey_id', journeyIdNum)
      .eq('is_completed', false)
      .maybeSingle();

    if (fetchError) {
      console.error('❌ [Heartbeat API] Error fetching record:', fetchError);
    }

    const now = new Date();

    if (!existingRecord) {
      // No record exists - create new one
      console.log('📝 [Heartbeat API] Creating new tracking record');
      
      const { error: createError } = await supabase
        .from('user_activity_tracking')
        .insert({
          user_id: userId,
          tutorial_id: tutorialIdNum,
          journey_id: journeyIdNum,
          first_opened_at: now.toISOString(),
          last_viewed_at: now.toISOString(),
          progress_percentage: 0,
          is_completed: false,
          duration_seconds: 0
        });

      if (createError) {
        throw new Error(`Failed to create tracking: ${createError.message}`);
      }

      console.log('✅ [Heartbeat API] New tracking record created');

      return Response.json({
        status: 'success',
        message: 'Heartbeat diterima. Status updated.'
      });
    }

    // Record exists - update duration
    const lastViewed = new Date(existingRecord.last_viewed_at);
    const deltaSeconds = Math.floor((now.getTime() - lastViewed.getTime()) / 1000);

    console.log(`⏱️ [Heartbeat API] Delta: ${deltaSeconds}s`);

    // Validate: Only add duration if delta is reasonable (< 5 minutes)
    // This prevents counting idle/sleep time
    const addedDuration = (deltaSeconds > 0 && deltaSeconds < 300) ? deltaSeconds : 0;

    if (addedDuration > 0) {
      console.log(`➕ [Heartbeat API] Adding ${addedDuration}s to duration`);
    } else {
      console.log(`⚠️ [Heartbeat API] Delta ${deltaSeconds}s is invalid, not adding to duration`);
    }

    // Update tracking record
    const { error: updateError } = await supabase
      .from('user_activity_tracking')
      .update({
        last_viewed_at: now.toISOString(),
        duration_seconds: (existingRecord.duration_seconds || 0) + addedDuration
      })
      .eq('tracking_id', existingRecord.tracking_id);

    if (updateError) {
      throw new Error(`Failed to update tracking: ${updateError.message}`);
    }

    console.log('✅ [Heartbeat API] Tracking updated successfully');

    return Response.json({
      status: 'success',
      message: 'Heartbeat diterima. Status updated.'
    });

  } catch (error) {
    console.error('❌ [Heartbeat API] Error:', error);

    return Response.json(
      { status: 'fail', message: 'Gagal merekam heartbeat.', error: error.message },
      { status: 500 }
    );
  }
}
