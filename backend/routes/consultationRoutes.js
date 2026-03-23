const express = require('express');
const route = express.Router();
const consultationController = require('../controllers/consultationController');
const { auth } = require('../middleware/auth');

// Protected Routes (requires JWT)
route.post('/book', auth, consultationController.createConsultation);
route.get('/my-consultations', auth, consultationController.getMyConsultations);
route.put('/:id/link', auth, consultationController.updateLink);

module.exports = route;
