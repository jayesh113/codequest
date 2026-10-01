import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const QuizzesView = ({ onQuizCompleted }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizResult, setQuizResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || quizResult) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQuiz, quizResult, answers]);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const res = await API.getQuizzes();
      setQuizzes(res.quizzes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quizId) => {
    Sound.playClick();
    try {
      const res = await API.getQuiz(quizId);
      setActiveQuiz(res.quiz);
      setQuestions(res.questions || []);
      setAnswers({});
      setQuizResult(null);
      setTimeLeft((res.quiz.timeLimitMinutes || 10) * 60);
    } catch (e) {
      console.error(e);
    }
  };

  const selectOption = (questionId, optionIndex) => {
    Sound.playClick();
    setAnswers({
      ...answers,
      [String(questionId)]: optionIndex
    });
  };

  const handleSubmitQuiz = async () => {
    Sound.playClick();
    setSubmitting(true);
    try {
      const res = await API.submitQuiz(activeQuiz._id, answers);
      setQuizResult(res);
      if (res.passed) {
        Sound.playXP();
        if (window.confetti) {
          window.confetti({ particleCount: 90, spread: 60 });
        }
        if (onQuizCompleted) {
          onQuizCompleted(res.xpResult?.amount || activeQuiz.xpReward, `Completed Quiz: ${activeQuiz.title}`);
        }
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading quizzes...');
  }

  // Active Quiz Runner
  if (activeQuiz) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return React.createElement('div', { className: 'p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 text-left' },
      
      // Top Nav of Quiz
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('button', {
          onClick: () => { Sound.playClick(); setActiveQuiz(null); setQuizResult(null); },
          className: 'flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300'
        }, React.createElement(Icon, { name: 'ChevronLeft', size: 16 }), 'Exit Quiz'),

        !quizResult && React.createElement('div', {
          className: `flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            timeLeft < 60 ? 'border-rose-500/40 bg-rose-500/10 text-rose-300 animate-pulse' : 'border-slate-800 bg-slate-900 text-slate-300'
          }`
        },
          React.createElement(Icon, { name: 'Clock', size: 14 }),
          `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )
      ),

      // Quiz Info Header
      React.createElement('div', { className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-2' },
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'text-[10px] uppercase font-bold text-brand-400' }, activeQuiz.topic),
          React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, `${questions.length} Questions`)
        ),
        React.createElement('h2', { className: 'text-2xl font-black text-white' }, activeQuiz.title),
        React.createElement('p', { className: 'text-xs text-slate-300' }, activeQuiz.description)
      ),

      // Result Summary Card (if completed)
      quizResult && React.createElement('div', {
        className: `p-6 rounded-3xl glass-card border space-y-4 text-center ${
          quizResult.passed ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'
        }`
      },
        React.createElement('div', {
          className: `w-16 h-16 mx-auto rounded-2xl flex items-center justify-center font-black text-2xl ${
            quizResult.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`
        }, quizResult.passed ? '🎉' : '⚠️'),
        React.createElement('h3', { className: 'text-2xl font-black text-white' },
          quizResult.passed ? 'Quiz Passed!' : 'Quiz Needs Review'
        ),
        React.createElement('p', { className: 'text-xs text-slate-300' },
          `You scored ${quizResult.score} / ${quizResult.maxScore} (${quizResult.scorePercentage}%). Passing score was ${activeQuiz.passingScore}%.`
        ),
        quizResult.passed && React.createElement('div', { className: 'text-sm font-extrabold text-amber-400' },
          `+${quizResult.xpResult?.amount || activeQuiz.xpReward} XP Awarded!`
        )
      ),

      // Questions List
      React.createElement('div', { className: 'space-y-6' },
        questions.map((q, qIndex) => {
          const resItem = quizResult?.results?.find(r => String(r.questionId) === String(q._id));
          return React.createElement('div', {
            key: q._id || qIndex,
            className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-4'
          },
            React.createElement('div', { className: 'flex items-start gap-3' },
              React.createElement('span', { className: 'w-7 h-7 rounded-xl bg-slate-800 text-brand-400 font-bold text-xs flex items-center justify-center shrink-0' },
                qIndex + 1
              ),
              React.createElement('h4', { className: 'text-sm font-bold text-white leading-relaxed' }, q.question)
            ),

            React.createElement('div', { className: 'space-y-2 pt-2' },
              q.options.map((opt, optIndex) => {
                const isSelected = answers[String(q._id)] === optIndex;
                let optClass = 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700';

                if (quizResult && resItem) {
                  if (optIndex === resItem.correctOptionIndex) {
                    optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected && !resItem.isCorrect) {
                    optClass = 'bg-rose-950/40 border-rose-500 text-rose-300';
                  }
                } else if (isSelected) {
                  optClass = 'bg-brand-500/20 border-brand-500 text-white font-bold shadow-md shadow-brand-500/20';
                }

                return React.createElement('div', {
                  key: optIndex,
                  onClick: () => !quizResult && selectOption(q._id, optIndex),
                  className: `p-3.5 rounded-2xl border cursor-pointer text-xs transition-all flex items-center justify-between ${optClass}`
                },
                  React.createElement('span', null, opt),
                  isSelected && !quizResult && React.createElement(Icon, { name: 'Check', size: 16, className: 'text-brand-400' })
                );
              })
            ),

            // Explanation (in review mode)
            resItem && React.createElement('div', { className: 'p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1' },
              React.createElement('span', { className: 'font-bold text-brand-400 block' }, 'Explanation:'),
              React.createElement('p', { className: 'text-slate-300 leading-relaxed' }, resItem.explanation)
            )
          );
        })
      ),

      // Submit Button (if quiz active)
      !quizResult && React.createElement('div', { className: 'pt-4 flex justify-end' },
        React.createElement('button', {
          onClick: handleSubmitQuiz,
          disabled: submitting,
          className: 'px-8 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all'
        }, submitting ? 'Grading Quiz...' : 'Submit Answers & Calculate Score')
      )
    );
  }

  // Quizzes Catalog Grid
  return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white' }, 'Interactive Quizzes'),
      React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
        'Timed multiple-choice tests with immediate XP scoring and detailed question explanations.'
      )
    ),

    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
      quizzes.map((q, idx) =>
        React.createElement('div', {
          key: q._id || idx,
          className: 'p-6 rounded-3xl glass-card border border-slate-800 hover:border-brand-500/40 flex flex-col justify-between space-y-4 shadow-lg transition-all duration-200'
        },
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-300' }, q.topic),
              React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300' }, q.difficulty)
            ),
            React.createElement('h3', { className: 'text-base font-bold text-white' }, q.title),
            React.createElement('p', { className: 'text-xs text-slate-400 line-clamp-2 leading-relaxed' }, q.description)
          ),

          React.createElement('div', { className: 'pt-4 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('div', { className: 'flex items-center gap-1.5 text-amber-400 font-bold' },
              React.createElement(Icon, { name: 'Zap', size: 14 }),
              `+${q.xpReward} XP`
            ),
            React.createElement('button', {
              onClick: () => startQuiz(q._id),
              className: 'px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all'
            }, 'Start Quiz →')
          )
        )
      )
    )
  );
};