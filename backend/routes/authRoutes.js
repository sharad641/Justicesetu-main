const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', authController.login);

// @route   GET /api/auth/me
// @desc    Get logged in user profile
router.get('/me', auth, authController.getProfile);

module.exports = router;
