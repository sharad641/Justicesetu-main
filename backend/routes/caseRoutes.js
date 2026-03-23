const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const { auth, authorizeRoles } = require('../middleware/auth');

// @route   GET /api/cases
// @desc    Get user's cases
router.get('/', auth, caseController.getCases);

// @route   POST /api/cases
// @desc    Create a new case
router.post('/', auth, caseController.createCase);

// @route   GET /api/cases/track/:cvr
// @desc    Track case by CVR number
router.get('/track/:cvr', caseController.trackCase);

module.exports = router;
