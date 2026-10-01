import {
  User, Profile, Resource, Task, Challenge, Quiz, LearningPath, Announcement, TaskSubmission, XPTransaction
} from '../models/index.js';
import { awardXP } from '../services/gamificationService.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalResources = await Resource.countDocuments({});
    const totalTasks = await Task.countDocuments({});
    const totalChallenges = await Challenge.countDocuments({});
    const totalQuizzes = await Quiz.countDocuments({});
    const totalPaths = await LearningPath.countDocuments({});
    const completedTasks = await TaskSubmission.countDocuments({ status: 'COMPLETED' });

    const profiles = await Profile.find({});
    const totalXP = profiles.reduce((sum, p) => sum + (p.currentXP || 0), 0);
    const activeStudents = profiles.filter(p => (p.streakCount || 0) > 0 || (p.currentXP || 0) > 100).length;

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        totalResources,
        totalTasks,
        totalChallenges,
        totalQuizzes,
        totalPaths,
        completedTasks,
        totalXP
      },
      chartData: {
        xpDistribution: [
          { level: 'Lvl 1-2', count: profiles.filter(p => (p.level || 1) <= 2).length },
          { level: 'Lvl 3-5', count: profiles.filter(p => p.level >= 3 && p.level <= 5).length },
          { level: 'Lvl 6-8', count: profiles.filter(p => p.level >= 6 && p.level <= 8).length },
          { level: 'Lvl 9+', count: profiles.filter(p => (p.level || 1) >= 9).length }
        ],
        recentActivity: [
          { day: 'Mon', xp: 2400, submissions: 18 },
          { day: 'Tue', xp: 3800, submissions: 27 },
          { day: 'Wed', xp: 3100, submissions: 22 },
          { day: 'Thu', xp: 4500, submissions: 35 },
          { day: 'Fri', xp: 5200, submissions: 42 },
          { day: 'Sat', xp: 6100, submissions: 48 },
          { day: 'Sun', xp: 4900, submissions: 39 }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    const enriched = [];

    for (const s of students) {
      const profile = await Profile.findOne({ userId: s._id }) || {};
      enriched.push({
        _id: s._id,
        name: s.name,
        email: s.email,
        avatar: s.avatar,
        createdAt: s.createdAt,
        level: profile.level || 1,
        currentXP: profile.currentXP || 0,
        streakCount: profile.streakCount || 0,
        solvedCount: profile.solvedCount || 0,
        tasksCompletedCount: profile.tasksCompletedCount || 0
      });
    }

    res.json({ success: true, students: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const adjustStudentXP = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { amount, reason } = req.body;

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount === 0) {
      return res.status(400).json({ success: false, message: 'Invalid XP amount' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const result = await awardXP(
      studentId,
      numAmount,
      'admin',
      'admin_adjustment_' + Date.now(),
      reason || 'Administrative XP adjustment by Instructor'
    );

    res.json({
      success: true,
      message: `Successfully adjusted ${numAmount} XP for ${student.name}`,
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createResource = async (req, res) => {
  try {
    const { title, description, category, topic, difficulty, resourceType, url, tags, xpReward, duration } = req.body;
    let filePath = '';
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }

    const resource = await Resource.create({
      title,
      description,
      category: category || 'General',
      topic: topic || 'Programming',
      difficulty: difficulty || 'Beginner',
      resourceType: resourceType || 'article',
      url: url || '',
      filePath,
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags || [],
      xpReward: parseInt(xpReward, 10) || 25,
      duration: duration || '15 min',
      isPublished: true
    });

    res.status(201).json({ success: true, resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, instructions, difficulty, category, xpReward, deadline, submissionType } = req.body;
    const task = await Task.create({
      title,
      description,
      instructions,
      difficulty: difficulty || 'Easy',
      category: category || 'General',
      xpReward: parseInt(xpReward, 10) || 50,
      deadline: deadline || 'Flexible',
      submissionType: submissionType || 'code'
    });
    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type, xpReward } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      type: type || 'announcement',
      xpReward: parseInt(xpReward, 10) || 0,
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, announcement });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};