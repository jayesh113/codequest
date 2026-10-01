import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const LearningPathsView = ({ onCompleteModuleSuccess }) => {
  const [paths, setPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    setLoading(true);
    try {
      const res = await API.getPaths();
      setPaths(res.paths || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPath = async (slug) => {
    Sound.playClick();
    try {
      const res = await API.getPath(slug);
      setSelectedPath(res.path);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async (moduleId) => {
    try {
      const res = await API.completeModule(moduleId);
      Sound.playXP();
      if (onCompleteModuleSuccess) {
        onCompleteModuleSuccess(res.amount || 50, res.message);
      }
      // Refresh current path
      if (selectedPath) {
        handleSelectPath(selectedPath.slug);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading Learning Paths...');
  }

  // Path Detail View
  if (selectedPath) {
    const completedCount = selectedPath.modules.filter(m => m.isCompleted).length;
    const progress = Math.round((completedCount / (selectedPath.modules.length || 1)) * 100);

    return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto text-left' },
      React.createElement('button', {
        onClick: () => { Sound.playClick(); setSelectedPath(null); },
        className: 'flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300'
      }, React.createElement(Icon, { name: 'ChevronLeft', size: 16 }), 'Back to All Paths'),

      // Path Header Card
      React.createElement('div', { className: 'p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-4 shadow-xl' },
        React.createElement('div', { className: 'flex flex-wrap items-center justify-between gap-2' },
          React.createElement('span', { className: 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 uppercase' }, selectedPath.category),
          React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, `Estimated: ${selectedPath.estimatedHours} Hours`)
        ),
        React.createElement('h2', { className: 'text-2xl sm:text-3xl font-black text-white' }, selectedPath.title),
        React.createElement('p', { className: 'text-sm text-slate-300 max-w-3xl leading-relaxed' }, selectedPath.description),
        
        // Progress bar
        React.createElement('div', { className: 'pt-2 space-y-1.5' },
          React.createElement('div', { className: 'flex justify-between text-xs font-bold text-slate-300' },
            React.createElement('span', null, `Progress: ${completedCount} of ${selectedPath.modules.length} Modules Completed`),
            React.createElement('span', { className: 'text-brand-400' }, `${progress}%`)
          ),
          React.createElement('div', { className: 'w-full h-2 rounded-full bg-slate-800 overflow-hidden' },
            React.createElement('div', {
              className: 'h-full bg-gradient-to-r from-brand-500 to-cyber-accent rounded-full transition-all duration-500',
              style: { width: `${progress}%` }
            })
          )
        )
      ),

      // Modules Roadmap
      React.createElement('div', { className: 'space-y-3' },
        React.createElement('h3', { className: 'text-lg font-bold text-white' }, 'Syllabus & Roadmap'),
        selectedPath.modules.map((m, idx) => {
          const isUnlocked = idx <= completedCount; // Progressive unlock
          return React.createElement('div', {
            key: m._id || idx,
            className: `p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              m.isCompleted
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : isUnlocked
                ? 'glass-card border-slate-800 hover:border-slate-700'
                : 'opacity-50 bg-slate-900/40 border-slate-800/60'
            }`
          },
            React.createElement('div', { className: 'flex items-start gap-3.5' },
              React.createElement('div', {
                className: `w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  m.isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isUnlocked
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'bg-slate-800 text-slate-500'
                }`
              }, m.isCompleted ? '✓' : idx + 1),
              React.createElement('div', null,
                React.createElement('h4', { className: 'text-sm font-bold text-white' }, m.title),
                React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, m.description)
              )
            ),

            React.createElement('div', { className: 'flex items-center gap-3 shrink-0 self-end sm:self-center' },
              React.createElement('span', { className: 'text-xs font-bold text-amber-400' }, `+${m.xpReward || 50} XP`),
              m.isCompleted
                ? React.createElement('span', { className: 'text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10' }, 'Completed')
                : isUnlocked
                ? React.createElement('button', {
                    onClick: () => handleComplete(m._id),
                    className: 'px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all'
                  }, 'Complete & Claim XP')
                : React.createElement('span', { className: 'text-xs text-slate-500 flex items-center gap-1' },
                    React.createElement(Icon, { name: 'Lock', size: 14 }),
                    'Locked'
                  )
            )
          );
        })
      )
    );
  }

  // Paths Grid View
  return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white' }, 'Structured Learning Paths'),
      React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
        'Comprehensive step-by-step curricula with theory, hands-on tasks, quizzes, and XP rewards.'
      )
    ),

    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
      paths.map((p, idx) =>
        React.createElement('div', {
          key: p._id || idx,
          onClick: () => handleSelectPath(p.slug),
          className: 'p-6 rounded-3xl glass-card border border-slate-800 hover:border-brand-500/50 hover:-translate-y-1 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg'
        },
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', { className: 'flex items-center justify-between' },
              React.createElement('div', { className: 'w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center' },
                React.createElement(Icon, { name: p.icon || 'BookOpen', size: 24 })
              ),
              React.createElement('span', { className: 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300' }, p.difficulty)
            ),
            React.createElement('span', { className: 'text-[10px] font-bold uppercase tracking-wider text-brand-400' }, p.category),
            React.createElement('h3', { className: 'text-lg font-bold text-white' }, p.title),
            React.createElement('p', { className: 'text-xs text-slate-400 line-clamp-3 leading-relaxed' }, p.description)
          ),

          React.createElement('div', { className: 'pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
            React.createElement('span', { className: 'text-slate-400 font-semibold' }, `${p.moduleCount || 10} Modules`),
            React.createElement('span', { className: 'text-brand-400 font-bold flex items-center gap-1' },
              'Start Path',
              React.createElement(Icon, { name: 'ChevronRight', size: 16 })
            )
          )
        )
      )
    )
  );
};