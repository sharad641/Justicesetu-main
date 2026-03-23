const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Public or semi-public route to get all lawyers
route.get('/lawyers', userController.getLawyers);

// Protected route to update one's own profile
route.put('/update', auth, userController.updateProfile);

module.exports = route;
