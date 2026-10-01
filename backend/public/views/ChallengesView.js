import React, { useState, useEffect } from "https://esm.sh/react@18.3.1";
import { Icon } from "../icons.js";
import { Sound } from "../sound.js";
import { API } from "../api.js";

export const ChallengesView = ({ onChallengeSolved }) => {
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await API.getChallenges();
      setChallenges(res.challenges || []);
      if (res.challenges && res.challenges.length > 0 && !activeChallenge) {
        selectChallenge(res.challenges[0].slug);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectChallenge = async (slug) => {
    Sound.playClick();
    try {
      const res = await API.getChallenge(slug);
      setActiveChallenge(res.challenge);
      const defaultLang = 'python';
      setLanguage(defaultLang);
      setCode(res.challenge.starterCode[defaultLang] || '');
      setCustomInput(res.challenge.examples[0]?.input || '');
      setOutput(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (activeChallenge && activeChallenge.starterCode) {
      setCode(activeChallenge.starterCode[lang] || '');
    }
  };

  const handleRunCode = async () => {
    Sound.playClick();
    setRunning(true);
    setOutput(null);
    try {
      const res = await API.runCode({
        language,
        code,
        customInput,
        challengeId: activeChallenge?._id
      });
      setOutput(res);
      if (res.allPassed) Sound.playSuccess();
    } catch (e) {
      setOutput({ status: 'ERROR', error: e.message });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    Sound.playClick();
    setSubmitting(true);
    try {
      const res = await API.submitChallenge(activeChallenge._id, {
        language,
        code
      });
      setOutput(res.execResult);

      if (res.execResult.status === 'PASSED') {
        Sound.playXP();
        if (window.confetti) {
          window.confetti({ particleCount: 100, spread: 60 });
        }
        if (onChallengeSolved) {
          onChallengeSolved(res.xpResult.amount || activeChallenge.xpReward, `Solved ${activeChallenge.title}!`);
        }
        loadChallenges(); // reload solved state
      }
    } catch (e) {
      setOutput({ status: 'ERROR', error: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return React.createElement('div', { className: 'p-12 text-center text-slate-400' }, 'Loading Coding Arena...');
  }

  return React.createElement('div', { className: 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-left' },
    
    // Top Bar
    React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4' },
      React.createElement('div', null,
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement('span', { className: 'text-[10px] font-black uppercase tracking-widest text-brand-400 px-2 py-0.5 rounded bg-brand-500/10' }, 'ONLINE JUDGE'),
          React.createElement('span', { className: 'text-xs text-slate-400' }, 'Sandboxed Python 3, Node.js & GCC')
        ),
        React.createElement('h1', { className: 'text-2xl sm:text-3xl font-black text-white mt-1' }, 'Algorithmic Challenges')
      ),

      // Challenge selector dropdown on mobile/tablet
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('select', {
          value: activeChallenge?.slug || '',
          onChange: e => selectChallenge(e.target.value),
          className: 'px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none'
        },
          challenges.map(c =>
            React.createElement('option', { key: c.slug, value: c.slug },
              `${c.isSolved ? '✓ ' : ''}${c.title} (${c.difficulty})`
            )
          )
        )
      )
    ),

    // IDE LAYOUT: Split view (Problem Statement on Left, Editor & Judge on Right)
    React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
      
      // LEFT PANE: Problem Description (5 cols)
      activeChallenge && React.createElement('div', {
        className: 'lg:col-span-5 rounded-3xl p-6 glass-card border border-slate-800 space-y-5 max-h-[750px] overflow-y-auto'
      },
        React.createElement('div', { className: 'flex items-center justify-between pb-3 border-b border-slate-800' },
          React.createElement('div', null,
            React.createElement('span', { className: 'text-[10px] font-bold uppercase text-brand-400' }, activeChallenge.category),
            React.createElement('h2', { className: 'text-xl font-black text-white mt-0.5' }, activeChallenge.title)
          ),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('span', {
              className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeChallenge.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`
            }, activeChallenge.difficulty),
            React.createElement('span', { className: 'text-xs font-bold text-amber-400' }, `+${activeChallenge.xpReward} XP`)
          )
        ),

        React.createElement('div', { className: 'space-y-3 text-xs leading-relaxed text-slate-300' },
          React.createElement('p', null, activeChallenge.description),
          
          activeChallenge.inputFormat && React.createElement('div', { className: 'pt-2' },
            React.createElement('h4', { className: 'font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-1' }, 'Input Format'),
            React.createElement('pre', { className: 'p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 whitespace-pre-wrap' }, activeChallenge.inputFormat)
          ),

          activeChallenge.outputFormat && React.createElement('div', null,
            React.createElement('h4', { className: 'font-bold text-slate-200 uppercase text-[10px] tracking-wider mb-1' }, 'Output Format'),
            React.createElement('pre', { className: 'p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 whitespace-pre-wrap' }, activeChallenge.outputFormat)
          ),

          // Examples
          activeChallenge.examples && activeChallenge.examples.map((ex, i) =>
            React.createElement('div', { key: i, className: 'p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5' },
              React.createElement('div', { className: 'font-bold text-[11px] text-brand-400' }, `Example ${i + 1}:`),
              React.createElement('div', { className: 'font-mono text-[11px] text-slate-300' },
                React.createElement('span', { className: 'text-slate-500' }, 'Input: '), ex.input
              ),
              React.createElement('div', { className: 'font-mono text-[11px] text-slate-300' },
                React.createElement('span', { className: 'text-slate-500' }, 'Output: '), ex.output
              ),
              ex.explanation && React.createElement('div', { className: 'text-[11px] text-slate-400 italic' }, ex.explanation)
            )
          )
        )
      ),

      // RIGHT PANE: Code Editor & Judge (7 cols)
      React.createElement('div', { className: 'lg:col-span-7 flex flex-col space-y-4' },
        
        // Editor Controls Bar
        React.createElement('div', { className: 'p-3 rounded-2xl glass-card border border-slate-800 flex items-center justify-between' },
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement(Icon, { name: 'Code', size: 16, className: 'text-brand-400' }),
            ['python', 'javascript', 'c', 'cpp'].map(lang =>
              React.createElement('button', {
                key: lang,
                onClick: () => handleLanguageChange(lang),
                className: `px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                  language === lang
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:text-white'
                }`
              }, lang === 'cpp' ? 'C++' : lang)
            )
          ),
          React.createElement('div', { className: 'flex items-center gap-2' },
            React.createElement('button', {
              onClick: handleRunCode,
              disabled: running || submitting,
              className: 'px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all'
            },
              React.createElement(Icon, { name: 'Play', size: 14 }),
              running ? 'Running...' : 'Run Code'
            ),
            React.createElement('button', {
              onClick: handleSubmit,
              disabled: submitting || running,
              className: 'px-5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all'
            },
              React.createElement(Icon, { name: 'Send', size: 14 }),
              submitting ? 'Testing...' : 'Submit Code'
            )
          )
        ),

        // Code Editor Textarea
        React.createElement('div', { className: 'relative rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-2xl' },
          React.createElement('div', { className: 'px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono' },
            React.createElement('span', null, `solution.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'c' ? 'c' : 'cpp'}`),
            React.createElement('span', null, 'UTF-8')
          ),
          React.createElement('textarea', {
            rows: 15,
            value: code,
            onChange: e => setCode(e.target.value),
            spellCheck: false,
            className: 'w-full p-4 bg-[#080B14] font-mono text-xs text-slate-100 focus:outline-none resize-none leading-relaxed selection:bg-brand-600'
          })
        ),

        // Custom Test Input Field
        React.createElement('div', { className: 'p-4 rounded-2xl glass-card border border-slate-800 space-y-2' },
          React.createElement('label', { className: 'text-[11px] font-bold text-slate-400 uppercase tracking-wider block' }, 'Custom Test Input (stdin):'),
          React.createElement('input', {
            type: 'text',
            value: customInput,
            onChange: e => setCustomInput(e.target.value),
            placeholder: 'e.g. 2 7 11 15\\n9',
            className: 'w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:border-brand-500 focus:outline-none'
          })
        ),

        // Execution & Test Case Output Results Panel
        output && React.createElement('div', {
          className: `p-5 rounded-3xl glass-card border transition-all space-y-3 ${
            output.status === 'PASSED' ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'
          }`
        },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('div', { className: 'flex items-center gap-2' },
              React.createElement('span', {
                className: `text-xs font-black uppercase px-2.5 py-1 rounded-xl ${
                  output.status === 'PASSED' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`
              }, output.status),
              React.createElement('span', { className: 'text-xs font-bold text-slate-200' },
                output.status === 'PASSED' ? 'All Test Cases Passed!' : 'Test Cases Incomplete'
              )
            ),
            output.totalPassed !== undefined && React.createElement('span', { className: 'text-xs font-bold text-slate-300' },
              `${output.totalPassed}/${output.totalTests} Passed`
            )
          ),

          // Output Test cases breakdown
          output.testResults && React.createElement('div', { className: 'space-y-2 pt-2' },
            output.testResults.map(tr =>
              React.createElement('div', {
                key: tr.testCase,
                className: 'p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex flex-col gap-1'
              },
                React.createElement('div', { className: 'flex items-center justify-between' },
                  React.createElement('span', { className: tr.passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold' },
                    `${tr.passed ? '✓' : '✗'} Test Case ${tr.testCase}`
                  ),
                  React.createElement('span', { className: 'text-[10px] text-slate-500' }, `${tr.runtimeMs}ms`)
                ),
                !tr.isHidden && React.createElement('div', { className: 'text-[11px] text-slate-400' },
                  React.createElement('span', { className: 'text-slate-500' }, 'Expected: '), tr.expected
                ),
                !tr.isHidden && React.createElement('div', { className: 'text-[11px] text-slate-200' },
                  React.createElement('span', { className: 'text-slate-500' }, 'Output: '), tr.actual
                ),
                tr.error && React.createElement('div', { className: 'text-[11px] text-rose-400 whitespace-pre-wrap' }, tr.error)
              )
            )
          )
        )
      )
    )
  );
};