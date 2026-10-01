import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const ResourceLibraryView = ({ onSelectResource }) => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, [typeFilter, topicFilter, difficultyFilter, search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await API.getResources({
        type: typeFilter,
        topic: topicFilter,
        difficulty: difficultyFilter,
        search
      });
      setResources(res.resources || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (id, e) => {
    e.stopPropagation();
    Sound.playClick();
    try {
      await API.toggleBookmark(id);
      fetchResources();
    } catch (err) {
      console.error(err);
    }
  };

  const types = ['all', 'pdf', 'video', 'article', 'notes', 'code'];
  const topics = ['all', 'Python', 'DSA', 'Web Dev', 'React', 'Backend'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  return React.createElement('div', { className: 'space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left' },
    
    // Header
    React.createElement('div', null,
      React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white' }, 'Resource Library'),
      React.createElement('p', { className: 'text-xs sm:text-sm text-slate-400 mt-1' },
        'Explore comprehensive guides, PDFs, video tutorials, cheatsheets, and source code.'
      )
    ),

    // Search and Filters Bar
    React.createElement('div', { className: 'p-4 rounded-3xl glass-card border border-slate-800 space-y-4' },
      React.createElement('div', { className: 'relative' },
        React.createElement('span', { className: 'absolute left-4 top-3 text-slate-400' },
          React.createElement(Icon, { name: 'Search', size: 18 })
        ),
        React.createElement('input', {
          type: 'text',
          value: search,
          onChange: e => setSearch(e.target.value),
          placeholder: 'Search Python, arrays, React, algorithms...',
          className: 'w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-brand-500 focus:outline-none'
        })
      ),

      React.createElement('div', { className: 'flex flex-wrap items-center gap-3 text-xs' },
        
        // Type filter pills
        React.createElement('div', { className: 'flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full' },
          React.createElement('span', { className: 'text-[11px] font-bold text-slate-500 mr-1' }, 'Type:'),
          types.map(t =>
            React.createElement('button', {
              key: t,
              onClick: () => { Sound.playClick(); setTypeFilter(t); },
              className: `px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                typeFilter === t
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`
            }, t)
          )
        ),

        // Topic filter dropdown
        React.createElement('div', { className: 'flex items-center gap-1.5' },
          React.createElement('span', { className: 'text-[11px] font-bold text-slate-500' }, 'Topic:'),
          React.createElement('select', {
            value: topicFilter,
            onChange: e => setTopicFilter(e.target.value),
            className: 'px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold focus:outline-none'
          },
            topics.map(tp => React.createElement('option', { key: tp, value: tp }, tp))
          )
        ),

        // Difficulty dropdown
        React.createElement('div', { className: 'flex items-center gap-1.5' },
          React.createElement('span', { className: 'text-[11px] font-bold text-slate-500' }, 'Difficulty:'),
          React.createElement('select', {
            value: difficultyFilter,
            onChange: e => setDifficultyFilter(e.target.value),
            className: 'px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold focus:outline-none'
          },
            difficulties.map(d => React.createElement('option', { key: d, value: d }, d))
          )
        )
      )
    ),

    // Resource Cards Grid
    loading
      ? React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading resources...')
      : resources.length === 0
      ? React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'No resources found matching filters.')
      : React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          resources.map((r, idx) =>
            React.createElement('div', {
              key: r._id || idx,
              onClick: () => onSelectResource(r),
              className: 'p-6 rounded-3xl glass-card border border-slate-800 hover:border-brand-500/40 cursor-pointer hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-lg'
            },
              React.createElement('div', { className: 'space-y-3' },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('span', {
                      className: `text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        r.resourceType === 'pdf' ? 'bg-red-500/20 text-red-300' :
                        r.resourceType === 'video' ? 'bg-purple-500/20 text-purple-300' :
                        r.resourceType === 'code' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`
                    }, r.resourceType),
                    React.createElement('span', { className: 'text-[11px] font-semibold text-slate-400' }, r.duration)
                  ),
                  React.createElement('button', {
                    onClick: (e) => handleToggleBookmark(r._id, e),
                    className: `p-1.5 rounded-lg transition-colors ${
                      r.isBookmarked ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
                    }`
                  },
                    React.createElement(Icon, { name: 'Bookmark', size: 16 })
                  )
                ),
                React.createElement('h3', { className: 'text-base font-bold text-white line-clamp-2' }, r.title),
                React.createElement('p', { className: 'text-xs text-slate-400 line-clamp-3 leading-relaxed' }, r.description)
              ),

              React.createElement('div', { className: 'pt-3 border-t border-slate-800 flex items-center justify-between text-xs' },
                React.createElement('span', { className: 'text-amber-400 font-bold flex items-center gap-1' },
                  React.createElement(Icon, { name: 'Zap', size: 14 }),
                  `+${r.xpReward || 25} XP`
                ),
                React.createElement('span', { className: 'text-brand-400 font-bold' }, 'Read Now →')
              )
            )
          )
        )
  );
};