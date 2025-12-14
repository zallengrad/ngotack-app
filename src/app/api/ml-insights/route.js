import { NextResponse } from 'next/server';

// ML Service Configuration
const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'https://adamnwr-ml-insight-microservice.hf.space';
const ML_SERVICE_TOKEN = process.env.ML_SERVICE_TOKEN || 'QUxMIFlPVVIgQkFTRSBBUkUgQkVMT05HIFRPIFVT';

/**
 * POST /api/ml-insights
 * Direct proxy to ML service for generating learning insights
 * 
 * This bypasses the backend Node.js and calls ML service directly
 * while keeping the token secure on the server-side
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { userId, stats, userProfile } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { status: 'error', message: 'userId is required' },
        { status: 400 }
      );
    }

    if (!stats) {
      return NextResponse.json(
        { status: 'error', message: 'stats is required' },
        { status: 400 }
      );
    }

    console.log(`🤖 [ML Proxy] Calling ML service for user ${userId}...`);

    // Call ML service
    const mlResponse = await fetch(`${ML_SERVICE_URL}/api/predict/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SERVICE-TOKEN': ML_SERVICE_TOKEN
      },
      body: JSON.stringify({
        stats: {
          avg_study_duration_hours: Number(stats.avg_study_duration_hours) || 0,
          total_tutorial_completed: Number(stats.total_tutorial_completed) || 0,
          total_study_days: Number(stats.total_study_days) || 0,
          consistency_score: Number(stats.consistency_score) || 0,
          avg_exam_score: Number(stats.avg_exam_score) || 0
        },
        user_profile: {
          name: userProfile?.name || 'User'
        }
      })
    });

    // Check if ML service responded successfully
    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error(`❌ [ML Proxy] ML service error (${mlResponse.status}):`, errorText);
      
      return NextResponse.json(
        { 
          status: 'error', 
          message: `ML service error: ${mlResponse.statusText}` 
        },
        { status: mlResponse.status }
      );
    }

    // Parse ML service response
    const mlData = await mlResponse.json();
    console.log('✅ [ML Proxy] ML service response:', mlData);

    // Return ML service response
    return NextResponse.json(mlData);

  } catch (error) {
    console.error('❌ [ML Proxy] Error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Failed to call ML service' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ml-insights
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'ML Insights Proxy API',
    mlServiceUrl: ML_SERVICE_URL,
    tokenConfigured: !!ML_SERVICE_TOKEN
  });
}
