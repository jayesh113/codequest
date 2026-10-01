import mongoose from 'mongoose';
import { getModel } from '../config/db.js';

const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String, default: 'avatar-1.svg' },
  interests: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Profile Schema
const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: 'Learning and building awesome things with CodeQuest!' },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  level: { type: Number, default: 1 },
  currentXP: { type: Number, default: 0 },
  streakCount: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: '' },
  solvedCount: { type: Number, default: 0 },
  tasksCompletedCount: { type: Number, default: 0 },
  dailyGoal: {
    target: { type: Number, default: 2 },
    completed: { type: Number, default: 0 },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
  }
}, { timestamps: true });

// LearningPath Schema
const learningPathSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  estimatedHours: { type: Number, default: 20 },
  icon: { type: String, default: 'Terminal' },
  color: { type: String, default: 'indigo' },
  order: { type: Number, default: 1 },
  isPublished: { type: Boolean, default: true }
});

// Module Schema
const moduleSchema = new Schema({
  pathId: { type: Schema.Types.ObjectId, ref: 'LearningPath', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 1 },
  xpReward: { type: Number, default: 50 },
  isLockedDefault: { type: Boolean, default: false },
  topics: [{ type: String }]
});

// Resource Schema
const resourceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  resourceType: {
    type: String,
    enum: ['pdf', 'video', 'article', 'website', 'code', 'notes', 'quiz', 'practice'],
    required: true
  },
  url: { type: String, default: '' },
  filePath: { type: String, default: '' },
  tags: [{ type: String }],
  pathId: { type: Schema.Types.ObjectId, ref: 'LearningPath' },
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
  xpReward: { type: Number, default: 25 },
  duration: { type: String, default: '15 min' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

// Task Schema
const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructions: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  category: { type: String, required: true },
  xpReward: { type: Number, default: 50 },
  deadline: { type: String, default: 'Flexible' },
  attachedResources: [{ type: String }],
  submissionType: { type: String, enum: ['code', 'text', 'link'], default: 'code' }
}, { timestamps: true });

// TaskSubmission Schema
const taskSubmissionSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['NOT STARTED', 'IN PROGRESS', 'SUBMITTED', 'COMPLETED'],
    default: 'IN PROGRESS'
  },
  content: { type: String, default: '' },
  xpAwarded: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

// Challenge Schema
const challengeSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  category: { type: String, required: true },
  xpReward: { type: Number, default: 100 },
  description: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: [{ type: String }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  starterCode: {
    python: { type: String, default: '' },
    javascript: { type: String, default: '' },
    c: { type: String, default: '' },
    cpp: { type: String, default: '' }
  },
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// ChallengeSubmission Schema
const challengeSubmissionSchema = new Schema({
  challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String, enum: ['PASSED', 'FAILED', 'ERROR'], required: true },
  passedTests: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  runtimeMs: { type: Number, default: 0 },
  xpAwarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Quiz Schema
const quizSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  pathId: { type: Schema.Types.ObjectId, ref: 'LearningPath' },
  moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
  timeLimitMinutes: { type: Number, default: 10 },
  xpReward: { type: Number, default: 80 },
  passingScore: { type: Number, default: 70 }
});

// QuizQuestion Schema
const quizQuestionSchema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: '' },
  points: { type: Number, default: 10 }
});

// Achievement Schema
const achievementSchema = new Schema({
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Trophy' },
  category: { type: String, default: 'General' },
  xpReward: { type: Number, default: 100 },
  criteriaType: {
    type: String,
    enum: ['tasks_completed', 'problems_solved', 'streak_days', 'total_xp', 'path_completed', 'first_step'],
    required: true
  },
  criteriaThreshold: { type: Number, default: 1 }
});

// UserAchievement Schema
const userAchievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  achievementId: { type: Schema.Types.ObjectId, ref: 'Achievement', required: true },
  unlockedAt: { type: Date, default: Date.now }
});

// XPTransaction Schema
const xpTransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  source: {
    type: String,
    enum: ['task', 'quiz', 'challenge', 'module', 'streak', 'admin', 'achievement', 'resource'],
    required: true
  },
  referenceId: { type: String, default: '' },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Streak Schema
const streakSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  activityCount: { type: Number, default: 1 },
  activitiesCompleted: [{ type: String }]
});

// Announcement Schema
const announcementSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['challenge', 'announcement', 'update', 'event'], default: 'announcement' },
  xpReward: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Notification Schema
const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['task', 'xp', 'level', 'achievement', 'announcement', 'challenge', 'resource'],
    default: 'announcement'
  },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Bookmark Schema
const bookmarkSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Mongoose models if compiling with native driver
const safeModel = (name, schema) => {
  let mModel = null;
  try {
    mModel = mongoose.model(name, schema);
  } catch (e) {
    mModel = mongoose.models[name];
  }
  return getModel(name, mModel);
};

export const User = safeModel('User', userSchema);
export const Profile = safeModel('Profile', profileSchema);
export const LearningPath = safeModel('LearningPath', learningPathSchema);
export const Module = safeModel('Module', moduleSchema);
export const Resource = safeModel('Resource', resourceSchema);
export const Task = safeModel('Task', taskSchema);
export const TaskSubmission = safeModel('TaskSubmission', taskSubmissionSchema);
export const Challenge = safeModel('Challenge', challengeSchema);
export const ChallengeSubmission = safeModel('ChallengeSubmission', challengeSubmissionSchema);
export const Quiz = safeModel('Quiz', quizSchema);
export const QuizQuestion = safeModel('QuizQuestion', quizQuestionSchema);
export const Achievement = safeModel('Achievement', achievementSchema);
export const UserAchievement = safeModel('UserAchievement', userAchievementSchema);
export const XPTransaction = safeModel('XPTransaction', xpTransactionSchema);
export const Streak = safeModel('Streak', streakSchema);
export const Announcement = safeModel('Announcement', announcementSchema);
export const Notification = safeModel('Notification', notificationSchema);
export const Bookmark = safeModel('Bookmark', bookmarkSchema);