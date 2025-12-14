import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request, context) {
  // Next.js 15: params is now a Promise
  const { examId } = await context.params;
  
  console.log('📝 [Submit Exam API] Submitting exam:', examId);

  try {
    // Get request body
    const body = await request.json();
    const { answers } = body;
    
    console.log('📝 [Submit Exam API] Answers received:', answers);

    // 2. Fetch all questions with correct answers
    const { data: allQuestions, error: questionsError } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('exam_id', parseInt(examId))
      .order('question_no', { ascending: true });

    if (questionsError) {
      console.error('❌ [Submit Exam API] Error fetching questions:', questionsError);
      return Response.json(
        { status: 'fail', message: 'Gagal mengambil kunci jawaban' },
        { status: 500 }
      );
    }

    console.log('✅ [Submit Exam API] Questions fetched:', allQuestions.length);

    // 3. Calculate score
    let correctCount = 0;
    const results = answers.map(answer => {
      // Find question by question_no
      const question = allQuestions.find(q => q.question_no === answer.question_no);
      
      if (!question) {
        console.warn(`⚠️ Question not found for question_no: ${answer.question_no}`);
        return {
          question_no: answer.question_no,
          selected_option: answer.selected_option,
          correct_answer: null,
          is_correct: false
        };
      }

      // Get the correct option text based on correct_answer letter
      const correctOptionKey = `option_${question.correct_answer.toLowerCase()}`;
      const correctOptionText = question[correctOptionKey];
      
      // Compare selected option text with correct option text
      const isCorrect = answer.selected_option === correctOptionText;
      
      if (isCorrect) correctCount++;
      
      console.log(`Question ${answer.question_no}: Selected="${answer.selected_option}", Correct="${correctOptionText}", Match=${isCorrect}`);
      
      return {
        question_id: question.question_id,
        question_no: question.question_no,
        question_text: question.question_text,
        selected_option: answer.selected_option,
        correct_answer: question.correct_answer,
        correct_option_text: correctOptionText,
        is_correct: isCorrect
      };
    });

    const score = Math.round((correctCount / allQuestions.length) * 100);
    
    console.log(`✅ [Submit Exam API] Score calculated: ${score}% (${correctCount}/${allQuestions.length})`);

    // 3. Get exam details for passing score
    const { data: examData } = await supabase
      .from('final_exams')
      .select('passing_score, title')
      .eq('exam_id', parseInt(examId))
      .single();

    const passed = score >= (examData?.passing_score || 70);

    // 4. Get user_id, start_time, and duration from request body
    const { user_id, start_time, duration_seconds } = body;
    console.log('👤 [Submit Exam API] User ID:', user_id);
    console.log('⏰ [Submit Exam API] Start time:', start_time);
    console.log('⏱️ [Submit Exam API] Duration:', duration_seconds, 'seconds');

    // 5. Save to exam_submissions table
    let submissionId = null;
    try {
      const { data: submissionData, error: submissionError } = await supabase
        .from('exam_submissions')
        .insert({
          user_id: user_id, // From request body
          exam_id: parseInt(examId),
          score: score,
          is_passed: passed,
          start_time: start_time, // From request body
          submit_time: new Date().toISOString(),
          duration_seconds: duration_seconds, // From request body
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (submissionError) {
        console.error('⚠️ [Submit Exam API] Error saving submission:', submissionError);
        // Don't fail the request, just log the error
      } else {
        submissionId = submissionData.submission_id;
        console.log('✅ [Submit Exam API] Submission saved with ID:', submissionId);

        // 6. Save individual answers to exam_answers table
        if (submissionId) {
          const answersToInsert = results.map(result => ({
            submission_id: submissionId,
            question_no: result.question_no,
            selected_option: result.selected_option,
            is_correct: result.is_correct
          }));

          const { error: answersError } = await supabase
            .from('exam_answers')
            .insert(answersToInsert);

          if (answersError) {
            console.error('⚠️ [Submit Exam API] Error saving answers:', answersError);
          } else {
            console.log('✅ [Submit Exam API] Saved', answersToInsert.length, 'answers');
          }
        }
      }
    } catch (dbError) {
      console.error('⚠️ [Submit Exam API] Database error:', dbError);
      // Continue anyway, don't fail the request
    }

    // 7. Return response
    const response = {
      status: 'success',
      message: passed ? 'Selamat! Anda lulus ujian.' : 'Maaf, Anda belum lulus ujian.',
      data: {
        exam_id: parseInt(examId),
        exam_title: examData?.title,
        score: score,
        correct_answers: correctCount,
        total_questions: allQuestions.length,
        passing_score: examData?.passing_score || 70,
        passed: passed,
        submission_id: submissionId,
        duration_seconds: duration_seconds, // Add duration to response
        results: results
      }
    };

    console.log('✅ [Submit Exam API] Response ready:', response.data);

    return Response.json(response);

  } catch (error) {
    console.error('❌ [Submit Exam API] Unexpected error:', error);
    return Response.json(
      { status: 'fail', message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
