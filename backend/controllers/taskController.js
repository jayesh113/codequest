import { Task, TaskSubmission, Profile } from '../models/index.js';
import { awardXP, recordDailyActivity } from '../services/gamificationService.js';

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    const submissions = await TaskSubmission.find({ userId: req.user._id });
    const subMap = {};
    submissions.forEach(s => { subMap[String(s.taskId)] = s; });

    const enriched = tasks.map(t => {
      const sub = subMap[String(t._id)];
      return {
        ...t,
        status: sub ? sub.status : 'NOT STARTED',
        submission: sub || null
      };
    });

    res.json({ success: true, tasks: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, content } = req.body;

    let sub = await TaskSubmission.findOne({ taskId: id, userId: req.user._id });
    if (!sub) {
      sub = await TaskSubmission.create({
        taskId: id,
        userId: req.user._id,
        status: status || 'IN PROGRESS',
        content: content || ''
      });
    } else {
      await TaskSubmission.updateOne(
        { _id: sub._id },
        {
          $set: {
            status: status || sub.status,
            ...(content !== undefined && { content })
          }
        }
      );
    }

    res.json({ success: true, status, message: `Task status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    let sub = await TaskSubmission.findOne({ taskId: id, userId: req.user._id });
    if (!sub) {
      sub = await TaskSubmission.create({
        taskId: id,
        userId: req.user._id,
        status: 'COMPLETED',
        content: content || 'Completed task submission',
        completedAt: new Date(),
        xpAwarded: true
      });
    } else {
      await TaskSubmission.updateOne(
        { _id: sub._id },
        {
          $set: {
            status: 'COMPLETED',
            content: content || sub.content,
            completedAt: new Date(),
            xpAwarded: true
          }
        }
      );
    }

    // Award XP
    const xpResult = await awardXP(
      req.user._id,
      task.xpReward || 50,
      'task',
      String(task._id),
      `Completed task: ${task.title}`
    );

    await Profile.updateOne(
      { userId: req.user._id },
      { $inc: { tasksCompletedCount: 1, 'dailyGoal.completed': 1 } }
    );

    await recordDailyActivity(req.user._id, `Completed task: ${task.title}`);

    res.json({
      success: true,
      message: 'Task submitted and completed!',
      ...xpResult
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};