const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const { sendAppointmentConfirmation } = require('../services/emailService');

exports.bookAppointment = async (req, res) => {
  try {
    const { user_id, doctor_id, hospital_id, date, time_slot, user_email, slot_day } = req.body;

    const existingAppointment = await Appointment.findOne({
      user_id, doctor_id, time_slot,
      date: { $gte: new Date(date).setHours(0,0,0,0), $lt: new Date(date).setHours(23,59,59,999) }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Appointment already booked for this slot.' });
    }

    const doctor = await Doctor.findById(doctor_id);

    // Use slot_day sent from frontend (reliable), fallback to deriving from date
    const dayName = slot_day || new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const [startTime] = time_slot.split(' - ');
    const slot = doctor.availability.find(
      a => a.day === dayName && a.start_time === startTime
    );

    if (slot && slot.booked_slots >= slot.max_slots) {
      return res.status(400).json({ error: 'This slot is full. Please try another slot.' });
    }

    const appointment = await Appointment.create({
      user_id, doctor_id, hospital_id,
      date: new Date(date),
      time_slot, status: 'confirmed'
    });

    if (slot) {
      slot.booked_slots += 1;
      await doctor.save();
    }

    let emailResult = { success: false };
    if (user_email) {
      const hospital = await Hospital.findById(hospital_id);
      emailResult = await sendAppointmentConfirmation({
        userEmail: user_email,
        doctorName: doctor.name,
        hospitalName: hospital.name,
        date: new Date(date),
        timeSlot: time_slot,
        slotDay: dayName,
      });
    }

    res.status(201).json({
      ...appointment.toObject(),
      message: 'Appointment booked successfully!',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user_id: req.params.userId })
      .populate('doctor_id')
      .populate('hospital_id');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetSlots = async (req, res) => {
  try {
    const { resetAllSlots } = require('../services/slotResetScheduler');
    await resetAllSlots();
    res.json({ message: 'All slots and appointments have been reset.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
