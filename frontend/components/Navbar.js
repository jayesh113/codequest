import React, { useState } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";

export const Navbar = ({ user, profile, notifications = [], unreadCount = 0, onLogout, onNavigate, activeTab, isDark, onToggleTheme, soundEnabled, onToggleSound }) => {
  const [showNotifs, setShowNotifs] = useState(false);

  return React.createElement('header', { className: 'sticky top-0 z-30 w-full glass-nav px-4 lg:px-8 py-3 transition-colors duration-200' },
    React.createElement('div', { className: 'max-w-7xl mx-auto flex items-center justify-between gap-4' },
      
      // Left: Logo & Search
      React.createElement('div', { className: 'flex items-center gap-6' },
        React.createElement('div', {
          className: 'flex items-center gap-3 cursor-pointer group',
          onClick: () => { Sound.playClick(); onNavigate(user ? 'dashboard' : 'landing'); }
        },
          React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyber-accent flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform' },
            React.createElement(Icon, { name: 'Terminal', size: 22, className: 'text-white' })
          ),
          React.createElement('div', { className: 'flex flex-col' },
            React.createElement('span', { className: 'text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent' }, 'CodeQuest'),
            React.createElement('span', { className: 'text-[10px] uppercase font-bold tracking-widest text-brand-400 -mt-1' }, 'Student Academy')
          )
        )
      ),

      // Right: Actions & User
      React.createElement('div', { className: 'flex items-center gap-3' },
        
        // Sound toggle
        React.createElement('button', {
          onClick: onToggleSound,
          className: 'p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 hover:text-white transition-all',
          title: soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'
        },
          React.createElement(Icon, { name: soundEnabled ? 'Volume2' : 'VolumeX', size: 18 })
        ),

        // Theme toggle (Dark / Light)
        React.createElement('button', {
          onClick: onToggleTheme,
          className: 'p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 hover:text-white transition-all',
          title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
        },
          React.createElement(Icon, { name: isDark ? 'Sun' : 'Moon', size: 18 })
        ),

        // Notifications (when logged in)
        user && React.createElement('div', { className: 'relative' },
          React.createElement('button', {
            onClick: () => setShowNotifs(!showNotifs),
            className: 'relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 hover:text-white transition-all'
          },
            React.createElement(Icon, { name: 'Bell', size: 18 }),
            unreadCount > 0 && React.createElement('span', {
              className: 'absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse'
            }, unreadCount)
          ),

          // Notifications Dropdown
          showNotifs && React.createElement('div', {
            className: 'absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-card shadow-2xl p-4 z-50 border border-slate-700'
          },
            React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-slate-800' },
              React.createElement('h4', { className: 'font-bold text-sm text-slate-100 flex items-center gap-2' },
                React.createElement(Icon, { name: 'Bell', size: 16, className: 'text-brand-400' }),
                'Notifications'
              ),
              React.createElement('span', { className: 'text-xs text-brand-400 font-semibold' }, `${unreadCount} unread`)
            ),
            React.createElement('div', { className: 'max-h-80 overflow-y-auto divide-y divide-slate-800/60 my-2' },
              notifications.length === 0
                ? React.createElement('p', { className: 'text-xs text-slate-400 py-6 text-center' }, 'No notifications yet.')
                : notifications.map((n, idx) =>
                    React.createElement('div', { key: n._id || idx, className: 'py-2.5 px-2 hover:bg-slate-800/40 rounded-lg transition-colors' },
                      React.createElement('div', { className: 'flex items-center justify-between' },
                        React.createElement('span', { className: 'text-xs font-semibold text-slate-200' }, n.title),
                        React.createElement('span', { className: 'text-[10px] text-slate-500' }, 'Just now')
                      ),
                      React.createElement('p', { className: 'text-xs text-slate-400 mt-0.5' }, n.message)
                    )
                  )
            )
          )
        ),

        // User Avatar & Info or Auth CTA
        user ? React.createElement('div', { className: 'flex items-center gap-3 pl-2 border-l border-slate-800' },
          React.createElement('div', {
            className: 'flex items-center gap-2.5 cursor-pointer',
            onClick: () => { Sound.playClick(); onNavigate('profile'); }
          },
            React.createElement('img', {
              src: user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=User',
              alt: user.name,
              className: 'w-9 h-9 rounded-xl ring-2 ring-brand-500/40 bg-slate-800 p-0.5'
            }),
            React.createElement('div', { className: 'hidden md:flex flex-col text-left' },
              React.createElement('div', { className: 'flex items-center gap-1.5' },
                React.createElement('span', { className: 'text-xs font-bold text-slate-200' }, user.name),
                user.role === 'admin' && React.createElement('span', { className: 'text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded' }, 'Admin')
              ),
              React.createElement('div', { className: 'flex items-center gap-2 text-[10px] font-medium text-slate-400' },
                React.createElement('span', { className: 'text-brand-400 font-bold' }, `Lvl ${profile?.level || 1}`),
                React.createElement('span', null, '•'),
                React.createElement('span', { className: 'text-amber-400 font-semibold' }, `${profile?.currentXP || 0} XP`)
              )
            )
          ),
          React.createElement('button', {
            onClick: onLogout,
            className: 'p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all',
            title: 'Sign Out'
          },
            React.createElement(Icon, { name: 'LogOut', size: 18 })
          )
        ) : React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('button', {
            onClick: () => { Sound.playClick(); onNavigate('auth', { mode: 'login' }); },
            className: 'px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white rounded-xl hover:bg-slate-800/80 transition-all'
          }, 'Log In'),
          React.createElement('button', {
            onClick: () => { Sound.playClick(); onNavigate('auth', { mode: 'register' }); },
            className: 'px-4 py-2 text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-brand-500/25 transition-all'
          }, 'Get Started')
        )
      )
    )
  );
};