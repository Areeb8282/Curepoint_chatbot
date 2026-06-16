require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Load models first
require('./models/User');
require('./models/Hospital');
require('./models/Doctor');
require('./models/Disease');
require('./models/Appointment');
require('./models/ChatHistory');

const chatRoutes = require('./routes/chatRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const { startSlotResetScheduler } = require('./services/slotResetScheduler');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);
app.use('/api', doctorRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', authRoutes);
app.use('/api', hospitalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startSlotResetScheduler();
});
