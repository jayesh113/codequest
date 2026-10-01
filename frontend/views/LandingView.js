import React from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";

export const LandingView = ({ onNavigate }) => {
  const features = [
    { title: 'Learning Resources', desc: 'Curated PDFs, video lessons, cheatsheets, and interactive code files.', icon: 'BookOpen', color: 'indigo' },
    { title: 'Coding Challenges', desc: 'Solve real-world algorithm problems with instant execution in Python, JS, C, and C++.', icon: 'Code', color: 'cyan' },
    { title: 'Interactive Quizzes', desc: 'Test mastery with timed multiple-choice assessments and detailed answer reviews.', icon: 'HelpCircle', color: 'violet' },
    { title: 'XP & Dynamic Levels', desc: 'Earn XP for every problem solved and level up through 15+ progressive ranks.', icon: 'Zap', color: 'amber' },
    { title: '15 Badges & Achievements', desc: 'Unlock milestones like First Step, Century, Consistent Coder, and Algorithm Ace.', icon: 'Award', color: 'emerald' },
    { title: 'Daily Streaks & Heatmaps', desc: 'Build lasting daily habits with streak multipliers and 30-day activity calendars.', icon: 'Flame', color: 'rose' },
    { title: 'Progress Tracking', desc: 'Visualize your growth across all 5 computer science and web development paths.', icon: 'BarChart3', color: 'blue' },
    { title: 'Live Leaderboards', desc: 'Compete with student peers weekly, monthly, and all-time in a friendly community.', icon: 'Trophy', color: 'yellow' }
  ];

  const popularPaths = [
    { title: 'Python Mastery', level: 'Beginner', modules: '10 Modules', icon: 'Terminal', color: 'from-emerald-500/20 to-emerald-700/10' },
    { title: 'Data Structures & Algorithms', level: 'Intermediate', modules: '10 Modules', icon: 'Cpu', color: 'from-indigo-500/20 to-indigo-700/10' },
    { title: 'Modern Web Development', level: 'Beginner', modules: '9 Modules', icon: 'Layout', color: 'from-cyan-500/20 to-cyan-700/10' },
    { title: 'React Frontend Mastery', level: 'Intermediate', modules: '8 Modules', icon: 'Atom', color: 'from-violet-500/20 to-violet-700/10' }
  ];

  return React.createElement('div', { className: 'space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left' },
    
    // HERO SECTION
    React.createElement('section', { className: 'relative pt-8 pb-12 flex flex-col lg:flex-row items-center justify-between gap-12' },
      React.createElement('div', { className: 'max-w-2xl space-y-6' },
        React.createElement('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold tracking-wide' },
          React.createElement(Icon, { name: 'Sparkles', size: 14 }),
          'STUDENT CODING COMMUNITY & ACADEMY'
        ),
        React.createElement('h1', { className: 'text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight uppercase' },
          'LEARN CODE. ',
          React.createElement('br', null),
          React.createElement('span', { className: 'bg-gradient-to-r from-brand-400 via-indigo-300 to-cyber-accent bg-clip-text text-transparent' }, 'COMPLETE CHALLENGES. '),
          React.createElement('br', null),
          'LEVEL UP.'
        ),
        React.createElement('p', { className: 'text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed' },
          'A gamified coding platform where students learn programming, solve challenges, earn XP, and grow together.'
        ),
        React.createElement('div', { className: 'flex flex-wrap items-center gap-4 pt-4' },
          React.createElement('button', {
            onClick: () => { Sound.playClick(); onNavigate('auth', { mode: 'register' }); },
            className: 'px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyber-accent hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] transition-all flex items-center gap-2'
          },
            React.createElement(Icon, { name: 'Play', size: 16 }),
            'Start Learning'
          ),
          React.createElement('button', {
            onClick: () => { Sound.playClick(); onNavigate('challenges'); },
            className: 'px-8 py-3.5 rounded-2xl glass-card hover:bg-slate-800/90 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all flex items-center gap-2'
          },
            React.createElement(Icon, { name: 'Code', size: 16 }),
            'Explore Challenges'
          )
        )
      ),

      // Hero Illustration (Coding Window with cyber glow)
      React.createElement('div', { className: 'w-full lg:w-[480px] shrink-0' },
        React.createElement('div', { className: 'relative rounded-3xl p-1 bg-gradient-to-tr from-brand-500 via-indigo-500 to-cyber-accent shadow-2xl shadow-brand-500/20 animate-float' },
          React.createElement('div', { className: 'rounded-[22px] bg-[#0c111e] p-5 font-mono text-xs text-slate-300 space-y-3' },
            React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-slate-800' },
              React.createElement('div', { className: 'flex items-center gap-2' },
                React.createElement('span', { className: 'w-3 h-3 rounded-full bg-rose-500' }),
                React.createElement('span', { className: 'w-3 h-3 rounded-full bg-amber-500' }),
                React.createElement('span', { className: 'w-3 h-3 rounded-full bg-emerald-500' })
              ),
              React.createElement('span', { className: 'text-[10px] text-slate-500' }, 'codequest_challenge.py')
            ),
            React.createElement('div', { className: 'text-brand-400 font-bold' }, '# Daily Student Quest: Two Sum'),
            React.createElement('div', null, React.createElement('span', { className: 'text-purple-400' }, 'def '), React.createElement('span', { className: 'text-blue-400' }, 'solve_challenge'), '(nums, target):'),
            React.createElement('div', { className: 'pl-4 text-slate-400' }, 'seen = {}'),
            React.createElement('div', { className: 'pl-4' },
              React.createElement('span', { className: 'text-purple-400' }, 'for '), 'i, n ', React.createElement('span', { className: 'text-purple-400' }, 'in '), 'enumerate(nums):'
            ),
            React.createElement('div', { className: 'pl-8' }, 'diff = target - n'),
            React.createElement('div', { className: 'pl-8' },
              React.createElement('span', { className: 'text-purple-400' }, 'if '), 'diff in seen:'
            ),
            React.createElement('div', { className: 'pl-12 text-emerald-400' }, 'return [seen[diff], i] # +100 XP!'),
            React.createElement('div', { className: 'pl-8' }, 'seen[n] = i'),
            React.createElement('div', { className: 'pt-2 flex items-center justify-between border-t border-slate-800/80 text-[11px]' },
              React.createElement('span', { className: 'text-emerald-400 font-bold flex items-center gap-1.5' },
                React.createElement(Icon, { name: 'CheckCircle', size: 14 }),
                '4/4 Test Cases Passed'
              ),
              React.createElement('span', { className: 'text-amber-400 font-bold' }, '+100 XP REWARD')
            )
          )
        )
      )
    ),

    // PLATFORM FEATURES SECTION (8 CARDS)
    React.createElement('section', { className: 'space-y-8' },
      React.createElement('div', { className: 'text-center max-w-xl mx-auto space-y-2' },
        React.createElement('h2', { className: 'text-xs uppercase font-extrabold tracking-widest text-brand-400' }, 'Platform Features'),
        React.createElement('h3', { className: 'text-3xl font-black text-white' }, 'Built for Ambitious Coders')
      ),
      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
        features.map((f, i) =>
          React.createElement('div', {
            key: i,
            className: 'p-6 rounded-3xl glass-card border border-slate-800/80 hover:border-brand-500/40 hover:-translate-y-1 transition-all duration-200'
          },
            React.createElement('div', { className: 'w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4' },
              React.createElement(Icon, { name: f.icon, size: 24 })
            ),
            React.createElement('h4', { className: 'text-base font-bold text-white mb-2' }, f.title),
            React.createElement('p', { className: 'text-xs text-slate-400 leading-relaxed' }, f.desc)
          )
        )
      )
    ),

    // POPULAR LEARNING PATHS
    React.createElement('section', { className: 'space-y-8' },
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('div', null,
          React.createElement('h2', { className: 'text-xs uppercase font-extrabold tracking-widest text-brand-400' }, 'Curriculum'),
          React.createElement('h3', { className: 'text-2xl font-black text-white' }, 'Popular Learning Paths')
        ),
        React.createElement('button', {
          onClick: () => { Sound.playClick(); onNavigate('paths'); },
          className: 'text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1'
        }, 'View All Paths', React.createElement(Icon, { name: 'ChevronRight', size: 16 }))
      ),
      React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
        popularPaths.map((p, i) =>
          React.createElement('div', {
            key: i,
            onClick: () => { Sound.playClick(); onNavigate('paths'); },
            className: 'p-6 rounded-3xl glass-card border border-slate-800 cursor-pointer hover:border-brand-500/50 hover:scale-[1.02] transition-all'
          },
            React.createElement('div', { className: 'w-12 h-12 rounded-2xl bg-slate-800 text-brand-400 flex items-center justify-center mb-4' },
              React.createElement(Icon, { name: p.icon, size: 24 })
            ),
            React.createElement('span', { className: 'text-[10px] uppercase font-bold text-slate-400' }, p.level),
            React.createElement('h4', { className: 'text-base font-bold text-white mt-1' }, p.title),
            React.createElement('p', { className: 'text-xs text-slate-400 mt-2 flex items-center justify-between' },
              React.createElement('span', null, p.modules),
              React.createElement('span', { className: 'text-brand-400 font-semibold' }, 'Enroll Free →')
            )
          )
        )
      )
    ),

    // CTA FOOTER
    React.createElement('section', {
      className: 'rounded-3xl p-10 bg-gradient-to-r from-brand-900/50 via-indigo-900/40 to-cyber-accent/20 border border-brand-500/30 text-center space-y-6 shadow-2xl'
    },
      React.createElement('h3', { className: 'text-3xl sm:text-4xl font-black text-white' }, 'Ready to level up your coding journey?'),
      React.createElement('p', { className: 'text-sm text-slate-300 max-w-lg mx-auto' },
        'Join over 100+ students learning programming, solving coding challenges, and climbing the community leaderboard.'
      ),
      React.createElement('button', {
        onClick: () => { Sound.playClick(); onNavigate('auth', { mode: 'register' }); },
        className: 'px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 shadow-xl transition-all'
      }, 'Join CodeQuest Free Today')
    )
  );
};