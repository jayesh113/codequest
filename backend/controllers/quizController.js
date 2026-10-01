import { Quiz, QuizQuestion } from '../models/index.js';
import { awardXP, recordDailyActivity } from '../services/gamificationService.js';

export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    const enriched = [];

    for (const q of quizzes) {
      const qCount = await QuizQuestion.countDocuments({ quizId: q._id });
      enriched.push({
        ...q,
        questionCount: qCount
      });
    }

    res.json({ success: true, quizzes: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await QuizQuestion.find({ quizId: quiz._id });
    const sanitizedQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      points: q.points
    }));

    res.json({
      success: true,
      quiz,
      questions: sanitizedQuestions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const questions = await QuizQuestion.find({ quizId: quiz._id });
    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    for (const q of questions) {
      maxScore += q.points || 10;
      const selected = answers ? answers[String(q._id)] : undefined;
      const isCorrect = selected === q.correctOptionIndex;

      if (isCorrect) {
        totalScore += q.points || 10;
      }

      results.push({
        questionId: q._id,
        question: q.question,
        selectedOptionIndex: selected,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
        isCorrect
      });
    }

    const scorePercentage = Math.round((totalScore / (maxScore || 1)) * 100);
    const passed = scorePercentage >= (quiz.passingScore || 70);

    let xpResult = { awarded: false };

    if (passed) {
      const earnedXP = Math.round(((quiz.xpReward || 80) * scorePercentage) / 100);
      xpResult = await awardXP(
        req.user._id,
        earnedXP,
        'quiz',
        String(quiz._id),
        `Passed Quiz: ${quiz.title} (${scorePercentage}%)`
      );

      await recordDailyActivity(req.user._id, `Passed quiz: ${quiz.title}`);
    }

    res.json({
      success: true,
      score: totalScore,
      maxScore,
      scorePercentage,
      passed,
      results,
      xpResult
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};