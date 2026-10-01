import { Profile, User, Achievement, UserAchievement, XPTransaction, Streak } from '../models/index.js';

export const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    const profiles = await Profile.find({}).sort({ currentXP: -1 }).limit(50);
    const leaderboard = [];

    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      const u = await User.findById(p.userId).select('name avatar');
      if (u) {
        let displayXP = p.currentXP || 0;
        if (period === 'weekly') displayXP = Math.round(displayXP * 0.25);
        if (period === 'monthly') displayXP = Math.round(displayXP * 0.65);

        leaderboard.push({
          rank: i + 1,
          userId: p.userId,
          name: u.name,
          avatar: u.avatar || 'avatar-1.svg',
          level: p.level || 1,
          currentXP: displayXP,
          streakCount: p.streakCount || 0,
          isCurrentUser: String(p.userId) === String(req.user._id)
        });
      }
    }

    leaderboard.sort((a, b) => b.currentXP - a.currentXP);
    leaderboard.forEach((item, idx) => { item.rank = idx + 1; });

    const currentUserEntry = leaderboard.find(l => l.isCurrentUser) || null;

    res.json({
      success: true,
      period,
      leaderboard,
      currentUserEntry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const allAchievements = await Achievement.find({});
    const userUnlocked = await UserAchievement.find({ userId: req.user._id });
    const profile = await Profile.findOne({ userId: req.user._id }) || { currentXP: 0, streakCount: 0, solvedCount: 0, tasksCompletedCount: 0 };

    const unlockedMap = {};
    userUnlocked.forEach(u => { unlockedMap[String(u.achievementId)] = u.unlockedAt; });

    const enriched = allAchievements.map(a => {
      const isUnlocked = !!unlockedMap[String(a._id)];
      let progress = 0;
      const target = a.criteriaThreshold || 1;

      switch (a.criteriaType) {
        case 'first_step':
          progress = ((profile.tasksCompletedCount || 0) > 0 || (profile.solvedCount || 0) > 0) ? 1 : 0;
          break;
        case 'tasks_completed':
          progress = Math.min(target, profile.tasksCompletedCount || 0);
          break;
        case 'problems_solved':
          progress = Math.min(target, profile.solvedCount || 0);
          break;
        case 'streak_days':
          progress = Math.min(target, profile.streakCount || 0);
          break;
        case 'total_xp':
          progress = Math.min(target, profile.currentXP || 0);
          break;
        default:
          progress = isUnlocked ? target : 0;
      }

      return {
        ...a,
        isUnlocked,
        unlockedAt: unlockedMap[String(a._id)] || null,
        progress,
        target,
        progressPercent: Math.min(100, Math.round((progress / target) * 100))
      };
    });

    res.json({ success: true, achievements: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStreakHistory = async (req, res) => {
  try {
    const streaks = await Streak.find({ userId: req.user._id }).sort({ date: -1 }).limit(60);
    const profile = await Profile.findOne({ userId: req.user._id });

    res.json({
      success: true,
      currentStreak: profile ? profile.streakCount : 0,
      streakHistory: streaks
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getXPTransactions = async (req, res) => {
  try {
    const transactions = await XPTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};