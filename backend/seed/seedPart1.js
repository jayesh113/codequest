import bcrypt from 'bcryptjs';
import {
  User, Profile, LearningPath, Module, Resource, Task, Challenge, Quiz, QuizQuestion, Achievement, Announcement, Notification, XPTransaction
} from '../models/index.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async () => {
  console.log('ðŸŒ± Starting CodeQuest database seeding...');

  // Check if already seeded
  const userCount = await User.countDocuments({});
  if (userCount > 5) {
    console.log('Database already has data. Skipping seed.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const commonPassword = await bcrypt.hash('password123', salt);

  // 1. Admin
  const admin = await User.create({
    name: 'Prof. Marcus Vance',
    email: 'admin@codequest.dev',
    passwordHash: commonPassword,
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
    interests: ['Systems', 'Algorithms', 'Compilers', 'Education']
  });

  await Profile.create({
    userId: admin._id,
    bio: 'Lead Instructor and CodeQuest Community Architect. Ask me about algorithms and system design!',
    level: 15,
    currentXP: 12500,
    streakCount: 45,
    solvedCount: 120,
    tasksCompletedCount: 85
  });

  // 2. 10 Sample Students
  const studentsData = [
    { name: 'Alex River', email: 'student@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex', xp: 720, level: 4, streak: 12, solved: 18, tasks: 14, bio: 'Aspiring Full Stack Engineer. Love Python, React, and solving daily challenges.' },
    { name: 'Elena Rostova', email: 'elena@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena', xp: 2150, level: 7, streak: 28, solved: 42, tasks: 30, bio: 'Algorithms enthusiast & competitive programmer. Working through Graph Theory.' },
    { name: 'Devon Chen', email: 'devon@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Devon', xp: 1840, level: 7, streak: 19, solved: 36, tasks: 24, bio: 'Building distributed backends with Go and Node.js.' },
    { name: 'Maya Patel', email: 'maya@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maya', xp: 1420, level: 6, streak: 14, solved: 29, tasks: 22, bio: 'Frontend UI/UX fanatic. Making pixel-perfect animations.' },
    { name: 'Lucas Silva', email: 'lucas@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas', xp: 1100, level: 5, streak: 9, solved: 21, tasks: 16, bio: 'Data Science & Machine Learning learner. Python all day.' },
    { name: 'Sophia Nguyen', email: 'sophia@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sophia', xp: 950, level: 5, streak: 8, solved: 19, tasks: 15, bio: 'First year CS major. Grinding arrays and strings.' },
    { name: 'Aiden Kim', email: 'aiden@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aiden', xp: 620, level: 4, streak: 6, solved: 14, tasks: 11, bio: 'Open source contributor in training. Learning React & TypeScript.' },
    { name: 'Zara Ahmed', email: 'zara@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zara', xp: 480, level: 3, streak: 5, solved: 10, tasks: 9, bio: 'Web design hobbyist turned coder. Loving CSS grid & JS.' },
    { name: 'Liam O\'Connor', email: 'liam@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Liam', xp: 320, level: 3, streak: 4, solved: 7, tasks: 7, bio: 'Curious explorer. Building automated scripts.' },
    { name: 'Chloe Dupont', email: 'chloe@codequest.dev', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Chloe', xp: 180, level: 2, streak: 3, solved: 4, tasks: 5, bio: 'Started coding 2 weeks ago! Having fun on CodeQuest.' }
  ];

  for (const s of studentsData) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      passwordHash: commonPassword,
      role: 'student',
      avatar: s.avatar,
      interests: ['Python', 'DSA', 'Web Dev', 'React']
    });

    await Profile.create({
      userId: user._id,
      bio: s.bio,
      level: s.level,
      currentXP: s.xp,
      streakCount: s.streak,
      solvedCount: s.solved,
      tasksCompletedCount: s.tasks,
      dailyGoal: { target: 2, completed: 1, date: new Date().toISOString().split('T')[0] }
    });

    // Sample XP transaction
    await XPTransaction.create({
      userId: user._id,
      amount: s.xp,
      source: 'task',
      description: 'Initial onboarding & community challenge completion'
    });
  }

  console.log('âœ… Created 1 admin and 10 students');
};
