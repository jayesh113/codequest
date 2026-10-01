import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const AdminDashboardView = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'resource', 'task', 'announcement', 'xp'
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [resForm, setResForm] = useState({ title: '', description: '', category: 'Python', topic: 'Programming', difficulty: 'Beginner', resourceType: 'article', url: '', xpReward: 25, duration: '15 min' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', instructions: '', difficulty: 'Easy', category: 'Python', xpReward: 50, deadline: 'Flexible', submissionType: 'code' });
  const [annForm, setAnnForm] = useState({ title: '', content: '', type: 'announcement', xpReward: 50 });
  const [xpForm, setXpForm] = useState({ amount: 100, reason: 'Exemplary code contribution and mentoring' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, stRes] = await Promise.all([
        API.getAdminStats(),
        API.getAdminStudents()
      ]);
      setStats(sRes.stats);
      setChartData(sRes.chartData);
      setStudents(stRes.students || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await API.createAdminResource(resForm);
      Sound.playSuccess();
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.createAdminTask(taskForm);
      Sound.playSuccess();
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await API.createAdminAnnouncement(annForm);
      Sound.playSuccess();
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdjustXP = async (e) => {
    e.preventDefault();
    try {
      await API.adjustStudentXP(selectedStudent._id, xpForm.amount, xpForm.reason);
      Sound.playXP();
      setActiveModal(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading Instructor Command Center...');
  }

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: 'Users', color: 'text-brand-400' },
    { label: 'Active Coders', value: stats?.activeStudents || 0, icon: 'Flame', color: 'text-amber-400' },
    { label: 'Resources Published', value: stats?.totalResources || 0, icon: 'BookOpen', color: 'text-cyan-400' },
    { label: 'Tasks Created', value: stats?.totalTasks || 0, icon: 'CheckCircle', color: 'text-emerald-400' },
    { label: 'Coding Challenges', value: stats?.totalChallenges || 0, icon: 'Code', color: 'text-purple-400' },
    { label: 'Quizzes Built', value: stats?.totalQuizzes || 0, icon: 'HelpCircle', color: 'text-blue-400' },
    { label: 'Tasks Completed', value: stats?.completedTasks || 0, icon: 'Target', color: 'text-rose-400' },
    { label: 'Total Community XP', value: stats?.totalXP || 0, icon: 'Zap', color: 'text-yellow-400' }
  ];

  return React.createElement('div', { className: 'space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    
    // Top Bar
    React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4' },
      React.createElement('div', null,
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'text-[10px] font-black uppercase tracking-widest text-rose-400 px-2 py-0.5 rounded bg-rose-500/10' }, 'INSTRUCTOR PRIVILEGES'),
          React.createElement('span', { className: 'text-xs text-slate-400' }, 'Full Management & Curriculum Control')
        ),
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white mt-1' }, 'Admin & Instructor Panel')
      ),

      // Quick Action Buttons
      React.createElement('div', { className: 'flex flex-wrap items-center gap-2.5' },
        React.createElement('button', {
          onClick: () => { Sound.playClick(); setActiveModal('resource'); },
          className: 'px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all'
        }, React.createElement(Icon, { name: 'Plus', size: 14 }), 'Add Resource'),
        
        React.createElement('button', {
          onClick: () => { Sound.playClick(); setActiveModal('task'); },
          className: 'px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all'
        }, React.createElement(Icon, { name: 'Plus', size: 14 }), 'Create Task'),

        React.createElement('button', {
          onClick: () => { Sound.playClick(); setActiveModal('announcement'); },
          className: 'px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all'
        }, React.createElement(Icon, { name: 'Bell', size: 14 }), 'Post Announcement')
      )
    ),

    // STATS METRICS GRID (8 Cards)
    React.createElement('div', { className: 'grid grid-cols-2 sm:grid-cols-4 gap-4' },
      statCards.map((c, i) =>
        React.createElement('div', { key: i, className: 'p-5 rounded-3xl glass-card border border-slate-800 space-y-1.5' },
          React.createElement('div', { className: 'flex items-center justify-between text-slate-400' },
            React.createElement('span', { className: 'text-xs font-semibold' }, c.label),
            React.createElement(Icon, { name: c.icon, size: 16, className: c.color })
          ),
          React.createElement('div', { className: `text-2xl font-black ${c.color}` }, c.value)
        )
      )
    ),

    // ANALYTICS & ACTIVITY CHARTS
    chartData && React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
      
      // Weekly XP Velocity Chart
      React.createElement('div', { className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-4 shadow-xl' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('h3', { className: 'text-sm font-bold text-white flex items-center gap-2' },
            React.createElement(Icon, { name: 'BarChart3', size: 16, className: 'text-brand-400' }),
            'Weekly Student Activity Velocity'
          ),
          React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, 'Last 7 Days')
        ),
        React.createElement('div', { className: 'flex items-end justify-between h-40 gap-3 pt-6' },
          chartData.recentActivity.map((d, i) => {
            const heightPercent = Math.min(100, Math.round((d.xp / 6500) * 100));
            return React.createElement('div', { key: i, className: 'flex-1 flex flex-col items-center gap-2 h-full justify-end' },
              React.createElement('div', {
                className: 'w-full rounded-xl bg-gradient-to-t from-brand-600 to-cyber-accent hover:opacity-90 transition-all',
                style: { height: `${heightPercent}%` },
                title: `${d.day}: ${d.xp} XP (${d.submissions} submissions)`
              }),
              React.createElement('span', { className: 'text-[10px] font-bold text-slate-400' }, d.day)
            );
          })
        )
      ),

      // Level Distribution Chart
      React.createElement('div', { className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-4 shadow-xl' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('h3', { className: 'text-sm font-bold text-white flex items-center gap-2' },
            React.createElement(Icon, { name: 'Zap', size: 16, className: 'text-amber-400' }),
            'Student Level Distribution'
          ),
          React.createElement('span', { className: 'text-xs text-slate-400 font-semibold' }, 'Active Cohort')
        ),
        React.createElement('div', { className: 'space-y-3 pt-4' },
          chartData.xpDistribution.map((lvl, i) => {
            const pct = Math.round((lvl.count / (students.length || 1)) * 100);
            return React.createElement('div', { key: i, className: 'space-y-1' },
              React.createElement('div', { className: 'flex justify-between text-xs font-bold' },
                React.createElement('span', { className: 'text-slate-300' }, lvl.level),
                React.createElement('span', { className: 'text-brand-400' }, `${lvl.count} Students (${pct}%)`)
              ),
              React.createElement('div', { className: 'w-full h-2 rounded-full bg-slate-800 overflow-hidden' },
                React.createElement('div', {
                  className: 'h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full',
                  style: { width: `${pct}%` }
                })
              )
            );
          })
        )
      )
    ),

    // MANAGE STUDENTS TABLE
    React.createElement('div', { className: 'rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl' },
      React.createElement('div', { className: 'p-6 border-b border-slate-800 flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h3', { className: 'text-base font-bold text-white' }, 'Student Cohort Management'),
          React.createElement('p', { className: 'text-xs text-slate-400' }, 'Inspect student progress and grant or deduct XP rewards.')
        ),
        React.createElement('span', { className: 'text-xs font-bold text-slate-400' }, `${students.length} Registered Students`)
      ),

      React.createElement('div', { className: 'overflow-x-auto' },
        React.createElement('table', { className: 'w-full text-left text-xs' },
          React.createElement('thead', { className: 'bg-slate-950/60 text-slate-400 uppercase font-black tracking-wider text-[10px]' },
            React.createElement('tr', null,
              React.createElement('th', { className: 'px-6 py-3' }, 'Student'),
              React.createElement('th', { className: 'px-6 py-3 text-center' }, 'Level'),
              React.createElement('th', { className: 'px-6 py-3 text-center' }, 'Streak'),
              React.createElement('th', { className: 'px-6 py-3 text-center' }, 'Solved'),
              React.createElement('th', { className: 'px-6 py-3 text-right' }, 'Total XP'),
              React.createElement('th', { className: 'px-6 py-3 text-right' }, 'Action')
            )
          ),
          React.createElement('tbody', { className: 'divide-y divide-slate-800/60' },
            students.map(s =>
              React.createElement('tr', { key: s._id, className: 'hover:bg-slate-800/40 transition-colors' },
                React.createElement('td', { className: 'px-6 py-3.5 flex items-center gap-3' },
                  React.createElement('img', { src: s.avatar, alt: s.name, className: 'w-8 h-8 rounded-xl bg-slate-800' }),
                  React.createElement('div', null,
                    React.createElement('div', { className: 'font-bold text-white' }, s.name),
                    React.createElement('div', { className: 'text-[11px] text-slate-400' }, s.email)
                  )
                ),
                React.createElement('td', { className: 'px-6 py-3.5 text-center font-bold text-slate-200' }, `Lvl ${s.level}`),
                React.createElement('td', { className: 'px-6 py-3.5 text-center text-amber-400 font-bold' }, `🔥 ${s.streakCount}d`),
                React.createElement('td', { className: 'px-6 py-3.5 text-center font-bold text-slate-300' }, `${s.solvedCount} Tasks`),
                React.createElement('td', { className: 'px-6 py-3.5 text-right font-black text-amber-400' }, `${s.currentXP} XP`),
                React.createElement('td', { className: 'px-6 py-3.5 text-right' },
                  React.createElement('button', {
                    onClick: () => { Sound.playClick(); setSelectedStudent(s); setActiveModal('xp'); },
                    className: 'px-3 py-1 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold'
                  }, 'Adjust XP')
                )
              )
            )
          )
        )
      )
    ),

    // MODAL: ADJUST XP
    activeModal === 'xp' && selectedStudent && React.createElement('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
    },
      React.createElement('div', { className: 'max-w-md w-full rounded-3xl p-6 glass-card border border-slate-700 space-y-4 text-left shadow-2xl' },
        React.createElement('div', { className: 'flex justify-between items-center pb-2 border-b border-slate-800' },
          React.createElement('h3', { className: 'font-bold text-base text-white' }, `Adjust XP for ${selectedStudent.name}`),
          React.createElement('button', { onClick: () => setActiveModal(null), className: 'text-slate-400 hover:text-white' },
            React.createElement(Icon, { name: 'X', size: 18 })
          )
        ),
        React.createElement('form', { onSubmit: handleAdjustXP, className: 'space-y-4' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'XP Amount (Positive to Grant, Negative to Deduct):'),
            React.createElement('input', {
              type: 'number',
              required: true,
              value: xpForm.amount,
              onChange: e => setXpForm({ ...xpForm, amount: parseInt(e.target.value, 10) }),
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Reason / Feedback:'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              value: xpForm.reason,
              onChange: e => setXpForm({ ...xpForm, reason: e.target.value }),
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', { className: 'flex justify-end gap-3 pt-2' },
            React.createElement('button', { type: 'button', onClick: () => setActiveModal(null), className: 'px-4 py-2 text-xs font-semibold text-slate-400' }, 'Cancel'),
            React.createElement('button', { type: 'submit', className: 'px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white' }, 'Update XP')
          )
        )
      )
    ),

    // MODAL: ADD RESOURCE
    activeModal === 'resource' && React.createElement('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
    },
      React.createElement('div', { className: 'max-w-lg w-full rounded-3xl p-6 glass-card border border-slate-700 space-y-4 text-left shadow-2xl max-h-[90vh] overflow-y-auto' },
        React.createElement('div', { className: 'flex justify-between items-center pb-2 border-b border-slate-800' },
          React.createElement('h3', { className: 'font-bold text-base text-white' }, 'Publish New Resource'),
          React.createElement('button', { onClick: () => setActiveModal(null), className: 'text-slate-400 hover:text-white' },
            React.createElement(Icon, { name: 'X', size: 18 })
          )
        ),
        React.createElement('form', { onSubmit: handleCreateResource, className: 'space-y-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Resource Title'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: resForm.title,
              onChange: e => setResForm({ ...resForm, title: e.target.value }),
              placeholder: 'Mastering Python Async/Await',
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Description'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              value: resForm.description,
              onChange: e => setResForm({ ...resForm, description: e.target.value }),
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Category'),
              React.createElement('select', {
                value: resForm.category,
                onChange: e => setResForm({ ...resForm, category: e.target.value }),
                className: 'w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
              },
                ['Python', 'DSA', 'Web Dev', 'React', 'Backend'].map(c => React.createElement('option', { key: c, value: c }, c))
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Type'),
              React.createElement('select', {
                value: resForm.resourceType,
                onChange: e => setResForm({ ...resForm, resourceType: e.target.value }),
                className: 'w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
              },
                ['pdf', 'video', 'article', 'notes', 'code'].map(t => React.createElement('option', { key: t, value: t }, t.toUpperCase()))
              )
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Resource URL'),
            React.createElement('input', {
              type: 'text',
              value: resForm.url,
              onChange: e => setResForm({ ...resForm, url: e.target.value }),
              placeholder: 'https://docs.python.org/...',
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', { className: 'flex justify-end gap-3 pt-3' },
            React.createElement('button', { type: 'button', onClick: () => setActiveModal(null), className: 'px-4 py-2 text-xs font-semibold text-slate-400' }, 'Cancel'),
            React.createElement('button', { type: 'submit', className: 'px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-xs text-white' }, 'Publish Resource')
          )
        )
      )
    ),

    // MODAL: CREATE TASK
    activeModal === 'task' && React.createElement('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
    },
      React.createElement('div', { className: 'max-w-lg w-full rounded-3xl p-6 glass-card border border-slate-700 space-y-4 text-left shadow-2xl max-h-[90vh] overflow-y-auto' },
        React.createElement('div', { className: 'flex justify-between items-center pb-2 border-b border-slate-800' },
          React.createElement('h3', { className: 'font-bold text-base text-white' }, 'Create Student Task'),
          React.createElement('button', { onClick: () => setActiveModal(null), className: 'text-slate-400 hover:text-white' },
            React.createElement(Icon, { name: 'X', size: 18 })
          )
        ),
        React.createElement('form', { onSubmit: handleCreateTask, className: 'space-y-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Task Title'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: taskForm.title,
              onChange: e => setTaskForm({ ...taskForm, title: e.target.value }),
              placeholder: 'Implement a LRU Cache',
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Instructions'),
            React.createElement('textarea', {
              rows: 4,
              required: true,
              value: taskForm.instructions,
              onChange: e => setTaskForm({ ...taskForm, instructions: e.target.value }),
              placeholder: 'Write the implementation details and specifications...',
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', { className: 'grid grid-cols-2 gap-3' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Difficulty'),
              React.createElement('select', {
                value: taskForm.difficulty,
                onChange: e => setTaskForm({ ...taskForm, difficulty: e.target.value }),
                className: 'w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
              },
                ['Easy', 'Medium', 'Hard'].map(d => React.createElement('option', { key: d, value: d }, d))
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'XP Reward'),
              React.createElement('input', {
                type: 'number',
                value: taskForm.xpReward,
                onChange: e => setTaskForm({ ...taskForm, xpReward: parseInt(e.target.value, 10) }),
                className: 'w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
              })
            )
          ),
          React.createElement('div', { className: 'flex justify-end gap-3 pt-3' },
            React.createElement('button', { type: 'button', onClick: () => setActiveModal(null), className: 'px-4 py-2 text-xs font-semibold text-slate-400' }, 'Cancel'),
            React.createElement('button', { type: 'submit', className: 'px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white' }, 'Create Task')
          )
        )
      )
    ),

    // MODAL: CREATE ANNOUNCEMENT
    activeModal === 'announcement' && React.createElement('div', {
      className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
    },
      React.createElement('div', { className: 'max-w-md w-full rounded-3xl p-6 glass-card border border-slate-700 space-y-4 text-left shadow-2xl' },
        React.createElement('div', { className: 'flex justify-between items-center pb-2 border-b border-slate-800' },
          React.createElement('h3', { className: 'font-bold text-base text-white' }, 'Broadcast Announcement'),
          React.createElement('button', { onClick: () => setActiveModal(null), className: 'text-slate-400 hover:text-white' },
            React.createElement(Icon, { name: 'X', size: 18 })
          )
        ),
        React.createElement('form', { onSubmit: handleCreateAnnouncement, className: 'space-y-3' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Announcement Title'),
            React.createElement('input', {
              type: 'text',
              required: true,
              value: annForm.title,
              onChange: e => setAnnForm({ ...annForm, title: e.target.value }),
              placeholder: 'Weekend Hackathon Starting Soon!',
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Message Content'),
            React.createElement('textarea', {
              rows: 3,
              required: true,
              value: annForm.content,
              onChange: e => setAnnForm({ ...annForm, content: e.target.value }),
              placeholder: 'Details for all students...',
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'XP Reward Event (Optional)'),
            React.createElement('input', {
              type: 'number',
              value: annForm.xpReward,
              onChange: e => setAnnForm({ ...annForm, xpReward: parseInt(e.target.value, 10) }),
              className: 'w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none'
            })
          ),
          React.createElement('div', { className: 'flex justify-end gap-3 pt-3' },
            React.createElement('button', { type: 'button', onClick: () => setActiveModal(null), className: 'px-4 py-2 text-xs font-semibold text-slate-400' }, 'Cancel'),
            React.createElement('button', { type: 'submit', className: 'px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white' }, 'Broadcast Now')
          )
        )
      )
    )
  );
};