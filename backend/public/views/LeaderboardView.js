import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const LeaderboardView = ({ currentUser }) => {
  const [period, setPeriod] = useState('all');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await API.getLeaderboard(period);
      setLeaderboard(res.leaderboard || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'all', label: 'All-Time' }
  ];

  return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto text-left' },
    
    // Header
    React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5' },
          React.createElement(Icon, { name: 'Trophy', size: 28, className: 'text-amber-400' }),
          'Student Leaderboard'
        ),
        React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
          'Compete with fellow coders, solve problems, earn XP, and climb the ranks.'
        )
      ),

      // Period Filter Tabs
      React.createElement('div', { className: 'flex items-center gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800' },
        periods.map(p =>
          React.createElement('button', {
            key: p.id,
            onClick: () => { Sound.playClick(); setPeriod(p.id); },
            className: `px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              period === p.id
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-white'
            }`
          }, p.label)
        )
      )
    ),

    // Top 3 Podium
    !loading && leaderboard.length >= 3 && React.createElement('div', { className: 'grid grid-cols-3 gap-3 sm:gap-6 pt-4 pb-2' },
      
      // 2nd Place (Silver)
      React.createElement('div', {
        className: 'p-4 sm:p-6 rounded-3xl glass-card border border-slate-600/40 text-center flex flex-col items-center justify-end space-y-2 mt-6'
      },
        React.createElement('div', { className: 'relative' },
          React.createElement('img', { src: leaderboard[1].avatar, alt: leaderboard[1].name, className: 'w-14 h-14 rounded-2xl bg-slate-800 ring-2 ring-slate-400' }),
          React.createElement('span', { className: 'absolute -bottom-2 -right-2 text-xl' }, '🥈')
        ),
        React.createElement('h4', { className: 'text-xs sm:text-sm font-bold text-white truncate max-w-full' }, leaderboard[1].name),
        React.createElement('span', { className: 'text-[11px] text-slate-400 font-semibold' }, `Lvl ${leaderboard[1].level}`),
        React.createElement('div', { className: 'text-xs sm:text-sm font-black text-amber-400' }, `${leaderboard[1].currentXP} XP`)
      ),

      // 1st Place (Gold)
      React.createElement('div', {
        className: 'p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 text-center flex flex-col items-center justify-end space-y-2 shadow-2xl shadow-amber-500/10'
      },
        React.createElement('div', { className: 'relative' },
          React.createElement('img', { src: leaderboard[0].avatar, alt: leaderboard[0].name, className: 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800 ring-4 ring-amber-400 shadow-xl' }),
          React.createElement('span', { className: 'absolute -bottom-2 -right-2 text-2xl' }, '🥇')
        ),
        React.createElement('h4', { className: 'text-sm sm:text-base font-black text-white truncate max-w-full' }, leaderboard[0].name),
        React.createElement('span', { className: 'text-xs text-amber-300 font-bold' }, `Lvl ${leaderboard[0].level}`),
        React.createElement('div', { className: 'text-sm sm:text-base font-black text-amber-400' }, `${leaderboard[0].currentXP} XP`)
      ),

      // 3rd Place (Bronze)
      React.createElement('div', {
        className: 'p-4 sm:p-6 rounded-3xl glass-card border border-amber-700/40 text-center flex flex-col items-center justify-end space-y-2 mt-8'
      },
        React.createElement('div', { className: 'relative' },
          React.createElement('img', { src: leaderboard[2].avatar, alt: leaderboard[2].name, className: 'w-14 h-14 rounded-2xl bg-slate-800 ring-2 ring-amber-700' }),
          React.createElement('span', { className: 'absolute -bottom-2 -right-2 text-xl' }, '🥉')
        ),
        React.createElement('h4', { className: 'text-xs sm:text-sm font-bold text-white truncate max-w-full' }, leaderboard[2].name),
        React.createElement('span', { className: 'text-[11px] text-slate-400 font-semibold' }, `Lvl ${leaderboard[2].level}`),
        React.createElement('div', { className: 'text-xs sm:text-sm font-black text-amber-400' }, `${leaderboard[2].currentXP} XP`)
      )
    ),

    // Full Leaderboard Table
    React.createElement('div', { className: 'rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl' },
      React.createElement('div', { className: 'px-6 py-4 bg-slate-950/60 border-b border-slate-800/80 grid grid-cols-12 text-[11px] font-black uppercase text-slate-400 tracking-wider' },
        React.createElement('span', { className: 'col-span-2' }, 'Rank'),
        React.createElement('span', { className: 'col-span-6' }, 'Student'),
        React.createElement('span', { className: 'col-span-2 text-center' }, 'Level'),
        React.createElement('span', { className: 'col-span-2 text-right' }, 'XP Earned')
      ),

      loading
        ? React.createElement('div', { className: 'p-12 text-center text-slate-400 text-xs' }, 'Updating leaderboard rankings...')
        : React.createElement('div', { className: 'divide-y divide-slate-800/60' },
            leaderboard.map(student => {
              const isMe = student.isCurrentUser;
              return React.createElement('div', {
                key: student.userId,
                className: `px-6 py-3.5 grid grid-cols-12 items-center text-xs transition-colors ${
                  isMe ? 'bg-brand-500/15 font-bold border-l-4 border-brand-500' : 'hover:bg-slate-800/40'
                }`
              },
                React.createElement('div', { className: 'col-span-2 flex items-center gap-1.5' },
                  React.createElement('span', {
                    className: `font-black text-sm ${
                      student.rank === 1 ? 'text-amber-400' : student.rank === 2 ? 'text-slate-300' : student.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                    }`
                  }, student.rank <= 3 ? (student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉') : `#${student.rank}`)
                ),
                React.createElement('div', { className: 'col-span-6 flex items-center gap-3 truncate' },
                  React.createElement('img', { src: student.avatar, alt: student.name, className: 'w-8 h-8 rounded-xl bg-slate-800 shrink-0' }),
                  React.createElement('div', { className: 'truncate' },
                    React.createElement('span', { className: `text-slate-200 block truncate ${isMe ? 'text-brand-300' : ''}` },
                      student.name,
                      isMe && React.createElement('span', { className: 'ml-2 text-[10px] text-brand-400 font-extrabold uppercase' }, '(You)')
                    ),
                    student.streakCount > 0 && React.createElement('span', { className: 'text-[10px] text-amber-400 font-semibold' },
                      `🔥 ${student.streakCount} day streak`
                    )
                  )
                ),
                React.createElement('div', { className: 'col-span-2 text-center' },
                  React.createElement('span', { className: 'px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[11px]' },
                    `Lvl ${student.level}`
                  )
                ),
                React.createElement('div', { className: 'col-span-2 text-right' },
                  React.createElement('span', { className: 'font-black text-amber-400 text-sm' }, `${student.currentXP} XP`)
                )
              );
            })
          )
    )
  );
};