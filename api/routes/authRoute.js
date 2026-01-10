const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authController');

router.post('/signup', authcontroller.signup);
router.post('/login', authcontroller.login);
router.post('/refresh', authcontroller.refreshToken);
router.post('/logout', authcontroller.logout);

module.exports = router;
