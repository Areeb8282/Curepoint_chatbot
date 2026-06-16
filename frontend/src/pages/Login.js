import React, { useState } from 'react';
import {
  Box, Container, Paper, Typography, TextField, Button,
  InputAdornment, IconButton, Alert, CircularProgress, alpha
} from '@mui/material';import { Email, Lock, Visibility, VisibilityOff, ArrowForward } from '@mui/icons-material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  // Where to redirect after login (default: home)
  const from = location.state?.from || '/';
  const loginMessage = location.state?.message || '';

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate(from, { replace: true }); // go back to where they came from
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.1) 0%, transparent 60%)',
      bgcolor: 'background.default',
    }}>
      {/* Left panel */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
        justifyContent: 'center', px: 8,
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 40%, #06b6d4 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: [300, 200, 150][i], height: [300, 200, 150][i],
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)',
            top: ['10%', '50%', '70%'][i], left: ['60%', '10%', '55%'][i],
          }} />
        ))}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 4, backdropFilter: 'blur(8px)',
          }}>
            <Typography sx={{ fontSize: 28 }}>🏥</Typography>
          </Box>
          <Typography variant="h3" fontWeight={800} color="white" sx={{ mb: 2, lineHeight: 1.2 }}>
            Welcome back to<br />CurePoint
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 360 }}>
            Your AI-powered healthcare companion. Find doctors, check symptoms, and book appointments — all in one place.
          </Typography>
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['74+ verified doctors', '12 top Mumbai hospitals', 'Instant email confirmations'].map((t, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.6)' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{t}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        px: { xs: 2, sm: 4 }, py: 6,
      }}>
        <Container maxWidth="xs">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
              Sign in
            </Typography>
            <Typography color="text.secondary">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
                Create one
              </Link>
            </Typography>
          </Box>

          {loginMessage && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5 }} icon={false}>
              🔒 {loginMessage}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth label="Email address" name="email" type="email"
              value={form.email} onChange={handleChange} required autoComplete="email"
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange} required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              endIcon={!loading && <ArrowForward />}
              sx={{
                py: 1.6, fontWeight: 700, fontSize: '0.95rem', borderRadius: 2.5, mt: 1,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                '&:hover': { boxShadow: '0 12px 32px rgba(99,102,241,0.5)' },
              }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
