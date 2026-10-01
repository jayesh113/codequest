import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { API } from "../api.js";

export const AchievementsView = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    try {
      const res = await API.getAchievements();
      setAchievements(res.achievements || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    
    // Header
    React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5' },
          React.createElement(Icon, { name: 'Award', size: 28, className: 'text-brand-400' }),
          'Badges & Achievements'
        ),
        React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
          'Unlock rare coder badges as you solve problems, maintain streaks, and complete learning paths.'
        )
      ),

      React.createElement('div', { className: 'px-5 py-2.5 rounded-2xl glass-card border border-brand-500/30 flex items-center gap-3 shrink-0' },
        React.createElement('div', { className: 'text-right' },
          React.createElement('div', { className: 'text-[10px] uppercase font-bold text-slate-400' }, 'Milestones Unlocked'),
          React.createElement('div', { className: 'text-lg font-black text-brand-400' }, `${unlockedCount} / ${achievements.length}`)
        ),
        React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center' },
          React.createElement(Icon, { name: 'Sparkles', size: 20 })
        )
      )
    ),

    // Badges Grid
    loading
      ? React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading achievement catalog...')
      : React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' },
          achievements.map((a, idx) => {
            const isUnlocked = a.isUnlocked;
            return React.createElement('div', {
              key: a._id || idx,
              className: `p-6 rounded-3xl glass-card border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg ${
                isUnlocked
                  ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900/90 shadow-amber-500/5'
                  : 'border-slate-800 opacity-60'
              }`
            },
              React.createElement('div', { className: 'space-y-3' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', {
                    className: `w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`
                  },
                    React.createElement(Icon, { name: a.icon || 'Award', size: 24 })
                  ),
                  React.createElement('span', {
                    className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`
                  }, isUnlocked ? 'UNLOCKED ✓' : 'LOCKED')
                ),

                React.createElement('div', null,
                  React.createElement('span', { className: 'text-[10px] font-bold uppercase tracking-wider text-slate-500' }, a.category),
                  React.createElement('h3', { className: 'text-base font-black text-white' }, a.title)
                ),
                React.createElement('p', { className: 'text-xs text-slate-400 leading-relaxed' }, a.description)
              ),

              // Progress Bar
              React.createElement('div', { className: 'pt-2 space-y-1.5 border-t border-slate-800/80 text-xs' },
                React.createElement('div', { className: 'flex justify-between items-center text-[11px] font-semibold text-slate-400' },
                  React.createElement('span', null, `Progress: ${a.progress} / ${a.target}`),
                  React.createElement('span', { className: isUnlocked ? 'text-amber-400 font-bold' : 'text-slate-500' }, `+${a.xpReward} XP`)
                ),
                React.createElement('div', { className: 'w-full h-1.5 rounded-full bg-slate-800 overflow-hidden' },
                  React.createElement('div', {
                    className: `h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-amber-400' : 'bg-brand-500'}`,
                    style: { width: `${a.progressPercent}%` }
                  })
                )
              )
            );
          })
        )
  );
};