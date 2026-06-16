const express = require('express');
const router = express.Router();
const { getAllDoctors, getDoctorById, filterDoctors } = require('../controllers/doctorController');

router.get('/doctors', getAllDoctors);
router.get('/doctors/filter', filterDoctors);
router.get('/doctors/:id', getDoctorById);

module.exports = router;
