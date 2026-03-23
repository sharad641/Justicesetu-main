const express = require('express');
const route = express.Router();
const documentController = require('../controllers/documentController');
const { auth } = require('../middleware/auth');

route.post('/upload', auth, documentController.uploadDocument);
route.get('/my-vault', auth, documentController.getMyDocuments);

module.exports = route;
