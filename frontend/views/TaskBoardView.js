import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const TaskBoardView = ({ onOpenTaskModal }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await API.getTasks();
      setTasks(res.tasks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const statusTabs = ['ALL', 'NOT STARTED', 'IN PROGRESS', 'COMPLETED'];

  return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    
    // Header
    React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
      React.createElement('div', null,
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white' }, 'Student Task Board'),
        React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
          'Complete guided coding exercises, submit solutions, earn XP, and level up.'
        )
      ),

      // Status filters
      React.createElement('div', { className: 'flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800' },
        statusTabs.map(tab =>
          React.createElement('button', {
            key: tab,
            onClick: () => { Sound.playClick(); setFilter(tab); },
            className: `px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-white'
            }`
          }, tab)
        )
      )
    ),

    // Tasks Grid
    loading
      ? React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading tasks...')
      : filteredTasks.length === 0
      ? React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'No tasks in this category.')
      : React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          filteredTasks.map((t, idx) => {
            const isCompleted = t.status === 'COMPLETED';
            return React.createElement('div', {
              key: t._id || idx,
              className: `p-6 rounded-3xl glass-card border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg ${
                isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
              }`
            },
              React.createElement('div', { className: 'space-y-3' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('span', { className: 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-300' }, t.category),
                  React.createElement('span', {
                    className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' :
                      t.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`
                  }, `${t.difficulty === 'Easy' ? '⭐' : t.difficulty === 'Medium' ? '⭐⭐' : '⭐⭐⭐'} ${t.difficulty}`)
                ),
                React.createElement('h3', { className: 'text-base font-bold text-white' }, t.title),
                React.createElement('p', { className: 'text-xs text-slate-400 line-clamp-3 leading-relaxed' }, t.description)
              ),

              React.createElement('div', { className: 'pt-4 border-t border-slate-800 flex items-center justify-between' },
                React.createElement('div', { className: 'flex flex-col' },
                  React.createElement('span', { className: 'text-xs font-bold text-amber-400 flex items-center gap-1' },
                    React.createElement(Icon, { name: 'Zap', size: 14 }),
                    `+${t.xpReward} XP`
                  ),
                  React.createElement('span', { className: 'text-[10px] text-slate-500' }, `Due: ${t.deadline || 'Flexible'}`)
                ),

                isCompleted
                  ? React.createElement('span', { className: 'text-xs font-bold text-emerald-400 flex items-center gap-1' },
                      React.createElement(Icon, { name: 'CheckCircle', size: 16 }),
                      'Completed'
                    )
                  : React.createElement('button', {
                      onClick: () => { Sound.playClick(); onOpenTaskModal(t); },
                      className: 'px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all'
                    }, t.status === 'IN PROGRESS' ? 'Continue Task' : 'Start Task →')
              )
            );
          })
        )
  );
};