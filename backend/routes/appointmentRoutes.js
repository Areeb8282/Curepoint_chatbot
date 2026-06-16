const express = require('express');
const router = express.Router();
const { bookAppointment, getUserAppointments, resetSlots } = require('../controllers/appointmentController');

router.post('/appointments', bookAppointment);
router.get('/appointments/:userId', getUserAppointments);
router.post('/appointments/reset', resetSlots); // manual trigger for testing

module.exports = router;
