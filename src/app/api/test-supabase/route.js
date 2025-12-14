import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test query
    const { data, error } = await supabase
      .from('final_exams')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Supabase error:', error);
      return Response.json({
        success: false,
        error: error.message,
        details: error
      });
    }

    console.log('✅ Supabase data:', data);
    
    return Response.json({
      success: true,
      message: 'Supabase connection successful',
      data: data,
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
