import React, { useState } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";

export const DashboardView = ({ data, onNavigate, onOpenTask, onCompleteModule, onClaimAnnouncementXP }) => {
  if (!data) {
    return React.createElement('div', { className: 'p-8 text-center text-slate-400' }, 'Loading student dashboard...');
  }

  const { welcome, threeQuestions, continueLearning, todayChallenge, recentAchievements, leaderboardPreview, currentUserRank, announcements } = data;
  const { learnNext, doToday, progressMade } = threeQuestions;
  const levelInfo = progressMade.levelInfo;

  return React.createElement('div', { className: 'space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    
    // ANNOUNCEMENTS BANNER
    announcements && announcements.length > 0 && React.createElement('div', {
      className: 'p-4 rounded-2xl bg-gradient-to-r from-brand-900/40 via-indigo-900/30 to-slate-900 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg'
    },
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement('span', { className: 'w-2 h-2 rounded-full bg-brand-400 animate-ping shrink-0' }),
        React.createElement('div', null,
          React.createElement('span', { className: 'text-xs font-bold text-white block sm:inline' }, announcements[0].title),
          React.createElement('span', { className: 'text-xs text-slate-300 sm:ml-2' }, announcements[0].content)
        )
      ),
      announcements[0].xpReward > 0 && React.createElement('span', {
        className: 'self-start sm:self-auto px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold shrink-0'
      }, `+${announcements[0].xpReward} XP Event`)
    ),

    // WELCOME HEADER
    React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white tracking-tight' },
          `Welcome back, ${welcome.name} 👋`
        ),
        React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
          'Your coding journey is in full swing. Check your daily objectives below!'
        )
      ),
      React.createElement('div', { className: 'flex items-center gap-3 self-start md:self-auto' },
        React.createElement('div', { className: 'px-4 py-2 rounded-2xl glass-card border border-amber-500/30 flex items-center gap-2.5' },
          React.createElement(Icon, { name: 'Flame', size: 20, className: 'text-amber-400 animate-pulse' }),
          React.createElement('div', null,
            React.createElement('div', { className: 'text-[10px] uppercase font-bold text-amber-400' }, 'Streak'),
            React.createElement('div', { className: 'text-sm font-black text-white' }, `${welcome.streakCount} Days`)
          )
        ),
        React.createElement('div', { className: 'px-4 py-2 rounded-2xl glass-card border border-brand-500/30 flex items-center gap-2.5' },
          React.createElement(Icon, { name: 'Zap', size: 20, className: 'text-brand-400' }),
          React.createElement('div', null,
            React.createElement('div', { className: 'text-[10px] uppercase font-bold text-brand-400' }, `Level ${levelInfo.level}`),
            React.createElement('div', { className: 'text-sm font-black text-white' }, `${levelInfo.currentXP} XP`)
          )
        )
      )
    ),

    // ==========================================
    // THE 3 CORE UX QUESTIONS (PROMINENT SECTION)
    // ==========================================
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
      
      // Question 1: WHAT SHOULD I DO TODAY?
      React.createElement('div', { className: 'rounded-3xl p-6 glass-card border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between' },
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5' },
              React.createElement(Icon, { name: 'Target', size: 14 }),
              '1. What Should I Do Today?'
            ),
            React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300' }, 'Daily Goal')
          ),
          React.createElement('div', null,
            React.createElement('div', { className: 'flex justify-between items-center text-xs font-bold text-slate-200 mb-1.5' },
              React.createElement('span', null, `Complete ${doToday.dailyGoal.target} tasks today`),
              React.createElement('span', { className: 'text-cyan-400' }, `${doToday.dailyGoal.completed}/${doToday.dailyGoal.target} Done`)
            ),
            React.createElement('div', { className: 'w-full h-2 rounded-full bg-slate-800 overflow-hidden' },
              React.createElement('div', {
                className: 'h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500',
                style: { width: `${Math.min(100, Math.round((doToday.dailyGoal.completed / doToday.dailyGoal.target) * 100))}%` }
              })
            )
          ),
          React.createElement('div', { className: 'space-y-2 pt-2' },
            doToday.tasks.slice(0, 3).map((t, idx) =>
              React.createElement('div', {
                key: t._id || idx,
                onClick: () => { Sound.playClick(); onOpenTask(t); },
                className: 'p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer flex items-center justify-between transition-all'
              },
                React.createElement('div', { className: 'flex items-center gap-2.5 min-w-0' },
                  React.createElement('span', {
                    className: `w-2 h-2 rounded-full shrink-0 ${t.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-amber-400'}`
                  }),
                  React.createElement('span', { className: 'text-xs font-semibold text-slate-200 truncate' }, t.title)
                ),
                React.createElement('span', { className: 'text-[11px] font-bold text-amber-400 shrink-0 ml-2' }, `+${t.xpReward} XP`)
              )
            )
          )
        ),
        React.createElement('button', {
          onClick: () => { Sound.playClick(); onNavigate('tasks'); },
          className: 'w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all text-center'
        }, 'View All Tasks →')
      ),

      // Question 2: WHAT SHOULD I LEARN NEXT?
      React.createElement('div', { className: 'rounded-3xl p-6 glass-card border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between' },
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5' },
              React.createElement(Icon, { name: 'BookOpen', size: 14 }),
              '2. What Should I Learn Next?'
            ),
            React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300' }, 'Recommended')
          ),
          learnNext.path && React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', { className: 'p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20' },
              React.createElement('span', { className: 'text-[10px] uppercase font-bold text-indigo-400' }, learnNext.path.title),
              React.createElement('h4', { className: 'text-base font-bold text-white mt-0.5' },
                learnNext.module ? learnNext.module.title : 'Course Completed!'
              ),
              React.createElement('p', { className: 'text-xs text-slate-400 mt-1 line-clamp-2' },
                learnNext.module ? learnNext.module.description : 'Explore another curriculum track below.'
              )
            ),
            React.createElement('div', null,
              React.createElement('div', { className: 'flex justify-between text-xs font-bold text-slate-300 mb-1' },
                React.createElement('span', null, 'Track Progress'),
                React.createElement('span', { className: 'text-indigo-400' }, `${learnNext.path.progressPercent || 0}%`)
              ),
              React.createElement('div', { className: 'w-full h-2 rounded-full bg-slate-800 overflow-hidden' },
                React.createElement('div', {
                  className: 'h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full',
                  style: { width: `${learnNext.path.progressPercent || 0}%` }
                })
              )
            )
          )
        ),
        React.createElement('button', {
          onClick: () => { Sound.playClick(); onNavigate('paths'); },
          className: 'w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all text-center'
        }, 'Continue Learning →')
      ),

      // Question 3: HOW MUCH PROGRESS HAVE I MADE?
      React.createElement('div', { className: 'rounded-3xl p-6 glass-card border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between' },
        React.createElement('div', { className: 'space-y-3' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('span', { className: 'text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5' },
              React.createElement(Icon, { name: 'BarChart3', size: 14 }),
              '3. How Much Progress Made?'
            ),
            React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300' }, 'Stats')
          ),
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', null,
              React.createElement('div', { className: 'flex justify-between items-center text-xs font-bold text-slate-200 mb-1' },
                React.createElement('span', { className: 'text-brand-400' }, `LEVEL ${levelInfo.level}`),
                React.createElement('span', { className: 'text-slate-400' }, `${levelInfo.currentXP} / ${levelInfo.xpForNextLevel} XP`)
              ),
              React.createElement('div', { className: 'w-full h-2 rounded-full bg-slate-800 overflow-hidden' },
                React.createElement('div', {
                  className: 'h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-brand-500 rounded-full transition-all duration-500',
                  style: { width: `${levelInfo.progressPercent}%` }
                })
              )
            ),
            React.createElement('div', { className: 'grid grid-cols-2 gap-3 pt-1' },
              React.createElement('div', { className: 'p-3 rounded-2xl bg-slate-900/60 border border-slate-800' },
                React.createElement('div', { className: 'text-lg font-black text-white' }, progressMade.solvedCount),
                React.createElement('div', { className: 'text-[10px] font-semibold text-slate-400' }, 'Problems Solved')
              ),
              React.createElement('div', { className: 'p-3 rounded-2xl bg-slate-900/60 border border-slate-800' },
                React.createElement('div', { className: 'text-lg font-black text-white' }, progressMade.tasksCompletedCount),
                React.createElement('div', { className: 'text-[10px] font-semibold text-slate-400' }, 'Tasks Finished')
              )
            ),
            React.createElement('div', { className: 'p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs' },
              React.createElement('span', { className: 'text-slate-300 font-medium' }, 'Leaderboard Rank:'),
              React.createElement('span', { className: 'font-black text-amber-300' }, `#${currentUserRank} of 11 Students`)
            )
          )
        ),
        React.createElement('button', {
          onClick: () => { Sound.playClick(); onNavigate('profile'); },
          className: 'w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all text-center'
        }, 'View Full Profile →')
      )
    ),

    // CONTINUE LEARNING CAROUSEL / CARDS
    React.createElement('section', { className: 'space-y-4' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('h3', { className: 'text-lg font-bold text-white' }, 'Continue Learning'),
        React.createElement('button', {
          onClick: () => onNavigate('paths'),
          className: 'text-xs font-bold text-brand-400 hover:text-brand-300'
        }, 'All Curricula →')
      ),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
        continueLearning.slice(0, 3).map((p, idx) =>
          React.createElement('div', {
            key: p._id || idx,
            className: 'p-5 rounded-3xl glass-card border border-slate-800 space-y-3'
          },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 uppercase' }, p.category),
              React.createElement('span', { className: 'text-xs font-bold text-brand-400' }, `${p.progressPercent}%`)
            ),
            React.createElement('h4', { className: 'text-base font-bold text-white' }, p.title),
            React.createElement('div', { className: 'w-full h-1.5 rounded-full bg-slate-800 overflow-hidden' },
              React.createElement('div', {
                className: 'h-full bg-brand-500 rounded-full',
                style: { width: `${p.progressPercent}%` }
              })
            ),
            React.createElement('button', {
              onClick: () => { Sound.playClick(); onNavigate('paths'); },
              className: 'w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-bold text-slate-200 transition-all'
            }, 'Continue Track')
          )
        )
      )
    ),

    // TODAY'S CHALLENGE SPOTLIGHT & LEADERBOARD PREVIEW
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-6' },
      
      // Today's Challenge Spotlight (2 cols)
      todayChallenge && React.createElement('div', {
        className: 'lg:col-span-2 p-6 rounded-3xl bg-gradient-to-r from-brand-950/60 via-slate-900 to-slate-900/80 border border-brand-500/30 flex flex-col justify-between space-y-4'
      },
        React.createElement('div', { className: 'space-y-2' },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', { className: 'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300' }, 'TODAY\'S CHALLENGE'),
            React.createElement('span', { className: 'text-xs font-semibold text-slate-400' }, todayChallenge.difficulty)
          ),
          React.createElement('h3', { className: 'text-2xl font-black text-white' }, todayChallenge.title),
          React.createElement('p', { className: 'text-xs text-slate-300 line-clamp-2 max-w-xl' }, todayChallenge.description)
        ),
        React.createElement('div', { className: 'flex items-center justify-between pt-4 border-t border-slate-800/80' },
          React.createElement('span', { className: 'text-xs font-black text-amber-400 flex items-center gap-1.5' },
            React.createElement(Icon, { name: 'Zap', size: 16 }),
            `+${todayChallenge.xpReward} XP Reward`
          ),
          React.createElement('button', {
            onClick: () => { Sound.playClick(); onNavigate('challenges'); },
            className: 'px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all'
          }, 'Solve in IDE ⚔️')
        )
      ),

      // Leaderboard Preview (1 col)
      React.createElement('div', { className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-3' },
        React.createElement('div', { className: 'flex items-center justify-between pb-2 border-b border-slate-800' },
          React.createElement('h4', { className: 'font-bold text-sm text-white flex items-center gap-2' },
            React.createElement(Icon, { name: 'Trophy', size: 16, className: 'text-amber-400' }),
            'Leaderboard'
          ),
          React.createElement('button', {
            onClick: () => onNavigate('leaderboard'),
            className: 'text-[11px] font-bold text-brand-400 hover:text-brand-300'
          }, 'View All')
        ),
        React.createElement('div', { className: 'space-y-2' },
          leaderboardPreview.slice(0, 5).map(s =>
            React.createElement('div', {
              key: s.rank,
              className: `flex items-center justify-between p-2 rounded-xl text-xs ${
                s.isCurrentUser ? 'bg-brand-500/20 border border-brand-500/40 font-bold' : 'hover:bg-slate-800/40'
              }`
            },
              React.createElement('div', { className: 'flex items-center gap-2.5 truncate' },
                React.createElement('span', {
                  className: `w-5 text-center font-black ${
                    s.rank === 1 ? 'text-amber-400' : s.rank === 2 ? 'text-slate-300' : s.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                  }`
                }, s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : `#${s.rank}`),
                React.createElement('img', { src: s.avatar, alt: s.name, className: 'w-6 h-6 rounded-lg bg-slate-800' }),
                React.createElement('span', { className: 'truncate text-slate-200' }, s.name)
              ),
              React.createElement('span', { className: 'text-amber-400 font-extrabold shrink-0' }, `${s.currentXP} XP`)
            )
          )
        )
      )
    )
  );
};