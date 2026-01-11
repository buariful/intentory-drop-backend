const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHandler = require('../utils/ResponseHandler');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return ResponseHandler.SendErrorResponseResponse({});

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return ResponseHandler.SendErrorResponseResponse(res, 401, 'User not found');
    req.user = user;
    next();
  } catch (err) {
    return ResponseHandler.SendErrorResponseResponse(res, 401, 'Invalid token');
  }
};

module.exports = authenticate;
