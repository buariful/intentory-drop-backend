const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const ResponseHandler = require('../utils/ResponseHandler');

const { SendErrorResponse, SendSuccessResponse } = ResponseHandler;

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return SendErrorResponse({ res, message: 'Username, email, and password are required' });
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
      return SendErrorResponse({ res, message });
    }

    const user = await User.create({ username, email, password });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.update({ refreshToken });

    return SendSuccessResponse({
      res,
      message: 'User created successfully',
      data: { user: { id: user.id, username: user.username }, accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    return SendErrorResponse({ res, message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return SendErrorResponse({ res, message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email: { [Op.iLike]: email } } });
    if (!user) return SendErrorResponse({ res, message: 'Invalid credentials' });

    const valid = await user.validatePassword(password);
    if (!valid)
      return SendErrorResponse({ res, message: 'Invalid credentials', data: { valid, user } });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.update({ refreshToken });

    return SendSuccessResponse({
      res,
      message: 'Login successful',
      data: { user: { id: user.id, username: user.username }, accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    SendErrorResponse({ res, message: 'Server error' });
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
