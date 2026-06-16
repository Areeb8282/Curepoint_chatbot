const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  user_id: { type: String },
  message: { type: String, required: true },
  reply: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
