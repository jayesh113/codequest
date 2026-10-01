import { Profile, XPTransaction, UserAchievement, Achievement, Streak, Notification } from '../models/index.js';

// Level thresholds progression
export const LEVEL_TABLE = [
  { level: 1, xpNeeded: 0 },
  { level: 2, xpNeeded: 100 },
  { level: 3, xpNeeded: 250 },
  { level: 4, xpNeeded: 500 },
  { level: 5, xpNeeded: 800 },
  { level: 6, xpNeeded: 1200 },
  { level: 7, xpNeeded: 1700 },
  { level: 8, xpNeeded: 2300 },
  { level: 9, xpNeeded: 3000 },
  { level: 10, xpNeeded: 3800 },
  { level: 11, xpNeeded: 4700 },
  { level: 12, xpNeeded: 5700 },
  { level: 13, xpNeeded: 6800 },
  { level: 14, xpNeeded: 8000 },
  { level: 15, xpNeeded: 9500 }
];

export const calculateLevel = (totalXP) => {
  let currentLevel = 1;
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_TABLE[i].xpNeeded) {
      currentLevel = LEVEL_TABLE[i].level;
      break;
    }
  }

  const currentLevelInfo = LEVEL_TABLE.find(l => l.level === currentLevel) || LEVEL_TABLE[0];
  const nextLevelInfo = LEVEL_TABLE.find(l => l.level === currentLevel + 1) || {
    level: currentLevel + 1,
    xpNeeded: currentLevelInfo.xpNeeded + 1500
  };

  const xpIntoCurrentLevel = totalXP - currentLevelInfo.xpNeeded;
  const xpSpan = nextLevelInfo.xpNeeded - currentLevelInfo.xpNeeded;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpIntoCurrentLevel / xpSpan) * 100)));

  return {
    level: currentLevel,
    currentXP: totalXP,
    xpForCurrentLevel: currentLevelInfo.xpNeeded,
    xpForNextLevel: nextLevelInfo.xpNeeded,
    xpNeededForNext: Math.max(0, nextLevelInfo.xpNeeded - totalXP),
    progressPercent
  };
};

export const awardXP = async (userId, amount, source, referenceId = '', description = '') => {
  if (amount <= 0) return { awarded: false, message: 'Invalid XP amount' };

  // Anti-farming check: ensure user hasn't already earned XP for this specific resource/task/module
  if (referenceId && ['task', 'module', 'resource', 'quiz', 'challenge'].includes(source)) {
    const existing = await XPTransaction.findOne({
      userId,
      source,
      referenceId: String(referenceId)
    });
    if (existing) {
      return {
        awarded: false,
        alreadyClaimed: true,
        message: 'XP for this activity was already claimed previously.'
      };
    }
  }

  // Create XP Transaction
  await XPTransaction.create({
    userId,
    amount,
    source,
    referenceId: String(referenceId),
    description: description || `Earned ${amount} XP from ${source}`
  });

  // Fetch or create profile
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = await Profile.create({ userId, currentXP: 0, level: 1 });
  }

  const oldLevel = profile.level || 1;
  const newXP = (profile.currentXP || 0) + amount;
  const levelInfo = calculateLevel(newXP);

  // Update profile
  await Profile.updateOne(
    { userId },
    {
      $set: {
        currentXP: newXP,
        level: levelInfo.level
      }
    }
  );

  const leveledUp = levelInfo.level > oldLevel;

  // If leveled up, trigger notification
  if (leveledUp) {
    await Notification.create({
      userId,
      title: '🎉 Level Up!',
      message: `Congratulations! You reached Level ${levelInfo.level}! Keep coding and leveling up!`,
      type: 'level'
    });
  }

  // Create XP Notification
  await Notification.create({
    userId,
    title: `+${amount} XP Earned!`,
    message: description || `You earned ${amount} XP from ${source}.`,
    type: 'xp'
  });

  // Check achievements after XP increment
  const unlockedBadges = await checkAchievements(userId);

  return {
    awarded: true,
    amount,
    newTotalXP: newXP,
    oldLevel,
    newLevel: levelInfo.level,
    leveledUp,
    levelInfo,
    unlockedBadges
  };
};

export const recordDailyActivity = async (userId, activityDescription = 'Task activity') => {
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streakEntry = await Streak.findOne({ userId, date: today });
  let isFirstToday = false;

  if (!streakEntry) {
    isFirstToday = true;
    streakEntry = await Streak.create({
      userId,
      date: today,
      activityCount: 1,
      activitiesCompleted: [activityDescription]
    });
  } else {
    await Streak.updateOne(
      { _id: streakEntry._id },
      {
        $inc: { activityCount: 1 },
        $push: { activitiesCompleted: activityDescription }
      }
    );
  }

  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = await Profile.create({ userId, streakCount: 0 });
  }

  let newStreak = profile.streakCount || 0;
  let streakBonusXP = 0;

  if (isFirstToday) {
    const yesterdayStreak = await Streak.findOne({ userId, date: yesterdayDate });
    if (yesterdayStreak || newStreak === 0) {
      newStreak += 1;
    } else {
      newStreak = 1; // reset streak if missed a day
    }

    // Streak Milestone Rewards:
    // 3 days: +25 XP
    // 7 days: +100 XP
    // 14 days: +250 XP
    // 30 days: +500 XP
    if (newStreak === 3) streakBonusXP = 25;
    else if (newStreak === 7) streakBonusXP = 100;
    else if (newStreak === 14) streakBonusXP = 250;
    else if (newStreak === 30) streakBonusXP = 500;

    await Profile.updateOne(
      { userId },
      {
        $set: {
          streakCount: newStreak,
          lastActiveDate: today
        }
      }
    );

    if (streakBonusXP > 0) {
      await awardXP(
        userId,
        streakBonusXP,
        'streak',
        `streak_${newStreak}_${today}`,
        `🔥 ${newStreak}-Day Streak Milestone Bonus!`
      );
    }
  }

  // Check achievements (e.g. Consistent Coder 7 days)
  await checkAchievements(userId);

  return {
    streakCount: newStreak,
    isFirstToday,
    streakBonusXP
  };
};

export const checkAchievements = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) return [];

  const allAchievements = await Achievement.find({});
  const userUnlocked = await UserAchievement.find({ userId });
  const unlockedIds = new Set(userUnlocked.map(ua => String(ua.achievementId)));

  const newlyUnlocked = [];

  for (const ach of allAchievements) {
    if (unlockedIds.has(String(ach._id))) continue;

    let qualifies = false;
    const threshold = ach.criteriaThreshold;

    switch (ach.criteriaType) {
      case 'first_step':
        qualifies = (profile.tasksCompletedCount || 0) >= 1 || (profile.solvedCount || 0) >= 1;
        break;
      case 'tasks_completed':
        qualifies = (profile.tasksCompletedCount || 0) >= threshold;
        break;
      case 'problems_solved':
        qualifies = (profile.solvedCount || 0) >= threshold;
        break;
      case 'streak_days':
        qualifies = (profile.streakCount || 0) >= threshold;
        break;
      case 'total_xp':
        qualifies = (profile.currentXP || 0) >= threshold;
        break;
      case 'path_completed':
        qualifies = (profile.pathsCompletedCount || 0) >= threshold;
        break;
      default:
        break;
    }

    if (qualifies) {
      await UserAchievement.create({
        userId,
        achievementId: ach._id,
        unlockedAt: new Date()
      });

      if (ach.xpReward > 0) {
        await awardXP(
          userId,
          ach.xpReward,
          'achievement',
          String(ach._id),
          `🏆 Unlocked Achievement: ${ach.title}`
        );
      }

      await Notification.create({
        userId,
        title: `🏆 Achievement Unlocked: ${ach.title}!`,
        message: `${ach.description} (+${ach.xpReward} XP)`,
        type: 'achievement'
      });

      newlyUnlocked.push(ach);
    }
  }

  return newlyUnlocked;
};