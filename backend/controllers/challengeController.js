import { Challenge, ChallengeSubmission, Profile } from '../models/index.js';
import { executeCode } from '../services/codeRunner.js';
import { awardXP, recordDailyActivity } from '../services/gamificationService.js';

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({}).sort({ xpReward: 1 });
    const userSubs = await ChallengeSubmission.find({ userId: req.user._id, status: 'PASSED' });
    const passedSet = new Set(userSubs.map(s => String(s.challengeId)));

    const enriched = challenges.map(c => ({
      ...c,
      isSolved: passedSet.has(String(c._id))
    }));

    res.json({ success: true, challenges: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChallengeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const challenge = await Challenge.findOne({ slug });
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const pastSubmissions = await ChallengeSubmission.find({
      challengeId: challenge._id,
      userId: req.user._id
    }).sort({ createdAt: -1 }).limit(10);

    const visibleTestCases = (challenge.testCases || []).filter(tc => !tc.isHidden);

    res.json({
      success: true,
      challenge: {
        ...challenge,
        testCases: visibleTestCases
      },
      pastSubmissions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const runCode = async (req, res) => {
  try {
    const { language, code, customInput, challengeId } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: 'Code and language are required' });
    }

    let testCases = [];
    if (challengeId) {
      const challenge = await Challenge.findById(challengeId);
      if (challenge) {
        testCases = (challenge.testCases || []).filter(t => !t.isHidden);
      }
    }

    const result = await executeCode(language, code, testCases, customInput);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { language, code } = req.body;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Run against ALL test cases including hidden ones
    const execResult = await executeCode(language, code, challenge.testCases || []);

    const submission = await ChallengeSubmission.create({
      challengeId: challenge._id,
      userId: req.user._id,
      language,
      code,
      status: execResult.status,
      passedTests: execResult.totalPassed || 0,
      totalTests: execResult.totalTests || 0,
      runtimeMs: execResult.averageRuntimeMs || 0
    });

    let xpResult = { awarded: false };

    if (execResult.status === 'PASSED') {
      xpResult = await awardXP(
        req.user._id,
        challenge.xpReward || 100,
        'challenge',
        String(challenge._id),
        `Solved Challenge: ${challenge.title}`
      );

      await Profile.updateOne(
        { userId: req.user._id },
        { $inc: { solvedCount: 1 } }
      );

      await recordDailyActivity(req.user._id, `Solved challenge: ${challenge.title}`);
    }

    res.json({
      success: true,
      submission,
      execResult,
      xpResult
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};