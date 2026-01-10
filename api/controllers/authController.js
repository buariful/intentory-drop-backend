const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Responsehandler = require('../utils/ResponseHandler');

const { SendError, SendSuccess } = Responsehandler;

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Username, email, and password are required' });
    }

    const existing = await User.findOne({
      where: {
        [Op.or]: {
          email: { [Op.iLike]: email },
          username: { [Op.iLike]: username },
        },
      },
    });
    if (existing) {
      let message = '';
      if (existing.email?.toLowerCase() === email?.toLowerCase()) message = 'Email already exists';
      if (existing.username?.toLowerCase() === username?.toLowerCase())
        message = 'Username already exists';
      return res.status(400).json({ success: false, message });
    }

    const user = await User.create({ username, email, password });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.update({ refreshToken });

    res.json({ user: { id: user.id, username: user.username }, accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return SendError({ res, message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: { [Op.iLike]: email } } });
    if (!user) return SendError({ res, message: 'Invalid credentials' });

    const valid = await user.validatePassword(password);
    if (!valid) return SendError({ res, message: 'Invalid credentials', data: { valid, user } });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.update({ refreshToken });

    return SendSuccess({
      res,
      message: 'Login successful',
      data: { user: { id: user.id, username: user.username }, accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    SendError({ res, message: 'Server error' });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (user) await user.update({ refreshToken: null });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
};
