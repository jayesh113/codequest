import { Quiz, QuizQuestion, Achievement, Announcement } from '../models/index.js';

export const seedQuizzesAndBadges = async () => {
  const quizzes = [
    {
      title: 'Python Fundamentals Quiz',
      description: 'Test your understanding of core Python types, loops, conditionals, and scope.',
      topic: 'Python',
      difficulty: 'Beginner',
      timeLimitMinutes: 10,
      xpReward: 80,
      passingScore: 70,
      questions: [
        { question: 'What is the output of type(5 / 2) in Python 3?', options: ['<class \'int\'>', '<class \'float\'>', '<class \'double\'>', '<class \'number\'>'], correctOptionIndex: 1, explanation: 'In Python 3, single slash division always returns a float.' },
        { question: 'Which built-in type in Python is mutable?', options: ['tuple', 'str', 'list', 'frozenset'], correctOptionIndex: 2, explanation: 'Lists can be modified in-place; tuples and strings are immutable.' },
        { question: 'What does the "pass" keyword do in Python?', options: ['Exits current loop', 'Skips to next iteration', 'Acts as a null placeholder statement', 'Throws an exception'], correctOptionIndex: 2, explanation: 'pass is an explicit no-op placeholder.' },
        { question: 'How do you define a function in Python?', options: ['function myFunc()', 'def myFunc():', 'func myFunc()', 'fn myFunc():'], correctOptionIndex: 1, explanation: 'Python uses the "def" keyword.' },
        { question: 'Which dictionary method retrieves a value without raising a KeyError if absent?', options: ['dict.find(key)', 'dict.get(key)', 'dict.has(key)', 'dict.lookup(key)'], correctOptionIndex: 1, explanation: 'dict.get(key) returns None (or default) if key not present.' }
      ]
    },
    {
      title: 'Data Structures & Big-O Quiz',
      description: 'Evaluate your knowledge of time complexities, lists, hash maps, and stacks.',
      topic: 'DSA',
      difficulty: 'Intermediate',
      timeLimitMinutes: 10,
      xpReward: 90,
      passingScore: 70,
      questions: [
        { question: 'What is the average time complexity of searching in a Hash Table?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctOptionIndex: 0, explanation: 'Hash tables offer O(1) average lookup assuming a well-distributed hash function.' },
        { question: 'Which data structure follows the Last-In First-Out (LIFO) principle?', options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'], correctOptionIndex: 1, explanation: 'Stacks operate strictly on LIFO.' },
        { question: 'What is the worst-case time complexity of QuickSort?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(2^n)'], correctOptionIndex: 2, explanation: 'QuickSort degrades to O(n^2) when poor pivots are repeatedly chosen.' },
        { question: 'In a balanced Binary Search Tree, what is the search complexity?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], correctOptionIndex: 1, explanation: 'Balanced BST search takes logarithmic time O(log n).' }
      ]
    },
    {
      title: 'Modern JavaScript & ES6 Quiz',
      description: 'Challenge your comprehension of closures, event loop, Promises, and modern syntax.',
      topic: 'JavaScript',
      difficulty: 'Intermediate',
      timeLimitMinutes: 8,
      xpReward: 80,
      passingScore: 70,
      questions: [
        { question: 'Which keyword creates a block-scoped variable that cannot be reassigned?', options: ['var', 'let', 'const', 'static'], correctOptionIndex: 2, explanation: 'const creates a block-scoped read-only reference.' },
        { question: 'What is the return value of typeof NaN in JavaScript?', options: ['"undefined"', '"number"', '"NaN"', '"object"'], correctOptionIndex: 1, explanation: 'In JavaScript specification, NaN is of type "number".' },
        { question: 'Which method returns a new array with elements that pass a test?', options: ['map()', 'filter()', 'reduce()', 'forEach()'], correctOptionIndex: 1, explanation: 'filter() creates a shallow copy containing only matching elements.' }
      ]
    },
    {
      title: 'React Fundamentals Quiz',
      description: 'Test your understanding of JSX, state immutability, useEffect dependencies, and keys.',
      topic: 'React',
      difficulty: 'Beginner',
      timeLimitMinutes: 10,
      xpReward: 85,
      passingScore: 70,
      questions: [
        { question: 'Why must list items in React have unique "key" props?', options: ['For CSS styling', 'To help React identify which items have changed, been added, or removed', 'To bind click events', 'To prevent memory leaks'], correctOptionIndex: 1, explanation: 'Keys help React efficiently reconcile and update the DOM.' },
        { question: 'When does a useEffect hook with an empty dependency array [] run?', options: ['On every render', 'Only once after initial mount', 'Never', 'Before component renders'], correctOptionIndex: 1, explanation: 'An empty dependency array causes the effect to run once after the initial render.' }
      ]
    }
  ];

  for (const q of quizzes) {
    const questions = q.questions;
    delete q.questions;
    const qDoc = await Quiz.create(q);
    for (const item of questions) {
      await QuizQuestion.create({ quizId: qDoc._id, ...item });
    }
  }

  // 15 Achievements
  const achievements = [
    { key: 'first_step', title: 'First Step', description: 'Complete your first coding task or challenge.', icon: 'Award', category: 'Milestone', xpReward: 50, criteriaType: 'first_step', criteriaThreshold: 1 },
    { key: 'python_beginner', title: 'Python Beginner', description: 'Complete the Python Basics module and tasks.', icon: 'Terminal', category: 'Learning', xpReward: 75, criteriaType: 'tasks_completed', criteriaThreshold: 3 },
    { key: 'problem_solver', title: 'Problem Solver', description: 'Solve 10 coding challenges successfully.', icon: 'Cpu', category: 'Challenges', xpReward: 150, criteriaType: 'problems_solved', criteriaThreshold: 10 },
    { key: 'consistent_coder', title: 'Consistent Coder', description: 'Maintain an active 7-day coding streak.', icon: 'Flame', category: 'Streaks', xpReward: 100, criteriaType: 'streak_days', criteriaThreshold: 7 },
    { key: 'century', title: 'Century', description: 'Earn your first 1,000 XP on CodeQuest.', icon: 'Zap', category: 'XP', xpReward: 100, criteriaType: 'total_xp', criteriaThreshold: 1000 },
    { key: 'streak_master', title: 'Streak Master', description: 'Maintain a 14-day daily coding streak.', icon: 'Flame', category: 'Streaks', xpReward: 250, criteriaType: 'streak_days', criteriaThreshold: 14 },
    { key: 'algorithm_ace', title: 'Algorithm Ace', description: 'Solve 25 algorithmic problems.', icon: 'Binary', category: 'Challenges', xpReward: 300, criteriaType: 'problems_solved', criteriaThreshold: 25 },
    { key: 'task_crusher', title: 'Task Crusher', description: 'Complete 15 student community tasks.', icon: 'CheckCircle', category: 'Tasks', xpReward: 200, criteriaType: 'tasks_completed', criteriaThreshold: 15 },
    { key: 'quiz_whiz', title: 'Quiz Whiz', description: 'Score 100% on 3 different programming quizzes.', icon: 'HelpCircle', category: 'Quizzes', xpReward: 120, criteriaType: 'tasks_completed', criteriaThreshold: 5 },
    { key: 'project_builder', title: 'Project Builder', description: 'Complete a capstone learning path project.', icon: 'FolderGit2', category: 'Projects', xpReward: 250, criteriaType: 'tasks_completed', criteriaThreshold: 8 },
    { key: 'coding_champion', title: 'Coding Champion', description: 'Reach 2,500 total XP milestone.', icon: 'Trophy', category: 'XP', xpReward: 400, criteriaType: 'total_xp', criteriaThreshold: 2500 },
    { key: 'web_artisan', title: 'Web Artisan', description: 'Complete 5 frontend and UI development tasks.', icon: 'Layout', category: 'Frontend', xpReward: 150, criteriaType: 'tasks_completed', criteriaThreshold: 5 },
    { key: 'backend_guru', title: 'Backend Guru', description: 'Solve 5 API and system engineering tasks.', icon: 'Server', category: 'Backend', xpReward: 150, criteriaType: 'tasks_completed', criteriaThreshold: 6 },
    { key: 'unstoppable', title: 'Unstoppable 30', description: 'Reach a legendary 30-day streak.', icon: 'Sparkles', category: 'Streaks', xpReward: 500, criteriaType: 'streak_days', criteriaThreshold: 30 },
    { key: 'grandmaster', title: 'Grandmaster Coder', description: 'Amass 5,000 XP and demonstrate complete mastery.', icon: 'Crown', category: 'Elite', xpReward: 1000, criteriaType: 'total_xp', criteriaThreshold: 5000 }
  ];

  for (const a of achievements) {
    await Achievement.create(a);
  }

  // Announcements
  await Announcement.create({
    title: '🚀 Welcome to CodeQuest Semester Season!',
    content: 'Welcome students! Explore learning paths, solve daily coding challenges in Python, JS, C, and C++, earn XP, and level up your developer profile.',
    type: 'announcement',
    xpReward: 20
  });

  await Announcement.create({
    title: '⚔️ New DSA Challenge: Maximum Subarray',
    content: 'A new dynamic programming challenge has been posted. Can you solve it in linear O(n) time using Kadane\'s algorithm? Earn +150 XP!',
    type: 'challenge',
    xpReward: 150
  });

  await Announcement.create({
    title: '🔥 Weekend Streak Multiplier Activated',
    content: 'Maintain your streak this weekend to qualify for milestone bonuses. 7-day streak grants +100 bonus XP and the Consistent Coder badge!',
    type: 'event',
    xpReward: 50
  });

  console.log('✅ Created Quizzes, 15 Achievements, and Announcements');
};