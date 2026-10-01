import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const ProfileView = ({ user, profile, onUpdateProfile }) => {
  const [bio, setBio] = useState(profile?.bio || '');
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [streakHistory, setStreakHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const avatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Devon',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Maya',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus'
  ];

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const [streakRes, txRes] = await Promise.all([
        API.getStreak(),
        API.getXPTransactions()
      ]);
      setStreakHistory(streakRes.streakHistory || []);
      setTransactions(txRes.transactions || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    Sound.playClick();
    setSaving(true);
    setSaved(false);
    try {
      const res = await API.updateProfile({
        bio,
        githubUrl,
        linkedinUrl,
        avatar: selectedAvatar
      });
      setSaved(true);
      if (onUpdateProfile) onUpdateProfile(res.user, res.profile);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Generate 28-day activity heatmap cells
  const heatmapDays = [];
  const today = new Date();
  const activeDateSet = new Set(streakHistory.map(s => s.date));

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    heatmapDays.push({
      date: dateStr,
      isActive: activeDateSet.has(dateStr) || i === 0
    });
  }

  return React.createElement('div', { className: 'space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto text-left' },
    
    // Header Banner
    React.createElement('div', {
      className: 'relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-900/40 to-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6'
    },
      React.createElement('div', { className: 'relative shrink-0' },
        React.createElement('img', {
          src: selectedAvatar || user?.avatar,
          alt: user?.name,
          className: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 ring-4 ring-brand-500/50 shadow-2xl p-1'
        }),
        React.createElement('span', {
          className: 'absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-brand-500 text-[10px] font-black uppercase text-white shadow-lg'
        }, `LVL ${profile?.level || 1}`)
      ),

      React.createElement('div', { className: 'space-y-3 flex-1 text-center sm:text-left' },
        React.createElement('div', null,
          React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white' }, user?.name),
          React.createElement('p', { className: 'text-xs text-slate-400 font-medium' }, user?.email)
        ),
        React.createElement('p', { className: 'text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed' }, bio),
        React.createElement('div', { className: 'flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1' },
          React.createElement('div', { className: 'px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs' },
            React.createElement('span', { className: 'text-amber-400 font-bold' }, `🔥 ${profile?.streakCount || 0} Day Streak`)
          ),
          React.createElement('div', { className: 'px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs' },
            React.createElement('span', { className: 'text-brand-400 font-bold' }, `⚡ ${profile?.currentXP || 0} Total XP`)
          )
        )
      )
    ),

    // 28-DAY CODING HEATMAP CALENDAR
    React.createElement('div', { className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-4 shadow-xl' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('h3', { className: 'text-sm font-black text-white flex items-center gap-2' },
          React.createElement(Icon, { name: 'Flame', size: 16, className: 'text-amber-400' }),
          '28-Day Coding Activity Heatmap'
        ),
        React.createElement('span', { className: 'text-xs text-slate-400' }, 'Daily Coding Habits')
      ),
      React.createElement('div', { className: 'grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2' },
        heatmapDays.map((hd, i) =>
          React.createElement('div', {
            key: i,
            className: `h-10 rounded-xl flex items-center justify-center text-[10px] font-mono transition-all ${
              hd.isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900/50 text-slate-600 border border-slate-800/80'
            }`,
            title: `${hd.date}: ${hd.isActive ? 'Active' : 'No activity'}`
          }, hd.isActive ? '✓' : '·')
        )
      )
    ),

    // EDIT PROFILE & AVATAR PICKER
    React.createElement('form', { onSubmit: handleSave, className: 'p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-5 shadow-xl' },
      React.createElement('h3', { className: 'text-base font-bold text-white' }, 'Update Profile Settings'),
      
      // Avatar Picker
      React.createElement('div', null,
        React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-2' }, 'Choose Custom Avatar:'),
        React.createElement('div', { className: 'flex flex-wrap items-center gap-3' },
          avatars.map((av, i) =>
            React.createElement('img', {
              key: i,
              src: av,
              alt: 'av',
              onClick: () => { Sound.playClick(); setSelectedAvatar(av); },
              className: `w-12 h-12 rounded-2xl cursor-pointer p-0.5 transition-all ${
                selectedAvatar === av ? 'ring-4 ring-brand-500 bg-brand-500/20 scale-105' : 'opacity-60 hover:opacity-100 bg-slate-900'
              }`
            })
          )
        )
      ),

      React.createElement('div', null,
        React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Bio / About Me:'),
        React.createElement('textarea', {
          rows: 3,
          value: bio,
          onChange: e => setBio(e.target.value),
          className: 'w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-brand-500 focus:outline-none'
        })
      ),

      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-4' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'GitHub URL:'),
          React.createElement('input', {
            type: 'text',
            value: githubUrl,
            onChange: e => setGithubUrl(e.target.value),
            placeholder: 'https://github.com/username',
            className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-brand-500 focus:outline-none'
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'LinkedIn URL:'),
          React.createElement('input', {
            type: 'text',
            value: linkedinUrl,
            onChange: e => setLinkedinUrl(e.target.value),
            placeholder: 'https://linkedin.com/in/username',
            className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-brand-500 focus:outline-none'
          })
        )
      ),

      React.createElement('div', { className: 'flex items-center justify-between pt-2' },
        saved && React.createElement('span', { className: 'text-xs text-emerald-400 font-bold' }, '✓ Profile updated successfully!'),
        React.createElement('button', {
          type: 'submit',
          disabled: saving,
          className: 'ml-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all'
        }, saving ? 'Saving...' : 'Save Profile Changes')
      )
    ),

    // XP TRANSACTION HISTORY LOG
    React.createElement('div', { className: 'p-6 rounded-3xl glass-card border border-slate-800 space-y-4 shadow-xl' },
      React.createElement('h3', { className: 'text-base font-bold text-white flex items-center gap-2' },
        React.createElement(Icon, { name: 'Zap', size: 16, className: 'text-amber-400' }),
        'XP Transaction History'
      ),
      transactions.length === 0
        ? React.createElement('p', { className: 'text-xs text-slate-400 text-center py-6' }, 'No XP transactions recorded yet.')
        : React.createElement('div', { className: 'divide-y divide-slate-800/60 max-h-60 overflow-y-auto' },
            transactions.map((tx, idx) =>
              React.createElement('div', { key: tx._id || idx, className: 'py-2.5 flex items-center justify-between text-xs' },
                React.createElement('div', null,
                  React.createElement('div', { className: 'font-semibold text-slate-200' }, tx.description),
                  React.createElement('div', { className: 'text-[10px] text-slate-500 capitalize' }, `${tx.source} • ${new Date(tx.createdAt).toLocaleDateString()}`)
                ),
                React.createElement('span', { className: 'font-black text-amber-400 shrink-0' }, `+${tx.amount} XP`)
              )
            )
          )
    )
  );
};