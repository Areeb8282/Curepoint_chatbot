import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Chip, CircularProgress,
  TextField, InputAdornment, Button, alpha
} from '@mui/material';
import { Search, LocalHospital, LocationOn, AccessTime, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getHospitals } from '../services/api';

const AREA_COLORS = {
  Bandra:  '#6366f1',
  Andheri: '#06b6d4',
  Mahim:   '#f43f5e',
  Kurla:   '#f59e0b',
};

export default function HospitalList() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch]       = useState('');
  const [area, setArea]           = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getHospitals().then(r => { setHospitals(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = hospitals.filter(h =>
    (h.name.toLowerCase().includes(search.toLowerCase()) ||
     h.address.toLowerCase().includes(search.toLowerCase())) &&
    (!area || h.area === area)
  );

  const areas = [...new Set(hospitals.map(h => h.area))];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0c4a6e 100%)',
        py: { xs: 7, md: 10 }, px: 2, position: 'relative', overflow: 'hidden',
      }}>
        {[
          { w: 300, h: 300, top: '-20%', right: '-5%', color: 'rgba(99,102,241,0.12)' },
          { w: 200, h: 200, bottom: '-10%', left: '5%', color: 'rgba(6,182,212,0.1)' },
        ].map((orb, i) => (
          <Box key={i} sx={{ position: 'absolute', borderRadius: '50%', width: orb.w, height: orb.h, background: `radial-gradient(circle, ${orb.color}, transparent 70%)`, top: orb.top, right: orb.right, bottom: orb.bottom, left: orb.left, pointerEvents: 'none' }} />
        ))}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', px: 2, py: 0.6, borderRadius: 5, mb: 2 }}>
            <LocalHospital sx={{ fontSize: 14, color: '#818cf8' }} />
            <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700 }}>Mumbai's Top Hospitals</Typography>
          </Box>
          <Typography variant="h3" fontWeight={900} color="white" sx={{ mb: 1, letterSpacing: '-0.02em' }}>
            Find Hospitals
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem' }}>
            {hospitals.length} trusted hospitals across Bandra, Kurla, Andheri & Mahim
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search hospitals or address..."
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 17, color: 'text.disabled' }} /></InputAdornment> }}
            sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="All Areas" size="small" onClick={() => setArea('')}
              sx={{ fontWeight: 700, bgcolor: !area ? '#6366f1' : 'action.hover', color: !area ? 'white' : 'text.secondary', cursor: 'pointer' }} />
            {areas.map(a => (
              <Chip key={a} label={a} size="small" onClick={() => setArea(a === area ? '' : a)}
                sx={{ fontWeight: 700, bgcolor: area === a ? AREA_COLORS[a] : 'action.hover', color: area === a ? 'white' : 'text.secondary', cursor: 'pointer' }} />
            ))}
          </Box>
        </Box>

        {/* Count */}
        <Box sx={{ mb: 3 }}>
          <Typography fontWeight={700}>{loading ? 'Loading...' : filtered.length}
            <Typography component="span" color="text.secondary" fontWeight={400}> hospitals found</Typography>
          </Typography>
        </Box>

        {/* Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
            <CircularProgress size={44} sx={{ color: '#6366f1' }} />
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map(h => {
              const color = AREA_COLORS[h.area] || '#6366f1';
              return (
                <Grid item xs={12} sm={6} md={4} key={h._id}>
                  <Box sx={{
                    borderRadius: 3, overflow: 'hidden',
                    border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'all 0.25s',
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: alpha(color, 0.5), boxShadow: `0 16px 40px ${alpha(color, 0.15)}` }
                  }} onClick={() => navigate(`/hospitals/${h._id}`)}>
                    {/* top bar */}
                    <Box sx={{ height: 4, background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})` }} />

                    <Box sx={{ p: 2.5 }}>
                      {/* Icon + Name */}
                      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'flex-start' }}>
                        <Box sx={{
                          width: 44, height: 44, borderRadius: 2, flexShrink: 0,
                          background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: `0 4px 12px ${alpha(color, 0.4)}`,
                        }}>
                          <LocalHospital sx={{ color: 'white', fontSize: 22 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography fontWeight={800} fontSize="0.92rem" sx={{ lineHeight: 1.3, mb: 0.4 }}>
                            {h.name}
                          </Typography>
                          <Chip label={h.area} size="small" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: alpha(color, 0.12), color }} />
                        </Box>
                      </Box>

                      {/* Address */}
                      <Box sx={{ display: 'flex', gap: 0.8, mb: 1.5, alignItems: 'flex-start' }}>
                        <LocationOn sx={{ fontSize: 14, color: 'text.disabled', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                          {h.address}
                        </Typography>
                      </Box>

                      {/* Hours */}
                      <Box sx={{ display: 'flex', gap: 0.8, mb: 2, alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 14, color: h.opening_hours === '24/7' ? '#10b981' : 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700} sx={{ color: h.opening_hours === '24/7' ? '#10b981' : 'text.secondary' }}>
                          {h.opening_hours}
                        </Typography>
                      </Box>

                      <Button fullWidth variant="contained" size="small" endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
                        sx={{
                          borderRadius: 2, fontWeight: 700, py: 0.9, fontSize: '0.8rem',
                          background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
                          boxShadow: `0 4px 12px ${alpha(color, 0.35)}`,
                          '&:hover': { boxShadow: `0 6px 18px ${alpha(color, 0.5)}` },
                        }}>
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
