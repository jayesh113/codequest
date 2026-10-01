import React, { useState } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";

// 1. Level Up Modal
export const LevelUpModal = ({ level, onClose }) => {
  React.useEffect(() => {
    Sound.playLevelUp();
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  return React.createElement('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in'
  },
    React.createElement('div', {
      className: 'relative max-w-sm w-full rounded-3xl p-8 glass-card border border-brand-500/40 text-center shadow-2xl shadow-brand-500/30'
    },
      React.createElement('div', {
        className: 'w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyber-accent flex items-center justify-center shadow-lg shadow-brand-500/50 animate-bounce'
      },
        React.createElement(Icon, { name: 'Crown', size: 48, className: 'text-amber-300' })
      ),
      React.createElement('span', { className: 'text-xs uppercase font-black tracking-widest text-brand-400' }, '🎉 MILESTONE REACHED'),
      React.createElement('h3', { className: 'text-3xl font-black text-white mt-1 mb-2' }, `LEVEL ${level}!`),
      React.createElement('p', { className: 'text-xs text-slate-300 mb-6' }, 'You leveled up on CodeQuest! Keep solving problems, completing paths, and dominating the leaderboard.'),
      React.createElement('button', {
        onClick: onClose,
        className: 'w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all'
      }, 'Continue Quest ⚔️')
    )
  );
};

// 2. XP Floating Toast
export const XPFloater = ({ amount, message }) => {
  return React.createElement('div', {
    className: 'fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 border border-brand-500/50 shadow-2xl text-white animate-xp-rise'
  },
    React.createElement('div', { className: 'w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center' },
      React.createElement(Icon, { name: 'Zap', size: 20 })
    ),
    React.createElement('div', null,
      React.createElement('div', { className: 'text-sm font-black text-amber-400' }, `+${amount} XP EARNED!`),
      React.createElement('div', { className: 'text-xs text-slate-400' }, message || 'Awesome work!')
    )
  );
};

// 3. Task Submit Modal
export const TaskModal = ({ task, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await onSubmit(task._id, content);
    setLoading(false);
  };

  return React.createElement('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
  },
    React.createElement('div', {
      className: 'relative max-w-2xl w-full rounded-3xl p-6 sm:p-8 glass-card border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto text-left'
    },
      React.createElement('div', { className: 'flex items-center justify-between pb-4 border-b border-slate-800' },
        React.createElement('div', null,
          React.createElement('span', { className: 'text-[11px] font-bold text-brand-400 uppercase tracking-wider' }, task.category),
          React.createElement('h3', { className: 'text-xl font-bold text-white' }, task.title)
        ),
        React.createElement('button', { onClick: onClose, className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800' },
          React.createElement(Icon, { name: 'X', size: 20 })
        )
      ),

      React.createElement('div', { className: 'my-6 space-y-4' },
        React.createElement('div', { className: 'p-4 rounded-2xl bg-slate-900/60 border border-slate-800' },
          React.createElement('h4', { className: 'text-xs font-bold text-slate-300 uppercase mb-1' }, 'Instructions'),
          React.createElement('p', { className: 'text-sm text-slate-300 whitespace-pre-wrap' }, task.instructions)
        ),
        React.createElement('div', null,
          React.createElement('label', { className: 'block text-xs font-bold text-slate-400 mb-2' }, 'Your Solution (Code or Explanation):'),
          React.createElement('textarea', {
            rows: 8,
            value: content,
            onChange: (e) => setContent(e.target.value),
            placeholder: 'Paste your code, Github repo link, or solution explanation here...',
            className: 'w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:border-brand-500 focus:outline-none'
          })
        )
      ),

      React.createElement('div', { className: 'flex items-center justify-between pt-4 border-t border-slate-800' },
        React.createElement('span', { className: 'text-xs font-bold text-amber-400 flex items-center gap-1.5' },
          React.createElement(Icon, { name: 'Zap', size: 16 }),
          `Reward: +${task.xpReward} XP`
        ),
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('button', { onClick: onClose, className: 'px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white' }, 'Cancel'),
          React.createElement('button', {
            onClick: handleSubmit,
            disabled: loading || !content.trim(),
            className: 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 disabled:opacity-50'
          }, loading ? 'Submitting...' : 'Submit & Claim XP')
        )
      )
    )
  );
};

// 4. Resource Viewer Modal
export const ResourceModal = ({ resource, onClose, onComplete }) => {
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(resource.url);

  return React.createElement('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'
  },
    React.createElement('div', {
      className: 'relative max-w-2xl w-full rounded-3xl p-6 sm:p-8 glass-card border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto text-left'
    },
      React.createElement('div', { className: 'flex items-center justify-between pb-4 border-b border-slate-800' },
        React.createElement('div', null,
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', { className: 'text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300' }, resource.resourceType),
            React.createElement('span', { className: 'text-xs text-slate-400' }, resource.duration)
          ),
          React.createElement('h3', { className: 'text-xl font-bold text-white mt-1' }, resource.title)
        ),
        React.createElement('button', { onClick: onClose, className: 'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800' },
          React.createElement(Icon, { name: 'X', size: 20 })
        )
      ),

      React.createElement('div', { className: 'my-6 space-y-4' },
        ytEmbed && React.createElement('div', { className: 'relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black' },
          React.createElement('iframe', {
            src: ytEmbed,
            title: resource.title,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowFullScreen: true,
            className: 'w-full h-full border-0'
          })
        ),
        React.createElement('p', { className: 'text-sm text-slate-300 leading-relaxed' }, resource.description),
        resource.url && React.createElement('div', { className: 'p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between' },
          React.createElement('div', null,
            React.createElement('div', { className: 'text-xs font-bold text-slate-300' }, 'External Reference / Documentation'),
            React.createElement('div', { className: 'text-[11px] text-brand-400 truncate max-w-md' }, resource.url)
          ),
          React.createElement('a', {
            href: resource.url,
            target: '_blank',
            rel: 'noreferrer',
            className: 'px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200'
          }, 'Open Link ↗')
        )
      ),

      React.createElement('div', { className: 'flex items-center justify-between pt-4 border-t border-slate-800' },
        React.createElement('span', { className: 'text-xs font-bold text-amber-400 flex items-center gap-1.5' },
          React.createElement(Icon, { name: 'Zap', size: 16 }),
          `+${resource.xpReward || 25} XP on completion`
        ),
        React.createElement('div', { className: 'flex items-center gap-3' },
          React.createElement('button', { onClick: onClose, className: 'px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white' }, 'Close'),
          React.createElement('button', {
            onClick: () => onComplete(resource._id),
            className: 'px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25'
          }, 'Mark Completed ✓')
        )
      )
    )
  );
};