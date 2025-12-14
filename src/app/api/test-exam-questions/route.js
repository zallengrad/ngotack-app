import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('🔍 Testing exam_questions table...');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test 1: Get all exam_questions
    console.log('📝 Test 1: Fetching all exam_questions...');
    const { data: allQuestions, error: allError } = await supabase
      .from('exam_questions')
      .select('*')
      .limit(5);

    if (allError) {
      console.error('❌ Error fetching all questions:', allError);
    } else {
      console.log('✅ All questions:', allQuestions);
    }

    // Test 2: Get questions for exam_id = 3
    console.log('📝 Test 2: Fetching questions for exam_id = 3...');
    const { data: exam3Questions, error: exam3Error } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('exam_id', 3);

    if (exam3Error) {
      console.error('❌ Error fetching exam 3 questions:', exam3Error);
    } else {
      console.log('✅ Exam 3 questions:', exam3Questions);
    }

    return Response.json({
      success: true,
      tests: {
        allQuestions: {
          success: !allError,
          error: allError?.message,
          data: allQuestions,
          count: allQuestions?.length || 0
        },
        exam3Questions: {
          success: !exam3Error,
          error: exam3Error?.message,
          data: exam3Questions,
          count: exam3Questions?.length || 0
        }
      },
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
