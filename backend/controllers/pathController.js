import { LearningPath, Module, Resource, Quiz, XPTransaction } from '../models/index.js';
import { awardXP, recordDailyActivity } from '../services/gamificationService.js';

export const getAllPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find({ isPublished: true }).sort({ order: 1 });
    const enriched = [];

    for (const p of paths) {
      const modules = await Module.find({ pathId: p._id }).sort({ order: 1 });
      const quizzes = await Quiz.find({ pathId: p._id });
      enriched.push({
        ...p,
        moduleCount: modules.length,
        quizCount: quizzes.length,
        modules
      });
    }

    res.json({ success: true, paths: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getPathBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const path = await LearningPath.findOne({ slug });
    if (!path) {
      return res.status(404).json({ success: false, message: 'Learning Path not found' });
    }

    const modules = await Module.find({ pathId: path._id }).sort({ order: 1 });
    const enrichedModules = [];

    for (const m of modules) {
      const resources = await Resource.find({ moduleId: m._id });
      const quiz = await Quiz.findOne({ moduleId: m._id });
      const completedTx = await XPTransaction.findOne({
        userId: req.user._id,
        source: 'module',
        referenceId: String(m._id)
      });

      enrichedModules.push({
        ...m,
        resources,
        quiz,
        isCompleted: !!completedTx
      });
    }

    res.json({
      success: true,
      path: {
        ...path,
        modules: enrichedModules
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const completeModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const mod = await Module.findById(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    const result = await awardXP(
      req.user._id,
      mod.xpReward || 50,
      'module',
      String(mod._id),
      `Completed module: ${mod.title}`
    );

    await recordDailyActivity(req.user._id, `Completed module: ${mod.title}`);

    res.json({
      success: true,
      ...result,
      message: result.alreadyClaimed ? 'Module already completed previously' : 'Module completed! XP awarded.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};