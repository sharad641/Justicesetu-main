const express = require('express');
const route = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

// Note: In production, create a specific 'admin' middleware role check instead of generic auth.
route.get('/stats', auth, adminController.getAdminStats);
route.get('/users', auth, adminController.getAllUsers);
route.get('/pending-lawyers', auth, adminController.getPendingLawyers);
route.put('/verify-lawyer/:id', auth, adminController.verifyLawyer);

module.exports = route;
