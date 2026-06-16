const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  experience_years: { type: Number, required: true },
  hospitals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }],
  area: { type: String, required: true },
  consultation_timings: { type: String, required: true },
  availability: [{
    day: String,
    start_time: String,
    end_time: String,
    max_slots: Number,
    booked_slots: { type: Number, default: 0 }
  }]
});

module.exports = mongoose.model('Doctor', doctorSchema);
