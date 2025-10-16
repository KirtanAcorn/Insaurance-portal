const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/quick-stats', dashboardController.getQuickStats);

module.exports = router;
