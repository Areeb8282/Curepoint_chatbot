const Doctor = require('../models/Doctor');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('hospitals');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('hospitals');
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterDoctors = async (req, res) => {
  try {
    const { area, rating, specialization } = req.query;
    const filter = {};
    
    if (area) filter.area = area;
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (specialization) filter.specialization = specialization;

    const doctors = await Doctor.find(filter).populate('hospitals');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
