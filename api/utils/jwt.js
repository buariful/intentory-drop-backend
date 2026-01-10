const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
