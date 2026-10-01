import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as authCtrl from '../controllers/authController.js';
import * as dashboardCtrl from '../controllers/dashboardController.js';
import * as pathCtrl from '../controllers/pathController.js';
import * as resourceCtrl from '../controllers/resourceController.js';
import * as taskCtrl from '../controllers/taskController.js';
import * as challengeCtrl from '../controllers/challengeController.js';
import * as quizCtrl from '../controllers/quizController.js';
import * as gamificationCtrl from '../controllers/gamificationController.js';
import * as adminCtrl from '../controllers/adminController.js';
import { Notification, Announcement } from '../models/index.js';

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', protect, authCtrl.getMe);
router.put('/auth/profile', protect, authCtrl.updateProfile);
router.post('/auth/forgot-password', authCtrl.forgotPassword);

// --- Student Dashboard Routes ---
router.get('/dashboard', protect, dashboardCtrl.getStudentDashboard);

// --- Learning Paths Routes ---
router.get('/paths', protect, pathCtrl.getAllPaths);
router.get('/paths/:slug', protect, pathCtrl.getPathBySlug);
router.post('/paths/modules/:moduleId/complete', protect, pathCtrl.completeModule);

// --- Resources Routes ---
router.get('/resources', protect, resourceCtrl.getAllResources);
router.post('/resources/:id/bookmark', protect, resourceCtrl.toggleBookmark);
router.post('/resources/:id/complete', protect, resourceCtrl.completeResource);

// --- Tasks Routes ---
router.get('/tasks', protect, taskCtrl.getAllTasks);
router.put('/tasks/:id/status', protect, taskCtrl.updateTaskStatus);
router.post('/tasks/:id/submit', protect, taskCtrl.submitTask);

// --- Challenges & Code Execution Routes ---
router.get('/challenges', protect, challengeCtrl.getAllChallenges);
router.get('/challenges/:slug', protect, challengeCtrl.getChallengeBySlug);
router.post('/challenges/run', protect, challengeCtrl.runCode);
router.post('/challenges/:id/submit', protect, challengeCtrl.submitChallenge);

// --- Quizzes Routes ---
router.get('/quizzes', protect, quizCtrl.getAllQuizzes);
router.get('/quizzes/:id', protect, quizCtrl.getQuizById);
router.post('/quizzes/:id/submit', protect, quizCtrl.submitQuiz);

// --- Gamification Routes ---
router.get('/gamification/leaderboard', protect, gamificationCtrl.getLeaderboard);
router.get('/gamification/achievements', protect, gamificationCtrl.getAchievements);
router.get('/gamification/streak', protect, gamificationCtrl.getStreakHistory);
router.get('/gamification/xp-transactions', protect, gamificationCtrl.getXPTransactions);

// --- Notifications & Announcements Routes ---
router.get('/notifications', protect, async (req, res) => {
  try {
    const list = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(25);
    const unreadCount = list.filter(n => !n.isRead).length;
    res.json({ success: true, notifications: list, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/:id/read', protect, async (req, res) => {
  try {
    await Notification.updateOne({ _id: req.params.id, userId: req.user._id }, { $set: { isRead: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/notifications/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { $set: { isRead: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/announcements', protect, async (req, res) => {
  try {
    const list = await Announcement.find({}).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, announcements: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- Admin Panel Routes ---
router.get('/admin/stats', protect, adminOnly, adminCtrl.getAdminStats);
router.get('/admin/students', protect, adminOnly, adminCtrl.getStudents);
router.post('/admin/students/:studentId/xp', protect, adminOnly, adminCtrl.adjustStudentXP);
router.post('/admin/resources', protect, adminOnly, upload.single('file'), adminCtrl.createResource);
router.post('/admin/tasks', protect, adminOnly, adminCtrl.createTask);
router.post('/admin/announcements', protect, adminOnly, adminCtrl.createAnnouncement);

export default router;