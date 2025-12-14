import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request, context) {
  // Next.js 15: params is now a Promise and must be awaited
  const { journeyId } = await context.params;
  
  console.log('🔍 [API Route] Fetching journey:', journeyId);

  try {
    // Get auth token from request headers
    const authHeader = request.headers.get('Authorization');
    
    // 1. Fetch journey details from backend Express API
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-ai-learning-insight-production.up.railway.app';
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Forward auth token if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    console.log('📡 [API Route] Calling backend:', `${backendUrl}/journeys/${journeyId}`);
    
    const backendResponse = await fetch(`${backendUrl}/journeys/${journeyId}`, {
      headers,
    });

    if (!backendResponse.ok) {
      console.error('❌ [API Route] Backend error:', backendResponse.status);
      return Response.json(
        { status: 'fail', message: 'Failed to fetch journey from backend' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    console.log('✅ [API Route] Backend data received:', backendData);

    // 2. Fetch exam_id and title from Supabase final_exams table
    console.log('🔍 [API Route] Querying Supabase for exam data...');
    const { data: examData, error } = await supabase
      .from('final_exams')
      .select('exam_id, title')
      .eq('journey_id', parseInt(journeyId))
      .single();

    if (error) {
      console.error('❌ [API Route] Supabase error:', error);
      // If Supabase fails, still return backend data (without exam info)
      return Response.json(backendData);
    }

    console.log('✅ [API Route] Supabase exam data:', examData);

    // 3. Merge exam data into backend response
    if (backendData.data && examData) {
      backendData.data.exam_id = examData.exam_id;
      backendData.data.exam_title = examData.title;
      console.log('✅ [API Route] Merged data:', {
        exam_id: backendData.data.exam_id,
        exam_title: backendData.data.exam_title
      });
    } else {
      console.warn('⚠️ [API Route] No exam data to merge');
    }

    // 4. Return enhanced data
    return Response.json(backendData);

  } catch (error) {
    console.error('❌ [API Route] Error:', error);
    return Response.json(
      { status: 'fail', message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
