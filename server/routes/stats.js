const express = require('express');
const router = express.Router();
const { getStatsHandler } = require('../controllers/statsController');

router.get('/stats', getStatsHandler);

module.exports = router;
