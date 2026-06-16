const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: { type: Date, required: true },
  time_slot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
