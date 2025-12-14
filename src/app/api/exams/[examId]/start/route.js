import supabase from '@/lib/supabaseClient';

// Helper: Check if user completed all tutorials in journey
async function checkTutorialCompletion(userId, journeyId) {
  try {
    // 1. Count total tutorials in journey
    const { count: totalTutorials, error: countError } = await supabase
      .from('tutorial')
      .select('*', { count: 'exact', head: true })
      .eq('journey_id', journeyId);

    if (countError) {
      console.error('❌ Error counting tutorials:', countError);
      return false;
    }

    if (!totalTutorials || totalTutorials === 0) {
      console.log('⚠️ No tutorials found for journey:', journeyId);
      return false;
    }

    console.log(`📚 Total tutorials in journey ${journeyId}:`, totalTutorials);

    // 2. Get completed tutorials by user (distinct to avoid duplicates)
    const { data: completedTutorials, error: completedError } = await supabase
      .from('user_activity_tracking')
      .select('tutorial_id')
      .eq('user_id', userId)
      .eq('journey_id', journeyId)
      .eq('is_completed', true);

    if (completedError) {
      console.error('❌ Error fetching completed tutorials:', completedError);
      return false;
    }

    // 3. Get unique tutorial IDs
    const uniqueCompleted = new Set(
      completedTutorials?.map(t => t.tutorial_id) || []
    );

    console.log(`✅ Completed tutorials: ${uniqueCompleted.size}/${totalTutorials}`);

    return totalTutorials === uniqueCompleted.size;
  } catch (error) {
    console.error('❌ Error in checkTutorialCompletion:', error);
    return false;
  }
}

export async function GET(request, context) {
  // Next.js 15: params is now a Promise
  const { examId } = await context.params;
  
  console.log('🎯 [Exam API] Starting exam:', examId);

  try {
    const examIdInt = parseInt(examId, 10);
    
    if (isNaN(examIdInt)) {
      return Response.json(
        { status: 'fail', message: 'Invalid exam ID.' },
        { status: 400 }
      );
    }

    // 1. Get user_id from request body or query params
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('user_id');
    
    if (!userIdParam) {
      return Response.json(
        { status: 'fail', message: 'User ID required. Please login.' },
        { status: 401 }
      );
    }

    const userId = parseInt(userIdParam, 10);
    console.log('👤 [Exam API] User ID:', userId);

    // 2. Fetch exam details
    const { data: examData, error: examError } = await supabase
      .from('final_exams')
      .select('exam_id, journey_id, title, duration_seconds, passing_score')
      .eq('exam_id', examIdInt)
      .single();

    if (examError || !examData) {
      console.error('❌ [Exam API] Exam not found:', examError);
      return Response.json(
        { status: 'fail', message: 'Ujian tidak ditemukan.' },
        { status: 404 }
      );
    }

    console.log('✅ [Exam API] Exam data:', examData);

    // 3. Fetch questions (without correct_answer)
    const { data: questions, error: questionsError } = await supabase
      .from('exam_questions')
      .select('question_no, question_text, option_a, option_b, option_c, option_d')
      .eq('exam_id', examIdInt)
      .order('question_no', { ascending: true });

    if (questionsError || !questions || questions.length === 0) {
      console.error('❌ [Exam API] No questions found:', questionsError);
      return Response.json(
        { status: 'fail', message: 'Ujian tidak memiliki soal.' },
        { status: 404 }
      );
    }

    console.log('✅ [Exam API] Questions fetched:', questions.length);

    // 4. Check prerequisites - Tutorial completion (DISABLED FOR DEVELOPMENT)
    // TODO: Re-enable this in production after tutorial data is complete
    const isJourneyCompleted = await checkTutorialCompletion(userId, examData.journey_id);

    if (!isJourneyCompleted) {
      console.warn('⚠️ [Exam API] Prerequisites not met for user:', userId, '(allowing access for development)');
      // return Response.json(
      //   { 
      //     status: 'fail', 
      //     message: 'Akses ditolak. Anda harus menyelesaikan seluruh materi (tutorial) dalam journey ini sebelum mengakses ujian.' 
      //   },
      //   { status: 403 }
      // );
    } else {
      console.log('✅ [Exam API] Prerequisites met');
    }

    // 5. Check or create exam_registrations
    let { data: registration, error: regFetchError } = await supabase
      .from('exam_registrations')
      .select('*')
      .eq('user_id', userId)
      .eq('exam_id', examIdInt)
      .maybeSingle();

    if (regFetchError) {
      console.error('❌ [Exam API] Error fetching registration:', regFetchError);
    }

    if (registration) {
      console.log('📋 [Exam API] Existing registration found:', registration.registration_id);
      
      // Check if already finished
      if (registration.exam_finished_at) {
        return Response.json(
          { 
            status: 'fail', 
            message: 'Anda sudah menyelesaikan ujian ini sebelumnya.',
            data: { finished_at: registration.exam_finished_at }
          },
          { status: 400 }
        );
      }
    } else {
      // Auto-create registration
      console.log('📝 [Exam API] Creating new registration...');
      const { data: newReg, error: createError } = await supabase
        .from('exam_registrations')
        .insert({
          user_id: userId,
          exam_id: examIdInt,
          journey_id: examData.journey_id,
          is_materi_clear: true,
          registered_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ [Exam API] Error creating registration:', createError);
        return Response.json(
          { status: 'fail', message: 'Gagal mendaftarkan ujian.' },
          { status: 500 }
        );
      }

      registration = newReg;
      console.log('✅ [Exam API] Registration created:', registration.registration_id);
    }

    // 6. Set started_at if not set (PERSISTENT TIMER)
    let startedAt = registration.started_at;

    if (!startedAt) {
      console.log('⏰ [Exam API] Setting started_at...');
      const { data: updated, error: updateError } = await supabase
        .from('exam_registrations')
        .update({ started_at: new Date().toISOString() })
        .eq('registration_id', registration.registration_id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ [Exam API] Error updating started_at:', updateError);
      } else {
        startedAt = updated.started_at;
        console.log('✅ [Exam API] Started at:', startedAt);
      }
    } else {
      console.log('⏰ [Exam API] Using existing started_at:', startedAt);
    }

    // 7. Calculate remaining time
    const now = new Date();
    const startTime = new Date(startedAt);
    const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const remainingSeconds = Math.max(0, examData.duration_seconds - elapsedSeconds);

    console.log(`⏱️ [Exam API] Elapsed: ${elapsedSeconds}s, Remaining: ${remainingSeconds}s`);

    // Check if time expired
    if (remainingSeconds === 0) {
      return Response.json(
        { 
          status: 'fail', 
          message: 'Waktu ujian telah habis. Silakan submit jawaban Anda.',
          data: {
            started_at: startedAt,
            elapsed_seconds: elapsedSeconds,
            time_expired: true
          }
        },
        { status: 400 }
      );
    }

    // 8. Return exam with persistent timer
    const isNewStart = elapsedSeconds < 5;
    const response = {
      status: 'success',
      message: isNewStart 
        ? 'Soal ujian berhasil diambil. Selamat mengerjakan.'
        : 'Melanjutkan ujian. Waktu terus berjalan.',
      data: {
        exam: {
          exam_id: examData.exam_id,
          title: examData.title,
          duration_seconds: examData.duration_seconds,
          passing_score: examData.passing_score,
          total_questions: questions.length,
          started_at: startedAt,           // ✅ Persistent
          remaining_seconds: remainingSeconds, // ✅ Calculated from server
          elapsed_seconds: elapsedSeconds      // ✅ Calculated from server
        },
        questions: questions
      }
    };

    console.log('✅ [Exam API] Response ready with', questions.length, 'questions');

    return Response.json(response);

  } catch (error) {
    console.error('❌ [Exam API] Unexpected error:', error);
    
    // Handle unique constraint error
    if (error.code === 'P2002' || error.message?.includes('duplicate')) {
      return Response.json(
        { status: 'fail', message: 'Konflik registrasi ujian. Silakan refresh halaman.' },
        { status: 409 }
      );
    }

    return Response.json(
      { status: 'fail', message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
