import React from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";

export const Sidebar = ({ activeTab, onNavigate, user, profile }) => {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'Layout', badge: null },
    { id: 'paths', label: 'Learning Paths', icon: 'BookOpen', badge: '5 Paths' },
    { id: 'resources', label: 'Resource Library', icon: 'FileText', badge: null },
    { id: 'tasks', label: 'Daily Tasks', icon: 'CheckCircle', badge: null },
    { id: 'challenges', label: 'Coding Challenges', icon: 'Code', badge: 'Active' },
    { id: 'quizzes', label: 'Quizzes', icon: 'HelpCircle', badge: null },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy', badge: null },
    { id: 'achievements', label: 'Achievements', icon: 'Award', badge: '15 Badges' },
    { id: 'profile', label: 'My Profile', icon: 'Users', badge: null }
  ];

  const adminNavItems = [
    { id: 'admin', label: 'Admin Command', icon: 'Shield', badge: 'Admin' },
    { id: 'dashboard', label: 'Student View', icon: 'Layout', badge: null },
    { id: 'paths', label: 'Manage Paths', icon: 'BookOpen', badge: null },
    { id: 'resources', label: 'Manage Resources', icon: 'FileText', badge: null },
    { id: 'tasks', label: 'Manage Tasks', icon: 'CheckCircle', badge: null },
    { id: 'challenges', label: 'Challenges', icon: 'Code', badge: null },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy', badge: null }
  ];

  const items = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return React.createElement('aside', {
    className: 'hidden lg:flex flex-col w-64 shrink-0 min-h-[calc(100vh-65px)] border-r border-slate-800/80 p-4 justify-between bg-[#0A0D17]/80 backdrop-blur-md'
  },
    React.createElement('div', { className: 'space-y-6' },
      
      // Streak Widget in sidebar
      user && React.createElement('div', {
        className: 'rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex items-center justify-between'
      },
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse' },
            React.createElement(Icon, { name: 'Flame', size: 22 })
          ),
          React.createElement('div', null,
            React.createElement('span', { className: 'text-xs uppercase font-extrabold tracking-wider text-amber-400' }, 'Streak Active'),
            React.createElement('div', { className: 'text-lg font-black text-white' }, `${profile?.streakCount || 0} Days`)
          )
        ),
        React.createElement('div', { className: 'text-right' },
          React.createElement('span', { className: 'text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-500/20' }, '+100 XP next')
        )
      ),

      // Nav Links
      React.createElement('nav', { className: 'space-y-1' },
        items.map(item => {
          const isActive = activeTab === item.id;
          return React.createElement('button', {
            key: item.id,
            onClick: () => { Sound.playClick(); onNavigate(item.id); },
            className: `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/10 text-brand-300 border border-brand-500/30 shadow-lg shadow-brand-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          },
            React.createElement('div', { className: 'flex items-center gap-3' },
              React.createElement(Icon, {
                name: item.icon,
                size: 18,
                className: isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
              }),
              React.createElement('span', null, item.label)
            ),
            item.badge && React.createElement('span', {
              className: `text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-brand-500/30 text-brand-200' : 'bg-slate-800 text-slate-400'
              }`
            }, item.badge)
          );
        })
      )
    ),

    // Bottom Level Card
    user && React.createElement('div', {
      className: 'rounded-2xl p-4 glass-card border border-slate-800 text-left'
    },
      React.createElement('div', { className: 'flex items-center justify-between text-xs font-bold mb-2' },
        React.createElement('span', { className: 'text-brand-400' }, `LEVEL ${profile?.level || 1}`),
        React.createElement('span', { className: 'text-slate-400' }, `${profile?.currentXP || 0} XP`)
      ),
      React.createElement('div', { className: 'w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-2' },
        React.createElement('div', {
          className: 'h-full bg-gradient-to-r from-brand-500 via-indigo-400 to-cyber-accent rounded-full transition-all duration-500',
          style: { width: `${profile?.levelInfo?.progressPercent || 35}%` }
        })
      ),
      React.createElement('p', { className: 'text-[10px] text-slate-400 font-medium' },
        `Next level in ${profile?.levelInfo?.xpNeededForNext || 280} XP`
      )
    )
  );
};