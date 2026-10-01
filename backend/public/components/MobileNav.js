import React from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";

export const MobileNav = ({ activeTab, onNavigate, user }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: 'Layout' },
    { id: 'paths', label: 'Learn', icon: 'BookOpen' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckCircle' },
    { id: 'challenges', label: 'Arena', icon: 'Code' },
    { id: user ? 'profile' : 'auth', label: user ? 'Profile' : 'Sign In', icon: 'Users' }
  ];

  return React.createElement('div', {
    className: 'lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D17]/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl'
  },
    tabs.map(tab => {
      const isActive = activeTab === tab.id;
      return React.createElement('button', {
        key: tab.id,
        onClick: () => { Sound.playClick(); onNavigate(tab.id); },
        className: `flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
          isActive ? 'text-brand-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
        }`
      },
        React.createElement(Icon, { name: tab.icon, size: 20 }),
        React.createElement('span', { className: 'text-[10px] mt-0.5' }, tab.label)
      );
    })
  );
};