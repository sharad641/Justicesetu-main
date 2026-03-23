const express = require('express');
const route = express.Router();
const caseTrackerController = require('../controllers/caseTrackerController');
const { auth } = require('../middleware/auth');

// Protect adding an update (requires JWT)
route.post('/update', auth, caseTrackerController.addCaseUpdate);

// Open route or protected based on logic? Let's make tracking public if you have CVR.
route.get('/track/:cvr', caseTrackerController.getCaseHistory);

module.exports = route;
