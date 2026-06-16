const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

// GET all hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ area: 1, name: 1 });
    res.json(hospitals);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET single hospital with its doctors
router.get('/hospitals/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
    const doctors = await Doctor.find({ hospitals: req.params.id });
    res.json({ ...hospital.toObject(), doctors });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
