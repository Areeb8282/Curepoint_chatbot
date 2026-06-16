import React from 'react';
import { Box, Typography, Button, Container, Grid, alpha } from '@mui/material';
import {
  Chat, Search, CalendarMonth, LocationOn, Favorite, Shield,
  LocalHospital, MedicalServices, People, Place, ArrowForward,
  AutoAwesome, CheckCircle, TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: <Chat />,         color: '#6366f1', title: 'AI Symptom Checker',    desc: 'Describe symptoms in plain language. Get instant disease detection and specialist recommendations.' },
  { icon: <Search />,       color: '#06b6d4', title: 'Find Doctors',           desc: 'Browse 74+ verified doctors by area, specialization, and rating across Mumbai.' },
  { icon: <CalendarMonth />,color: '#8b5cf6', title: 'Book Appointments',      desc: 'Real-time slot availability. Slots auto-reset every 15 minutes for fair access.' },
  { icon: <LocationOn />,   color: '#f43f5e', title: 'Location Based',         desc: 'Find the best doctors near you in Bandra, Kurla, Andheri, and Mahim.' },
  { icon: <Favorite />,     color: '#ec4899', title: 'Top Rated Doctors',      desc: 'Filter by ratings to find the most trusted healthcare professionals in your area.' },
  { icon: <Shield />,       color: '#10b981', title: 'Trusted Hospitals',      desc: 'Access 12+ top hospitals — Lilavati, Kokilaben, Hinduja, Fortis and more.' },
];

const STATS = [
  { value: '12+', label: 'Hospitals',       sub: 'Across Mumbai',                    icon: <LocalHospital />,    color: '#6366f1' },
  { value: '74+', label: 'Real Doctors',    sub: 'Verified specialists',             icon: <People />,           color: '#06b6d4' },
  { value: '8',   label: 'Specializations', sub: 'All major fields',                 icon: <MedicalServices />,  color: '#8b5cf6' },
  { value: '4',   label: 'Areas Covered',   sub: 'Bandra · Kurla · Andheri · Mahim', icon: <Place />,            color: '#ec4899' },
];

const STEPS = [
  { icon: '🤒', title: 'Describe Symptoms',  desc: 'Type your symptoms in plain language into the AI chatbot.',                    color: '#6366f1' },
  { icon: '🔍', title: 'Get Matched',         desc: 'AI identifies the condition and recommends the right specialist near you.',    color: '#06b6d4' },
  { icon: '📅', title: 'Book & Confirm',      desc: 'Pick a slot, enter your email, and receive an instant confirmation.',         color: '#8b5cf6' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: 'background.default' }}>

      {/* ── Hero ── */}
      <Box sx={{
        position: 'relative', overflow: 'hidden',
        py: { xs: 10, md: 18 }, px: 2, textAlign: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #1e3a5f 70%, #0c4a6e 100%)',
      }}>
        {/* Decorative orbs */}
        {[
          { w: 500, h: 500, top: '-20%', left: '-10%', color: 'rgba(99,102,241,0.15)' },
          { w: 400, h: 400, top: '10%',  right: '-8%', color: 'rgba(6,182,212,0.12)' },
          { w: 300, h: 300, bottom: '-10%', left: '30%', color: 'rgba(139,92,246,0.1)' },
        ].map((orb, i) => (
          <Box key={i} sx={{
            position: 'absolute', borderRadius: '50%',
            width: orb.w, height: orb.h,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
            pointerEvents: 'none',
          }} />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            bgcolor: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
            px: 2, py: 0.7, borderRadius: 5, mb: 3, backdropFilter: 'blur(8px)',
          }}>
            <AutoAwesome sx={{ fontSize: 14, color: '#818cf8' }} />
            <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.08em' }}>
              AI-POWERED HEALTHCARE PLATFORM
            </Typography>
          </Box>

          <Typography variant="h1" sx={{
            fontWeight: 900, color: 'white', mb: 3,
            fontSize: { xs: '2.6rem', md: '4.2rem' },
            lineHeight: 1.1, letterSpacing: '-0.03em',
          }}>
            Your Health,{' '}
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #818cf8, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Our Priority
            </Box>
          </Typography>

          <Typography sx={{
            color: 'rgba(255,255,255,0.7)', fontSize: { xs: '1rem', md: '1.2rem' },
            lineHeight: 1.75, mb: 5, maxWidth: 560, mx: 'auto',
          }}>
            AI-powered symptom detection, location-based doctor recommendations, and seamless appointment booking — all in one place.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" startIcon={<Chat />}
              onClick={() => navigate('/chat')}
              sx={{
                px: 4, py: 1.7, borderRadius: 3, fontWeight: 700, fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 8px 28px rgba(99,102,241,0.5)',
                '&:hover': { boxShadow: '0 12px 36px rgba(99,102,241,0.65)', transform: 'translateY(-2px)' },
              }}>
              Start Symptom Check
            </Button>
            <Button variant="outlined" size="large" startIcon={<Search />}
              onClick={() => navigate('/doctors')}
              sx={{
                px: 4, py: 1.7, borderRadius: 3, fontWeight: 700, fontSize: '0.95rem',
                borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderWidth: 1.5,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)', borderWidth: 1.5 },
              }}>
              Browse Doctors
            </Button>
          </Box>

          {/* Trust badges */}
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 5, flexWrap: 'wrap' }}>
            {['74+ Verified Doctors', '12 Top Hospitals', 'Free to Use'].map((t, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircle sx={{ fontSize: 16, color: '#4ade80' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{t}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── Stats ── */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {STATS.map((s, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Box sx={{
                  p: 3, borderRadius: 3, textAlign: 'center',
                  border: '1px solid', borderColor: alpha(s.color, 0.2),
                  background: `linear-gradient(135deg, ${alpha(s.color, 0.08)}, ${alpha(s.color, 0.03)})`,
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${alpha(s.color, 0.2)}` },
                }}>
                  <Box sx={{ color: s.color, mb: 1, '& svg': { fontSize: 28 } }}>{s.icon}</Box>
                  <Typography variant="h3" fontWeight={900} sx={{ color: s.color, lineHeight: 1, mb: 0.3 }}>
                    {s.value}
                  </Typography>
                  <Typography fontWeight={700} fontSize="0.9rem" sx={{ mb: 0.2 }}>{s.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Features ── */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: '0.12em' }}>
            PLATFORM FEATURES
          </Typography>
          <Typography variant="h3" fontWeight={900} sx={{ mt: 1, letterSpacing: '-0.02em' }}>
            Everything You Need
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
            A complete healthcare platform built for Mumbai
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {FEATURES.map((f, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Box sx={{
                p: 3, borderRadius: 3, height: '100%',
                border: '1px solid', borderColor: alpha(f.color, 0.15),
                bgcolor: 'background.paper',
                background: `linear-gradient(135deg, ${alpha(f.color, 0.05)}, transparent)`,
                transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  borderColor: alpha(f.color, 0.4),
                  boxShadow: `0 16px 40px ${alpha(f.color, 0.15)}`,
                }
              }}>
                <Box sx={{
                  display: 'inline-flex', p: 1.5, borderRadius: 2.5, mb: 2,
                  bgcolor: alpha(f.color, 0.12), color: f.color,
                  '& svg': { fontSize: 24 },
                }}>
                  {f.icon}
                </Box>
                <Typography fontWeight={800} fontSize="1rem" sx={{ mb: 0.8 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── How it works ── */}
      <Box sx={{ py: 10, position: 'relative', overflow: 'hidden',
        background: theme => theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, #0d1117 0%, #0a0f1e 100%)'
          : 'linear-gradient(180deg, #f8faff 0%, #eef2ff 100%)',
        borderTop: '1px solid', borderColor: 'divider',
      }}>
        {/* background grid pattern */}
        <Box sx={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: alpha('#6366f1', 0.12), border: `1px solid ${alpha('#6366f1', 0.25)}`, px: 2, py: 0.6, borderRadius: 5, mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, letterSpacing: '0.1em' }}>HOW IT WORKS</Typography>
            </Box>
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
              3 Simple Steps
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 420, mx: 'auto' }}>
              From symptoms to booked appointment in under 2 minutes
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="stretch">
            {STEPS.map((step, i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={i}>
                <Box sx={{
                  p: 4, borderRadius: 4, height: '100%', position: 'relative',
                  background: theme => theme.palette.mode === 'dark'
                    ? `linear-gradient(145deg, ${alpha(step.color, 0.18)} 0%, rgba(15,22,41,0.95) 100%)`
                    : `linear-gradient(145deg, ${alpha(step.color, 0.08)} 0%, #ffffff 100%)`,
                  border: `1px solid ${alpha(step.color, 0.35)}`,
                  boxShadow: `0 8px 32px ${alpha(step.color, 0.15)}`,
                  transition: 'transform 0.28s, box-shadow 0.28s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: `0 20px 48px ${alpha(step.color, 0.28)}`,
                  },
                  overflow: 'hidden',
                }}>
                  {/* glow blob */}
                  <Box sx={{
                    position: 'absolute', top: -40, right: -40,
                    width: 120, height: 120, borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(step.color, 0.25)}, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* step number badge */}
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 36, height: 36, borderRadius: 2,
                    background: `linear-gradient(135deg, ${step.color}, ${alpha(step.color, 0.7)})`,
                    boxShadow: `0 4px 14px ${alpha(step.color, 0.5)}`,
                    mb: 2.5,
                  }}>
                    <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '0.9rem' }}>{i + 1}</Typography>
                  </Box>

                  {/* emoji */}
                  <Typography sx={{ fontSize: 44, mb: 2, display: 'block', lineHeight: 1 }}>{step.icon}</Typography>

                  <Typography fontWeight={800} fontSize="1.1rem" sx={{ mb: 1, color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {step.desc}
                  </Typography>

                  {/* bottom accent line */}
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${step.color}, ${alpha(step.color, 0.2)})`,
                    borderRadius: '0 0 16px 16px',
                  }} />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* connector arrows between steps (desktop only) */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'center', gap: 2, mt: 4, alignItems: 'center' }}>
            {STEPS.map((step, i) => (
              <React.Fragment key={i}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: step.color, boxShadow: `0 0 8px ${step.color}` }} />
                  <Typography variant="caption" sx={{ color: step.color, fontWeight: 700 }}>{step.title}</Typography>
                </Box>
                {i < STEPS.length - 1 && (
                  <Typography sx={{ color: 'text.disabled', fontSize: '1.2rem' }}>→</Typography>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box sx={{
        py: 12, textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0c4a6e 100%)',
      }}>
        <Box sx={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', pointerEvents: 'none' }} />
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'inline-flex', p: 2, borderRadius: 3, bgcolor: 'rgba(99,102,241,0.2)', mb: 3 }}>
            <TrendingUp sx={{ fontSize: 32, color: '#818cf8' }} />
          </Box>
          <Typography variant="h3" fontWeight={900} color="white" sx={{ mb: 2, letterSpacing: '-0.02em' }}>
            Ready to get started?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', mb: 5, fontSize: '1.05rem', lineHeight: 1.7 }}>
            Describe your symptoms and find the right doctor in seconds.
          </Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForward />}
            onClick={() => navigate('/chat')}
            sx={{
              px: 5, py: 1.8, borderRadius: 3, fontWeight: 700, fontSize: '1rem',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 8px 28px rgba(99,102,241,0.5)',
              '&:hover': { boxShadow: '0 14px 40px rgba(99,102,241,0.65)', transform: 'translateY(-2px)' },
            }}>
            Try the AI Chatbot
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
