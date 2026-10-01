import {
  LearningPath, Module, Resource, Task, Challenge, Quiz, QuizQuestion, Achievement, Announcement, Notification
} from '../models/index.js';

export const seedContent = async () => {
  // 3. 5 Learning Paths
  const pathsData = [
    {
      title: 'Python Mastery',
      slug: 'python-mastery',
      description: 'Master Python from syntax fundamentals to object-oriented programming, data structures, and script automation.',
      category: 'Programming Languages',
      difficulty: 'Beginner',
      estimatedHours: 25,
      icon: 'Terminal',
      color: 'emerald',
      order: 1,
      modules: [
        { title: 'Python Basics & Syntax', description: 'Variables, print statements, data types, and arithmetic operations.', xp: 50 },
        { title: 'Control Flow & Conditionals', description: 'If, elif, else logic, comparison operators, and boolean algebra.', xp: 50 },
        { title: 'Loops & Iterations', description: 'For loops, while loops, range, break, and continue statements.', xp: 60 },
        { title: 'Functions & Scope', description: 'Defining functions, parameters, return values, and global vs local scope.', xp: 75 },
        { title: 'Lists, Tuples & Sets', description: 'Collection manipulation, list comprehensions, and set operations.', xp: 80 },
        { title: 'Dictionaries & Hash Maps', description: 'Key-value lookups, dictionary methods, and nested data structures.', xp: 80 },
        { title: 'Object-Oriented Programming', description: 'Classes, instances, inheritance, encapsulation, and dunder methods.', xp: 100 },
        { title: 'File Handling & Exceptions', description: 'Reading and writing files safely with try/except blocks.', xp: 90 },
        { title: 'Modules & Virtual Environments', description: 'Pip packages, imports, organizing multi-file projects.', xp: 85 },
        { title: 'Capstone Python Project', description: 'Build a full CLI utility or web scraper with automated testing.', xp: 200 }
      ]
    },
    {
      title: 'Data Structures & Algorithms',
      slug: 'data-structures-algorithms',
      description: 'Ace technical interviews and solve complex problems with structured computer science foundations.',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      estimatedHours: 40,
      icon: 'Cpu',
      color: 'indigo',
      order: 2,
      modules: [
        { title: 'Complexity & Big-O Notation', description: 'Time and space complexity analysis for efficient code.', xp: 50 },
        { title: 'Arrays & Two-Pointers', description: 'Array transformations, sliding windows, and in-place operations.', xp: 80 },
        { title: 'Strings & Hash Tables', description: 'Anagrams, frequency maps, pattern matching, and palindrome checks.', xp: 80 },
        { title: 'Binary Search & Divide/Conquer', description: 'Logarithmic search techniques, upper/lower bounds.', xp: 100 },
        { title: 'Linked Lists Deep Dive', description: 'Singly, doubly, cycle detection, and reversing lists.', xp: 100 },
        { title: 'Stacks & Queues', description: 'LIFO and FIFO applications, monotonic stacks, bracket matching.', xp: 90 },
        { title: 'Recursion & Backtracking', description: 'Permutations, subsets, recursive divide-and-conquer.', xp: 120 },
        { title: 'Binary Trees & Traversals', description: 'DFS (pre/in/post-order) and BFS level order traversal.', xp: 130 },
        { title: 'Binary Search Trees (BST)', description: 'Validation, insertion, deletion, and balancing concepts.', xp: 140 },
        { title: 'Graphs & Shortest Path', description: 'Adjacency lists, BFS, DFS, Dijkstra, and cycle detection.', xp: 200 }
      ]
    },
    {
      title: 'Modern Web Development',
      slug: 'modern-web-development',
      description: 'The complete roadmap to semantic HTML5, modern CSS3, responsive layouts, and interactive JavaScript.',
      category: 'Web Development',
      difficulty: 'Beginner',
      estimatedHours: 30,
      icon: 'Layout',
      color: 'cyan',
      order: 3,
      modules: [
        { title: 'HTML5 Semantic Architecture', description: 'Headings, sections, forms, accessible markup, and SEO tags.', xp: 50 },
        { title: 'Modern CSS3 & Flexbox', description: 'Box model, flex containers, alignment, and modern layouts.', xp: 60 },
        { title: 'CSS Grid & Responsive Design', description: 'Grid template areas, media queries, and mobile-first principles.', xp: 75 },
        { title: 'JavaScript Essentials', description: 'ES6+ syntax, let/const, arrow functions, destructuring.', xp: 80 },
        { title: 'DOM Manipulation & Events', description: 'Selecting elements, adding event listeners, dynamic UI updates.', xp: 90 },
        { title: 'Asynchronous JavaScript & Fetch', description: 'Promises, async/await, and calling REST APIs.', xp: 100 },
        { title: 'Modern Tooling & Git', description: 'Vite, npm, version control, branching, and pull requests.', xp: 75 },
        { title: 'Tailwind CSS Mastery', description: 'Utility-first styling, dark mode, animations, custom themes.', xp: 90 },
        { title: 'Interactive Web App Capstone', description: 'Build and deploy a responsive interactive dashboard.', xp: 200 }
      ]
    },
    {
      title: 'React Frontend Mastery',
      slug: 'react-frontend-mastery',
      description: 'Build enterprise-grade single page applications with React 18, custom hooks, and state management.',
      category: 'Frontend Frameworks',
      difficulty: 'Intermediate',
      estimatedHours: 35,
      icon: 'Atom',
      color: 'violet',
      order: 4,
      modules: [
        { title: 'React 18 Architecture & JSX', description: 'Virtual DOM, component breakdown, props, and conditional rendering.', xp: 60 },
        { title: 'Hooks: useState & useEffect', description: 'Component lifecycle, side effects, and state immutability.', xp: 80 },
        { title: 'Custom Hooks & Code Reuse', description: 'Extracting clean stateful logic into modular reusable hooks.', xp: 100 },
        { title: 'Context API & Global State', description: 'Provider pattern, themes, user auth state, and avoiding prop drilling.', xp: 95 },
        { title: 'React Router 6 & Layouts', description: 'Nested routes, protected authentication routes, dynamic URLs.', xp: 90 },
        { title: 'Performance Optimization', description: 'useMemo, useCallback, React.memo, and code splitting.', xp: 110 },
        { title: 'Forms, Validation & API Query', description: 'Controlled components, form handling, error states, and debouncing.', xp: 100 },
        { title: 'Production React Project', description: 'Full-featured dashboard with charts, modals, and responsive layout.', xp: 250 }
      ]
    },
    {
      title: 'Backend & API Engineering',
      slug: 'backend-api-engineering',
      description: 'Build robust REST APIs, handle database persistence, authentication, security, and cloud deployment.',
      category: 'Backend',
      difficulty: 'Advanced',
      estimatedHours: 35,
      icon: 'Server',
      color: 'rose',
      order: 5,
      modules: [
        { title: 'Node.js Internals & Event Loop', description: 'Asynchronous I/O, Buffer, Streams, and module systems.', xp: 75 },
        { title: 'Express.js Framework Core', description: 'Routing, middleware pipeline, request/response cycles.', xp: 80 },
        { title: 'RESTful API Architecture', description: 'HTTP verbs, status codes, standard JSON payloads, pagination.', xp: 90 },
        { title: 'MongoDB & Mongoose Schemas', description: 'Document models, relations, indexing, and validation.', xp: 100 },
        { title: 'Authentication & JWT Security', description: 'Password hashing with bcrypt, access tokens, refresh flows.', xp: 120 },
        { title: 'Error Handling & Validation', description: 'Centralized error handlers, rate limiting, and sanitization.', xp: 90 },
        { title: 'File Uploads & Cloud Storage', description: 'Multer, streaming uploads, image processing.', xp: 100 },
        { title: 'Full Stack Integration Capstone', description: 'Connect backend APIs to frontend with automated tests.', xp: 250 }
      ]
    }
  ];

  const createdPaths = [];
  for (const p of pathsData) {
    const modules = p.modules;
    delete p.modules;
    const pathDoc = await LearningPath.create(p);
    createdPaths.push(pathDoc);

    for (let i = 0; i < modules.length; i++) {
      const m = modules[i];
      await Module.create({
        pathId: pathDoc._id,
        title: m.title,
        description: m.description,
        order: i + 1,
        xpReward: m.xp,
        isLockedDefault: i > 2,
        topics: [p.title, m.title]
      });
    }
  }

  console.log('âœ… Created 5 Learning Paths and 45 Modules');
};
