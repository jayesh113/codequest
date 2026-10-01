import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Profile, Notification } from '../models/index.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { calculateLevel } from '../services/gamificationService.js';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, avatar, interests } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'student',
      avatar: avatar || 'avatar-1.svg',
      interests: Array.isArray(interests) ? interests : []
    });
    const profile = await Profile.create({
      userId: user._id,
      bio: `Hello! I'm ${name}, excited to code and level up on CodeQuest!`,
      level: 1,
      currentXP: 0,
      streakCount: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      solvedCount: 0,
      tasksCompletedCount: 0,
      dailyGoal: { target: 2, completed: 0, date: new Date().toISOString().split('T')[0] }
    });
    await Notification.create({
      userId: user._id,
      title: '👋 Welcome to CodeQuest!',
      message: 'Start learning, solve challenges, earn XP, and climb the leaderboards!',
      type: 'announcement'
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests },
      profile: { ...profile, levelInfo: calculateLevel(profile.currentXP) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = await Profile.create({ userId: user._id, level: 1, currentXP: 0, streakCount: 0 });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, interests: user.interests },
      profile: { ...profile, levelInfo: calculateLevel(profile.currentXP) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await Profile.create({ userId: req.user._id, level: 1, currentXP: 0, streakCount: 0 });
    }
    res.json({
      success: true,
      user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, avatar: req.user.avatar, interests: req.user.interests },
      profile: { ...profile, levelInfo: calculateLevel(profile.currentXP) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email ? email.toLowerCase() : '' });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found with this email' });
  }
  res.json({ success: true, message: 'Password reset link sent to your registered email (simulated).' });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, bio, githubUrl, linkedinUrl, interests } = req.body;
    if (name || avatar || interests) {
      await User.updateOne({ _id: req.user._id }, { $set: { ...(name && { name }), ...(avatar && { avatar }), ...(interests && { interests }) } });
    }
    if (bio !== undefined || githubUrl !== undefined || linkedinUrl !== undefined) {
      await Profile.updateOne({ userId: req.user._id }, { $set: { ...(bio !== undefined && { bio }), ...(githubUrl !== undefined && { githubUrl }), ...(linkedinUrl !== undefined && { linkedinUrl }) } });
    }
    const updatedUser = await User.findById(req.user._id).select('-passwordHash');
    const updatedProfile = await Profile.findOne({ userId: req.user._id });
    res.json({
      success: true,
      user: updatedUser,
      profile: { ...updatedProfile, levelInfo: calculateLevel(updatedProfile.currentXP) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};