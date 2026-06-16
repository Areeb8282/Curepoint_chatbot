const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/chatController');

router.post('/chat', processChat);

module.exports = router;
