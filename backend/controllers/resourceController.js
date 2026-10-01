import { Resource, Bookmark, XPTransaction } from '../models/index.js';
import { awardXP, recordDailyActivity } from '../services/gamificationService.js';

export const getAllResources = async (req, res) => {
  try {
    const { type, topic, difficulty, search } = req.query;
    let filter = { isPublished: true };

    if (type && type !== 'all') filter.resourceType = type;
    if (topic && topic !== 'all') filter.topic = topic;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

    let resources = await Resource.find(filter);

    if (search) {
      const q = search.toLowerCase();
      resources = resources.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q))) ||
        r.topic.toLowerCase().includes(q)
      );
    }

    const userBookmarks = await Bookmark.find({ userId: req.user._id });
    const bookmarkedSet = new Set(userBookmarks.map(b => String(b.resourceId)));

    const enriched = resources.map(r => ({
      ...r,
      isBookmarked: bookmarkedSet.has(String(r._id))
    }));

    res.json({ success: true, resources: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Bookmark.findOne({ userId: req.user._id, resourceId: id });

    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      res.json({ success: true, bookmarked: false, message: 'Bookmark removed' });
    } else {
      await Bookmark.create({ userId: req.user._id, resourceId: id });
      res.json({ success: true, bookmarked: true, message: 'Resource bookmarked' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const completeResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resDoc = await Resource.findById(id);
    if (!resDoc) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const xpResult = await awardXP(
      req.user._id,
      resDoc.xpReward || 25,
      'resource',
      String(resDoc._id),
      `Read resource: ${resDoc.title}`
    );

    await recordDailyActivity(req.user._id, `Viewed resource: ${resDoc.title}`);

    res.json({
      success: true,
      ...xpResult,
      message: xpResult.alreadyClaimed ? 'Resource already completed' : 'Resource completed! XP awarded'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};