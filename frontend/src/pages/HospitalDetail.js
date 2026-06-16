import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Chip, CircularProgress,
  Button, Avatar, alpha
} from '@mui/material';
import { LocationOn, AccessTime, ArrowBack, LocalHospital, MedicalServices, People } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getHospitalById } from '../services/api';
import DoctorCard from '../components/DoctorCard';

const AREA_COLORS = { Bandra: '#6366f1', Andheri: '#06b6d4', Mahim: '#f43f5e', Kurla: '#f59e0b' };

const SPEC_EMOJI = {
  'General Physician':'🩺','Cardiologist':'❤️','Dermatologist':'🧴',
  'Orthopedic':'🦴','Neurologist':'🧠','ENT Specialist':'👂',
  'Pediatrician':'👶','Gynecologist':'🌸'
};

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [specFilter, setSpecFilter] = useState('');

  useEffect(() => {
    getHospitalById(id)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress size={48} sx={{ color: '#6366f1' }} />
    </Box>
  );
  if (!data) return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Typography variant="h6" color="text.secondary">Hospital not found</Typography>
      <Button onClick={() => navigate('/hospitals')} sx={{ mt: 2 }}>Back to Hospitals</Button>
    </Box>
  );

  const color = AREA_COLORS[data.area] || '#6366f1';
  const specs = [...new Set(data.doctors?.map(d => d.specialization) || [])];
  const filteredDoctors = specFilter
    ? data.doctors.filter(d => d.specialization === specFilter)
    : data.doctors;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* Hero */}
      <Box sx={{
        background: `linear-gradient(135deg, ${alpha(color, 0.9)} 0%, ${color} 50%, ${alpha(color, 0.7)} 100%)`,
        color: 'white', pt: 4, pb: 8, px: 2, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

        <Container maxWidth="lg">
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/hospitals')}
            sx={{ color: 'white', mb: 3, opacity: 0.85, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.1)' } }}>
            All Hospitals
          </Button>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar sx={{
              width: 90, height: 90, bgcolor: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            }}>
              <LocalHospital sx={{ fontSize: 44 }} />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5, textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                {data.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1.5 }}>
                {[
                  { icon: <LocationOn sx={{ fontSize: 16 }} />, text: data.area },
                  { icon: <AccessTime sx={{ fontSize: 16 }} />, text: data.opening_hours },
                  { icon: <People sx={{ fontSize: 16 }} />, text: `${data.doctors?.length || 0} Doctors` },
                  { icon: <MedicalServices sx={{ fontSize: 16 }} />, text: `${specs.length} Specializations` },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.5, borderRadius: 5, backdropFilter: 'blur(4px)' }}>
                    {item.icon}
                    <Typography variant="body2" fontWeight={600}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, pb: 6, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>

          {/* Left — Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', mb: 3 }}>
              <Typography fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalHospital sx={{ color, fontSize: 20 }} /> Hospital Info
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'flex-start' }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.disabled', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{data.address}</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <AccessTime sx={{ fontSize: 16, color: data.opening_hours === '24/7' ? '#10b981' : 'text.disabled' }} />
                <Typography variant="body2" fontWeight={700} sx={{ color: data.opening_hours === '24/7' ? '#10b981' : 'text.secondary' }}>
                  Open: {data.opening_hours}
                </Typography>
              </Box>

              {data.opening_hours === '24/7' && (
                <Chip label="🟢 Open 24/7" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)' }} />
              )}
            </Box>

            {/* Specializations */}
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Typography fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MedicalServices sx={{ color, fontSize: 20 }} /> Specializations
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {specs.map(s => (
                  <Chip key={s} label={`${SPEC_EMOJI[s] || '🩺'} ${s}`} size="small"
                    onClick={() => setSpecFilter(specFilter === s ? '' : s)}
                    sx={{
                      fontWeight: 600, cursor: 'pointer', fontSize: '0.72rem',
                      bgcolor: specFilter === s ? color : 'action.hover',
                      color: specFilter === s ? 'white' : 'text.secondary',
                      transition: 'all 0.2s',
                    }} />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Right — Doctors */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
              <Typography variant="h6" fontWeight={800}>
                {specFilter ? `${SPEC_EMOJI[specFilter] || ''} ${specFilter}` : 'All Doctors'}
                <Typography component="span" color="text.secondary" fontWeight={400} fontSize="0.9rem"> ({filteredDoctors?.length || 0})</Typography>
              </Typography>
              {specFilter && (
                <Button size="small" onClick={() => setSpecFilter('')} sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  Clear filter
                </Button>
              )}
            </Box>

            {filteredDoctors?.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ fontSize: 48, mb: 1 }}>🔍</Typography>
                <Typography color="text.secondary">No doctors found for this specialization</Typography>
              </Box>
            ) : (
              <Grid container spacing={2.5}>
                {filteredDoctors?.map(doctor => (
                  <Grid item xs={12} sm={6} key={doctor._id}>
                    <DoctorCard doctor={{ ...doctor, hospitals: [data] }} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
