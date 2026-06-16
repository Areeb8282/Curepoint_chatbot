const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  disease_name: { type: String, required: true },
  symptoms: [{ type: String }],
  recommended_specialization: { type: String, required: true },
  precautions: [{ type: String }]
});

module.exports = mongoose.model('Disease', diseaseSchema);
