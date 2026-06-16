import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, Button,
  InputAdornment, IconButton, Alert, CircularProgress, LinearProgress
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Person, Phone, ArrowForward, CheckCircle } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getStrength = pw => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#06b6d4', '#10b981'];

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const strength = getStrength(form.password);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'radial-gradient(ellipse at 70% 30%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(6,182,212,0.1) 0%, transparent 60%)',
      bgcolor: 'background.default',
    }}>
      {/* Left form panel */}
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        px: { xs: 2, sm: 4 }, py: 6,
      }}>
        <Container maxWidth="xs">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
              Create account
            </Typography>
            <Typography color="text.secondary">
              Already have one?{' '}
              <Link to="/login" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }} onClose={() => setError('')}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }} />

            <TextField fullWidth label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }} />

            <TextField fullWidth label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }} />

            <Box>
              <TextField fullWidth label="Password" name="password"
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
                }} />
              {form.password.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={(strength / 4) * 100}
                    sx={{ height: 3, borderRadius: 2, bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': { bgcolor: strengthColor[strength], borderRadius: 2 } }} />
                  <Typography variant="caption" sx={{ color: strengthColor[strength], fontWeight: 600, mt: 0.4, display: 'block' }}>
                    {strengthLabel[strength]} password
                  </Typography>
                </Box>
              )}
            </Box>

            <TextField fullWidth label="Confirm Password" name="confirm"
              type={showPass ? 'text' : 'password'}
              value={form.confirm} onChange={handleChange} required
              error={form.confirm.length > 0 && form.password !== form.confirm}
              helperText={form.confirm.length > 0 && form.password !== form.confirm ? 'Passwords do not match' : ''}
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }} />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              endIcon={!loading && <ArrowForward />}
              sx={{
                py: 1.6, fontWeight: 700, fontSize: '0.95rem', borderRadius: 2.5, mt: 0.5,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                '&:hover': { boxShadow: '0 12px 32px rgba(99,102,241,0.5)' },
              }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Right branding panel */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
        justifyContent: 'center', px: 8,
        background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 60%, #4f46e5 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: [280, 180, 120][i], height: [280, 180, 120][i],
            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
            top: ['5%', '45%', '75%'][i], left: ['55%', '5%', '60%'][i],
          }} />
        ))}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontSize: 48, mb: 3 }}>🏥</Typography>
          <Typography variant="h3" fontWeight={800} color="white" sx={{ mb: 2, lineHeight: 1.2 }}>
            Your health journey<br />starts here
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7, mb: 5, maxWidth: 360 }}>
            Join thousands of patients who trust CurePoint for smarter healthcare decisions.
          </Typography>
          {['AI symptom checker', 'Book appointments instantly', 'Email confirmations', 'Real Mumbai doctors'].map((b, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.8 }}>
              <CheckCircle sx={{ color: 'rgba(255,255,255,0.9)', fontSize: 20 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{b}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
