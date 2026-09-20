const express = require('express');
const router = express.Router();
const { getDevices } = require('../controllers/devicesController');

router.get('/devices', getDevices);

module.exports = router;
