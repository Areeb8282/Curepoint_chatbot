const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const RESET_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

async function resetAllSlots() {
  try {
    // Reset booked_slots to 0 for every availability slot on every doctor
    await Doctor.updateMany(
      {},
      { $set: { 'availability.$[].booked_slots': 0 } }
    );

    // Clear all appointments
    const { deletedCount } = await Appointment.deleteMany({});

    const now = new Date().toLocaleTimeString('en-IN');
    console.log(`🔄 [${now}] Slot reset complete — ${deletedCount} appointments cleared, all booked_slots reset to 0.`);
  } catch (err) {
    console.error('❌ Slot reset failed:', err.message);
  }
}

function startSlotResetScheduler() {
  console.log(`⏱️  Slot reset scheduler started — resets every 15 minutes.`);
  setInterval(resetAllSlots, RESET_INTERVAL_MS);
}

module.exports = { startSlotResetScheduler, resetAllSlots };
