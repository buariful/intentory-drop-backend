const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { SendErrorResponse } = require('../utils/ResponseHandler');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return SendErrorResponse({ res, status: 401, message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return SendErrorResponse({ res, status: 404, message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return SendErrorResponse({ res, status: 401, message: 'Invalid token' });
  }
};

module.exports = authenticate;
