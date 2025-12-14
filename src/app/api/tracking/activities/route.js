import supabase from '@/lib/supabaseClient';

export async function GET(request) {
  console.log('📋 [Activities API] Fetching user activities');

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const user_id = searchParams.get('user_id');

    console.log('📋 [Activities API] Params:', { limit, offset, user_id });

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

    // Fetch user activities with tutorial and journey info
    const { data: activities, error: activitiesError, count } = await supabase
      .from('user_activity_tracking')
      .select(`
        *,
        tutorial:tutorial_id (
          tutorial_id,
          title,
          journey_id
        ),
        journeys:journey_id (
          journey_id,
          title,
          description
        )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .order('last_viewed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (activitiesError) {
      console.error('❌ [Activities API] Error fetching activities:', activitiesError);
      throw new Error(`Failed to fetch activities: ${activitiesError.message}`);
    }

    console.log(`✅ [Activities API] Fetched ${activities?.length || 0} activities`);

    // Calculate pagination
    const total = count || 0;
    const hasMore = (offset + limit) < total;

    const result = {
      activities: activities || [],
      pagination: {
        total,
        limit,
        offset,
        hasMore
      }
    };

    console.log('📊 [Activities API] Result:', {
      count: activities?.length,
      total,
      hasMore
    });

    return Response.json({
      status: 'success',
      message: 'Aktivitas pengguna berhasil diambil.',
      data: result
    });

  } catch (error) {
    console.error('❌ [Activities API] Error:', error);

    return Response.json(
      { status: 'fail', message: 'Gagal mengambil aktivitas pengguna.', error: error.message },
      { status: 500 }
    );
  }
}
