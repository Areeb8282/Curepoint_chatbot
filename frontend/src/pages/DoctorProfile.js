import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Avatar, Chip,
  Rating, Button, TextField, Divider, CircularProgress,
  Alert, Card, CardContent
} from '@mui/material';
import {
  LocationOn, WorkHistory, AccessTime, LocalHospital,
  CalendarMonth, CheckCircle, Email, ArrowBack, Star,
  EventAvailable, MedicalServices
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDoctorById, bookAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const specializationColors = {
  'Cardiologist':      { main: '#e53935', light: '#ff6f60', dark: '#ab000d' },
  'Dermatologist':     { main: '#8e24aa', light: '#c158dc', dark: '#5c007a' },
  'Neurologist':       { main: '#1e88e5', light: '#6ab7ff', dark: '#005cb2' },
  'Orthopedic':        { main: '#f4511e', light: '#ff8a50', dark: '#b91400' },
  'Pediatrician':      { main: '#43a047', light: '#76d275', dark: '#00701a' },
  'Gynecologist':      { main: '#e91e63', light: '#ff6090', dark: '#b0003a' },
  'ENT Specialist':    { main: '#00acc1', light: '#5ddef4', dark: '#007c91' },
  'General Physician': { main: '#546e7a', light: '#819ca9', dark: '#29434e' },
};

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { loadDoctor(); }, [id]);

  const loadDoctor = async () => {
    try {
      const res = await getDoctorById(id);
      setDoctor(res.data);
    } catch (e) { console.error(e); }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return setError('Please select a time slot');
    if (!userEmail) return setError('Please enter your email');
    if (!/\S+@\S+\.\S+/.test(userEmail)) return setError('Please enter a valid email');

    // Must be logged in to book
    if (!user) {
      navigate('/login', { state: { from: location.pathname, message: 'Please log in to book an appointment.' } });
      return;
    }
    setError('');
    setBooking(true);

    // Calculate the next occurrence of the selected slot's day
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const targetDay = dayNames.indexOf(selectedSlot.day);
    const today = new Date();
    const todayDay = today.getDay();
    let daysUntil = targetDay - todayDay;
    if (daysUntil <= 0) daysUntil += 7; // always book the NEXT occurrence
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + daysUntil);
    appointmentDate.setHours(0, 0, 0, 0);

    try {
      await bookAppointment({
        user_id: userEmail,
        user_email: userEmail,
        doctor_id: id,
        hospital_id: doctor.hospitals[0]._id,
        date: appointmentDate.toISOString(),
        time_slot: `${selectedSlot.start_time} - ${selectedSlot.end_time}`,
        slot_day: selectedSlot.day,
      });
      setSuccess(`Appointment booked! Confirmation sent to ${userEmail}`);
      setSelectedSlot(null);
      setUserEmail('');
      loadDoctor();
    } catch (e) {
      setError(e.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (!doctor) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={48} />
    </Box>
  );

  const palette = specializationColors[doctor.specialization] || specializationColors['General Physician'];
  const initials = doctor.name.split(' ').slice(1, 3).map(n => n[0]).join('');
  const seed = doctor.name.replace(/^Dr\.\s*/i, '').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-');
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear&clothingColor=262e33,3c4f5c,65c9ff,929598&accessories=prescription01,prescription02,round&accessoriesProbability=60`;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <Box sx={{
        background: `linear-gradient(135deg, ${palette.dark} 0%, ${palette.main} 50%, ${palette.light} 100%)`,
        color: 'white', pt: 4, pb: 8, px: 2, position: 'relative', overflow: 'hidden'
      }}>
        {/* decorative circles */}
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

        <Container maxWidth="lg">
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}
            sx={{ color: 'white', mb: 3, opacity: 0.85, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } }}>
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar
              src={avatarUrl}
              onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML = `<span style="font-size:36px;font-weight:800;color:white">${initials}</span>`; }}
              sx={{
                width: 100, height: 100,
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                bgcolor: 'rgba(255,255,255,0.15)',
              }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                {doctor.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip icon={<MedicalServices sx={{ fontSize: 14, color: 'white !important' }} />}
                  label={doctor.specialization}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, backdropFilter: 'blur(4px)' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                {[
                  { icon: <Star sx={{ fontSize: 16 }} />, text: `${doctor.rating} Rating` },
                  { icon: <WorkHistory sx={{ fontSize: 16 }} />, text: `${doctor.experience_years} yrs exp` },
                  { icon: <LocationOn sx={{ fontSize: 16 }} />, text: doctor.area },
                  { icon: <AccessTime sx={{ fontSize: 16 }} />, text: doctor.consultation_timings },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.5, borderRadius: 5, backdropFilter: 'blur(4px)' }}>
                    {item.icon}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Rating badge */}
            <Box sx={{ textAlign: 'center', bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 3, backdropFilter: 'blur(8px)', minWidth: 90 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1 }}>{doctor.rating}</Typography>
              <Rating value={parseFloat(doctor.rating)} precision={0.1} size="small" readOnly
                sx={{ '& .MuiRating-iconFilled': { color: '#ffd700' }, mt: 0.5 }} />
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Rating</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Content pulled up over hero ── */}
      <Container maxWidth="lg" sx={{ mt: -4, pb: 6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>

          {/* ── Left Column ── */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* Hospitals */}
            <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ bgcolor: `${palette.main}20`, p: 0.8, borderRadius: 2 }}>
                  <LocalHospital sx={{ color: palette.main, fontSize: 22 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>Hospitals</Typography>
              </Box>
              {doctor.hospitals.map(h => (
                <Card key={h._id} sx={{
                  mb: 2, borderRadius: 2,
                  border: `1px solid ${palette.main}30`,
                  background: `linear-gradient(135deg, ${palette.main}08, transparent)`,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${palette.main}25` }
                }}>
                  <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                    <Typography fontWeight={700} sx={{ color: palette.main }}>{h.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{h.address}</Typography>
                    <Chip label={`🕐 ${h.opening_hours}`} size="small"
                      sx={{ mt: 1, bgcolor: `${palette.main}15`, color: palette.main, fontWeight: 600, border: `1px solid ${palette.main}30` }} />
                  </CardContent>
                </Card>
              ))}
            </Paper>

            {/* Available Slots */}
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Box sx={{ bgcolor: `${palette.main}20`, p: 0.8, borderRadius: 2 }}>
                  <EventAvailable sx={{ color: palette.main, fontSize: 22 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>Available Slots</Typography>
              </Box>
              <Grid container spacing={2}>
                {doctor.availability.map((slot, idx) => {
                  const available = slot.max_slots - slot.booked_slots;
                  const isFull = available <= 0;
                  const isSelected = selectedSlot === slot;
                  const pct = Math.round((slot.booked_slots / slot.max_slots) * 100);

                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                      <Box onClick={() => !isFull && setSelectedSlot(slot)} sx={{
                        p: 2.5, borderRadius: 3,
                        border: '2px solid',
                        borderColor: isSelected ? palette.main : isFull ? 'error.main' : `${palette.main}30`,
                        background: isSelected
                          ? `linear-gradient(135deg, ${palette.main}25, ${palette.main}10)`
                          : isFull
                          ? 'rgba(211,47,47,0.06)'
                          : 'background.paper',
                        cursor: isFull ? 'not-allowed' : 'pointer',
                        transition: 'all 0.25s',
                        position: 'relative', overflow: 'hidden',
                        '&:hover': !isFull ? {
                          borderColor: palette.main,
                          background: `linear-gradient(135deg, ${palette.main}18, ${palette.main}08)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${palette.main}30`
                        } : {}
                      }}>
                        {isSelected && (
                          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${palette.main}, ${palette.light})`, borderRadius: '3px 3px 0 0' }} />
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography fontWeight={800} sx={{ color: isSelected ? palette.main : 'text.primary' }}>
                              {slot.day}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                              {slot.start_time} – {slot.end_time}
                            </Typography>
                          </Box>
                          {isSelected
                            ? <CheckCircle sx={{ color: palette.main, fontSize: 22 }} />
                            : isFull
                            ? <Chip label="Full" size="small" color="error" sx={{ fontWeight: 700 }} />
                            : null
                          }
                        </Box>

                        {/* progress bar */}
                        <Box sx={{ mt: 1.5, bgcolor: 'action.hover', borderRadius: 5, height: 5, overflow: 'hidden' }}>
                          <Box sx={{
                            height: '100%', borderRadius: 5, width: `${pct}%`,
                            background: isFull ? '#d32f2f' : pct > 70 ? '#f57c00' : palette.main,
                            transition: 'width 0.4s'
                          }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.8 }}>
                          <Typography variant="caption" sx={{ color: isFull ? 'error.main' : available <= 3 ? 'warning.main' : 'success.main', fontWeight: 700 }}>
                            {isFull ? 'No slots left' : `${available} slots left`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{slot.booked_slots}/{slot.max_slots}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          </Grid>

          {/* ── Right Column — Booking ── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={6} sx={{
              p: 3, borderRadius: 3, position: 'sticky', top: 80,
              bgcolor: 'background.paper',
              border: `1px solid ${palette.main}25`,
              boxShadow: `0 8px 32px ${palette.main}20`
            }}>
              {/* header strip */}
              <Box sx={{
                background: `linear-gradient(135deg, ${palette.main}, ${palette.light})`,
                mx: -3, mt: -3, mb: 3, px: 3, py: 2, borderRadius: '12px 12px 0 0'
              }}>
                <Typography variant="h6" fontWeight={800} color="white">Book Appointment</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  with {doctor.name}
                </Typography>
              </Box>

              {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

              {/* Selected slot preview */}
              {selectedSlot ? (() => {
                const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                const targetDay = dayNames.indexOf(selectedSlot.day);
                const today = new Date();
                let daysUntil = targetDay - today.getDay();
                if (daysUntil <= 0) daysUntil += 7;
                const apptDate = new Date(today);
                apptDate.setDate(today.getDate() + daysUntil);
                const formatted = apptDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                return (
                  <Box sx={{
                    p: 2, borderRadius: 2, mb: 3,
                    background: `linear-gradient(135deg, ${palette.main}20, ${palette.main}08)`,
                    border: `1px solid ${palette.main}40`
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>SELECTED SLOT</Typography>
                        <Typography fontWeight={800} sx={{ color: palette.main }}>{selectedSlot.day} · {formatted}</Typography>
                        <Typography variant="body2" color="text.secondary">{selectedSlot.start_time} – {selectedSlot.end_time}</Typography>
                      </Box>
                      <CheckCircle sx={{ color: palette.main, fontSize: 32 }} />
                    </Box>
                  </Box>
                );
              })() : (
                <Box sx={{
                  p: 2.5, borderRadius: 2, mb: 3, textAlign: 'center',
                  border: '2px dashed', borderColor: 'divider',
                  bgcolor: 'action.hover'
                }}>
                  <CalendarMonth sx={{ color: 'text.disabled', fontSize: 36, mb: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">Select a slot from the left</Typography>
                </Box>
              )}

              <TextField
                fullWidth label="Your Email" type="email"
                placeholder="you@example.com"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                InputProps={{ startAdornment: <Email sx={{ mr: 1, color: palette.main, fontSize: 20 }} /> }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': { borderColor: palette.main },
                  },
                  '& label.Mui-focused': { color: palette.main }
                }}
              />

              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: 14 }} /> A confirmation email will be sent to your inbox after booking.
              </Typography>

              <Button fullWidth variant="contained" size="large"
                onClick={handleBooking} disabled={booking}
                sx={{
                  py: 1.8, fontWeight: 800, fontSize: '1rem', borderRadius: 2,
                  background: `linear-gradient(135deg, ${palette.main}, ${palette.light})`,
                  boxShadow: `0 4px 20px ${palette.main}50`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${palette.dark}, ${palette.main})`,
                    boxShadow: `0 6px 24px ${palette.main}70`,
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s'
                }}>
                {booking ? <CircularProgress size={24} color="inherit" /> : '✅ Confirm Appointment'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
