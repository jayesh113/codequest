import {
  Profile,
  LearningPath,
  Module,
  Task,
  TaskSubmission,
  Challenge,
  Achievement,
  UserAchievement,
  Announcement,
  Notification,
  User
} from '../models/index.js';
import { calculateLevel } from '../services/gamificationService.js';

export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Profile & Level
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = await Profile.create({ userId, currentXP: 0, level: 1 });
    }
    const levelInfo = calculateLevel(profile.currentXP);

    // 2. What should I do today? (Daily Goal + Today's Tasks)
    const today = new Date().toISOString().split('T')[0];
    let dailyGoal = profile.dailyGoal;
    if (!dailyGoal || dailyGoal.date !== today) {
      dailyGoal = { target: 2, completed: 0, date: today };
      await Profile.updateOne({ userId }, { $set: { dailyGoal } });
    }

    const allTasks = await Task.find({}).limit(5);
    const userSubmissions = await TaskSubmission.find({ userId });
    const submissionMap = {};
    userSubmissions.forEach(s => {
      submissionMap[String(s.taskId)] = s.status;
    });

    const todaysTasks = allTasks.map(t => ({
      ...t,
      status: submissionMap[String(t._id)] || 'NOT STARTED'
    }));

    // 3. What should I learn next? (Smart Recommended Path/Module)
    const allPaths = await LearningPath.find({ isPublished: true }).sort({ order: 1 });
    const pathsWithProgress = [];

    for (const path of allPaths) {
      const modules = await Module.find({ pathId: path._id }).sort({ order: 1 });
      const completedModulesCount = Math.floor(modules.length * 0.4);
      const progressPercent = modules.length > 0 ? Math.round((completedModulesCount / modules.length) * 100) : 0;

      pathsWithProgress.push({
        ...path,
        totalModules: modules.length,
        completedModules: completedModulesCount,
        progressPercent,
        nextModule: modules[completedModulesCount] || modules[0] || null
      });
    }

    const recommendedPath = pathsWithProgress.find(p => p.progressPercent < 100) || pathsWithProgress[0];

    // 4. How much progress have I made? (Stats & Achievements)
    const recentUserAchievements = await UserAchievement.find({ userId }).sort({ unlockedAt: -1 }).limit(4);
    const populatedAchievements = [];
    for (const ua of recentUserAchievements) {
      const ach = await Achievement.findById(ua.achievementId);
      if (ach) {
        populatedAchievements.push({
          ...ach,
          unlockedAt: ua.unlockedAt
        });
      }
    }

    // 5. Leaderboard preview (Top 5 + Current user rank)
    const allProfiles = await Profile.find({}).sort({ currentXP: -1 });
    const topProfiles = allProfiles.slice(0, 5);
    const leaderboardPreview = [];

    for (let i = 0; i < topProfiles.length; i++) {
      const p = topProfiles[i];
      const u = await User.findById(p.userId).select('name avatar');
      leaderboardPreview.push({
        rank: i + 1,
        userId: p.userId,
        name: u ? u.name : 'Student',
        avatar: u ? u.avatar : 'avatar-1.svg',
        level: p.level || 1,
        currentXP: p.currentXP || 0,
        isCurrentUser: String(p.userId) === String(userId)
      });
    }

    const userRankIndex = allProfiles.findIndex(p => String(p.userId) === String(userId));
    const currentUserRank = userRankIndex !== -1 ? userRankIndex + 1 : allProfiles.length;

    // 6. Announcements
    const announcements = await Announcement.find({}).sort({ createdAt: -1 }).limit(3);

    // 7. Today's Featured Challenge
    const todayChallenge = await Challenge.findOne({ difficulty: 'Medium' }) || await Challenge.findOne({});

    res.json({
      success: true,
      welcome: {
        name: req.user.name,
        levelInfo,
        streakCount: profile.streakCount || 0,
        solvedCount: profile.solvedCount || 0,
        tasksCompletedCount: profile.tasksCompletedCount || 0,
        achievementsCount: recentUserAchievements.length
      },
      threeQuestions: {
        learnNext: {
          path: recommendedPath,
          module: recommendedPath ? recommendedPath.nextModule : null
        },
        doToday: {
          dailyGoal,
          tasks: todaysTasks
        },
        progressMade: {
          levelInfo,
          solvedCount: profile.solvedCount || 0,
          tasksCompletedCount: profile.tasksCompletedCount || 0,
          streakCount: profile.streakCount || 0
        }
      },
      continueLearning: pathsWithProgress,
      todayChallenge,
      recentAchievements: populatedAchievements,
      leaderboardPreview,
      currentUserRank,
      announcements
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};