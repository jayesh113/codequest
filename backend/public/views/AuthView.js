import React, { useState } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const AuthView = ({ initialMode = 'login', onAuthSuccess, onNavigate }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/bottts/svg?seed=Alex');
  const [interests, setInterests] = useState(['Python', 'Web Dev']);

  const avatars = [
    'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Devon',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Maya',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas'
  ];

  const interestOptions = ['Python', 'DSA', 'Web Dev', 'React', 'Backend', 'AI/ML'];

  const toggleInterest = (item) => {
    if (interests.includes(item)) {
      setInterests(interests.filter(i => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      const res = await API.login(email, password);
      API.setToken(res.token);
      API.setUser(res.user);
      Sound.playSuccess();
      onAuthSuccess(res.user, res.profile);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      const res = await API.register({ name, email, password, confirmPassword, avatar, interests });
      API.setToken(res.token);
      API.setUser(res.user);
      Sound.playLevelUp();
      onAuthSuccess(res.user, res.profile);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      const res = await API.forgotPassword(email);
      setInfo(res.message);
    } catch (err) {
      setError(err.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    Sound.playClick();
    if (role === 'student') {
      setEmail('student@codequest.dev');
      setPassword('password123');
    } else {
      setEmail('admin@codequest.dev');
      setPassword('password123');
    }
  };

  return React.createElement('div', { className: 'min-h-[80vh] flex items-center justify-center p-4 text-left' },
    React.createElement('div', { className: 'w-full max-w-md rounded-3xl glass-card border border-slate-800 p-8 shadow-2xl space-y-6' },
      
      // Header
      React.createElement('div', { className: 'text-center space-y-2' },
        React.createElement('div', { className: 'w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-cyber-accent flex items-center justify-center shadow-lg shadow-brand-500/25 mb-3' },
          React.createElement(Icon, { name: 'Terminal', size: 24, className: 'text-white' })
        ),
        React.createElement('h2', { className: 'text-2xl font-black text-white tracking-tight' },
          mode === 'login' ? 'Welcome Back!' : mode === 'register' ? 'Join CodeQuest' : 'Reset Password'
        ),
        React.createElement('p', { className: 'text-xs text-slate-400' },
          mode === 'login' ? 'Log in to continue your streak and earn XP' : mode === 'register' ? 'Create your student profile and start leveling up' : 'Enter your email to receive recovery instructions'
        )
      ),

      // Quick Demo Switcher (Instant 1-Click test accounts)
      mode === 'login' && React.createElement('div', { className: 'p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2' },
        React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center' }, '⚡ 1-Click Demo Accounts'),
        React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
          React.createElement('button', {
            type: 'button',
            onClick: () => fillDemoAccount('student'),
            className: 'px-3 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold transition-all text-center'
          }, 'Student (Alex)'),
          React.createElement('button', {
            type: 'button',
            onClick: () => fillDemoAccount('admin'),
            className: 'px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all text-center'
          }, 'Admin (Marcus)')
        )
      ),

      // Alerts
      error && React.createElement('div', { className: 'p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium' }, error),
      info && React.createElement('div', { className: 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium' }, info),

      // Form
      mode === 'login' && React.createElement('form', { onSubmit: handleLogin, className: 'space-y-4' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Email Address'),
          React.createElement('input', {
            type: 'email',
            required: true,
            value: email,
            onChange: e => setEmail(e.target.value),
            placeholder: 'student@codequest.dev',
            className: 'w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
          })
        ),
        React.createElement('div', null,
          React.createElement('div', { className: 'flex justify-between items-center mb-1' },
            React.createElement('label', { className: 'text-xs font-bold text-slate-400' }, 'Password'),
            React.createElement('button', {
              type: 'button',
              onClick: () => setMode('forgot'),
              className: 'text-[11px] text-brand-400 hover:text-brand-300 font-semibold'
            }, 'Forgot?')
          ),
          React.createElement('input', {
            type: 'password',
            required: true,
            value: password,
            onChange: e => setPassword(e.target.value),
            placeholder: '••••••••',
            className: 'w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
          })
        ),
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: 'w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all'
        }, loading ? 'Signing in...' : 'Sign In to CodeQuest')
      ),

      mode === 'register' && React.createElement('form', { onSubmit: handleRegister, className: 'space-y-3' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Full Name'),
          React.createElement('input', {
            type: 'text',
            required: true,
            value: name,
            onChange: e => setName(e.target.value),
            placeholder: 'Alex River',
            className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Email Address'),
          React.createElement('input', {
            type: 'email',
            required: true,
            value: email,
            onChange: e => setEmail(e.target.value),
            placeholder: 'alex@codequest.dev',
            className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-2 gap-2' },
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Password'),
            React.createElement('input', {
              type: 'password',
              required: true,
              value: password,
              onChange: e => setPassword(e.target.value),
              placeholder: '••••••••',
              className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Confirm'),
            React.createElement('input', {
              type: 'password',
              required: true,
              value: confirmPassword,
              onChange: e => setConfirmPassword(e.target.value),
              placeholder: '••••••••',
              className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
            })
          )
        ),

        // Avatar selector
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Choose Avatar'),
          React.createElement('div', { className: 'flex items-center gap-2' },
            avatars.map((av, i) =>
              React.createElement('img', {
                key: i,
                src: av,
                alt: 'avatar',
                onClick: () => setAvatar(av),
                className: `w-9 h-9 rounded-xl cursor-pointer p-0.5 transition-all ${
                  avatar === av ? 'ring-2 ring-brand-500 bg-brand-500/20' : 'opacity-60 hover:opacity-100'
                }`
              })
            )
          )
        ),

        // Interests tags
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Learning Interests'),
          React.createElement('div', { className: 'flex flex-wrap gap-1.5' },
            interestOptions.map(opt =>
              React.createElement('button', {
                key: opt,
                type: 'button',
                onClick: () => toggleInterest(opt),
                className: `px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  interests.includes(opt)
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`
              }, opt)
            )
          )
        ),

        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: 'w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all mt-2'
        }, loading ? 'Creating Account...' : 'Create Account & Start Quest')
      ),

      mode === 'forgot' && React.createElement('form', { onSubmit: handleForgotPassword, className: 'space-y-4' },
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-1' }, 'Registered Email'),
          React.createElement('input', {
            type: 'email',
            required: true,
            value: email,
            onChange: e => setEmail(e.target.value),
            placeholder: 'student@codequest.dev',
            className: 'w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
          })
        ),
        React.createElement('button', {
          type: 'submit',
          disabled: loading,
          className: 'w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all'
        }, loading ? 'Sending...' : 'Send Reset Instructions')
      ),

      // Footer mode switch
      React.createElement('div', { className: 'text-center pt-2 border-t border-slate-800/80 text-xs text-slate-400' },
        mode === 'login'
          ? React.createElement('span', null,
              'New to CodeQuest? ',
              React.createElement('button', {
                type: 'button',
                onClick: () => setMode('register'),
                className: 'font-bold text-brand-400 hover:text-brand-300'
              }, 'Create an account')
            )
          : React.createElement('span', null,
              'Already have an account? ',
              React.createElement('button', {
                type: 'button',
                onClick: () => setMode('login'),
                className: 'font-bold text-brand-400 hover:text-brand-300'
              }, 'Sign in')
            )
      )
    )
  );
};