import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, FormControl, InputLabel,
  Select, MenuItem, Chip, CircularProgress, InputAdornment,
  TextField, Button, alpha
} from '@mui/material';
import { Search, TuneRounded, Close, MedicalServices } from '@mui/icons-material';
import { filterDoctors } from '../services/api';
import DoctorCard from '../components/DoctorCard';

const SPECS = ['General Physician','Cardiologist','Dermatologist','Orthopedic','Neurologist','ENT Specialist','Pediatrician','Gynecologist'];
const SPEC_EMOJI = { 'General Physician':'🩺','Cardiologist':'❤️','Dermatologist':'🧴','Orthopedic':'🦴','Neurologist':'🧠','ENT Specialist':'👂','Pediatrician':'👶','Gynecologist':'🌸' };
const AREAS = ['Bandra','Kurla','Andheri','Mahim'];

const selectSx = {
  borderRadius: 2.5,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
};

export default function DoctorList() {
  const [doctors, setDoctors]           = useState([]);
  const [area, setArea]                 = useState('');
  const [rating, setRating]             = useState('');
  const [specialization, setSpec]       = useState('');
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(true);

  useEffect(() => { load(); }, [area, rating, specialization]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (area) params.area = area;
      if (rating) params.rating = rating;
      if (specialization) params.specialization = specialization;
      const res = await filterDoctors(params);
      setDoctors(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = doctors.filter(d =>
    [d.name, d.specialization, d.area].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  const clear = () => { setArea(''); setRating(''); setSpec(''); setSearch(''); };
  const hasFilters = area || rating || specialization || search;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)',
        py: { xs: 6, md: 8 }, px: 2, position: 'relative', overflow: 'hidden',
      }}>
        {[...Array(2)].map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)',
            width: [300, 180][i], height: [300, 180][i],
            top: ['-30%', '20%'][i], right: ['-5%', '15%'][i],
          }} />
        ))}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.15)', px: 1.5, py: 0.6, borderRadius: 5, mb: 2, backdropFilter: 'blur(8px)' }}>
            <MedicalServices sx={{ fontSize: 14, color: 'white' }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>Mumbai's Top Doctors</Typography>
          </Box>
          <Typography variant="h3" fontWeight={900} color="white" sx={{ mb: 1, letterSpacing: '-0.02em' }}>
            Find Your Doctor
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem' }}>
            {doctors.length}+ verified specialists across Bandra, Kurla, Andheri & Mahim
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* ── Filter panel ── */}
        <Box sx={{
          p: 3, mb: 4, borderRadius: 3,
          bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneRounded sx={{ color: '#6366f1', fontSize: 20 }} />
              <Typography fontWeight={700} fontSize="0.95rem">Filters</Typography>
              {hasFilters && (
                <Chip label={`${[area, rating, specialization, search].filter(Boolean).length} active`}
                  size="small" sx={{ bgcolor: alpha('#6366f1', 0.12), color: '#6366f1', height: 20, fontSize: '0.7rem' }} />
              )}
            </Box>
            {hasFilters && (
              <Button size="small" startIcon={<Close sx={{ fontSize: 14 }} />} onClick={clear}
                sx={{ color: 'text.secondary', fontSize: '0.8rem', borderRadius: 2 }}>
                Clear all
              </Button>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField fullWidth size="small" placeholder="Search name, spec, area..."
                value={search} onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment>, sx: selectSx }} />
            </Grid>
            {[
              { label: 'Area', value: area, set: setArea, items: AREAS.map(a => ({ v: a, l: `📍 ${a}` })) },
              { label: 'Specialization', value: specialization, set: setSpec, items: SPECS.map(s => ({ v: s, l: `${SPEC_EMOJI[s]} ${s}` })) },
              { label: 'Min Rating', value: rating, set: setRating, items: [{ v: '4.5', l: '⭐ 4.5+' }, { v: '4', l: '⭐ 4.0+' }, { v: '3', l: '⭐ 3.0+' }] },
            ].map(({ label, value, set, items }) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={label}>
                <FormControl fullWidth size="small">
                  <InputLabel>{label}</InputLabel>
                  <Select value={value} label={label} onChange={e => set(e.target.value)} sx={selectSx}>
                    <MenuItem value="">All {label}s</MenuItem>
                    {items.map(({ v, l }) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>

          {hasFilters && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {area && <Chip label={`📍 ${area}`} size="small" onDelete={() => setArea('')} sx={{ bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} />}
              {specialization && <Chip label={`${SPEC_EMOJI[specialization]} ${specialization}`} size="small" onDelete={() => setSpec('')} sx={{ bgcolor: alpha('#06b6d4', 0.1), color: '#06b6d4' }} />}
              {rating && <Chip label={`⭐ ${rating}+`} size="small" onDelete={() => setRating('')} sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b' }} />}
              {search && <Chip label={`"${search}"`} size="small" onDelete={() => setSearch('')} sx={{ bgcolor: alpha('#10b981', 0.1), color: '#10b981' }} />}
            </Box>
          )}
        </Box>

        {/* ── Results count ── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography fontWeight={700} fontSize="1rem">
            {loading ? 'Loading...' : filtered.length}
          </Typography>
          {!loading && <Typography color="text.secondary">doctors found</Typography>}
        </Box>

        {/* ── Grid ── */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 14, gap: 2 }}>
            <CircularProgress size={44} thickness={3} sx={{ color: '#6366f1' }} />
            <Typography color="text.secondary" fontWeight={500}>Finding doctors...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 14 }}>
            <Typography sx={{ fontSize: 56, mb: 2 }}>🔍</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No doctors found</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>Try adjusting your filters</Typography>
            <Button variant="outlined" onClick={clear} sx={{ borderRadius: 2.5, borderColor: '#6366f1', color: '#6366f1' }}>
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map(doctor => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor._id}>
                <DoctorCard doctor={doctor} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
