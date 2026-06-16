import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Drawer, List, ListItemButton, ListItemText, useMediaQuery, useTheme,
  Tooltip, Avatar, Menu, MenuItem, Divider, alpha
} from '@mui/material';
import {
  Menu as MenuIcon, LightMode, DarkMode,
  Logout, Login, HomeRounded, SmartToyRounded,
  LocalHospitalRounded, Close, MedicalInformation
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Home',      path: '/',          icon: <HomeRounded sx={{ fontSize: 18 }} /> },
  { label: 'AI Chat',   path: '/chat',       icon: <SmartToyRounded sx={{ fontSize: 18 }} /> },
  { label: 'Doctors',   path: '/doctors',    icon: <LocalHospitalRounded sx={{ fontSize: 18 }} /> },
  { label: 'Hospitals', path: '/hospitals',  icon: <MedicalInformation sx={{ fontSize: 18 }} /> },
];

export default function Navbar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl,   setAnchorEl]   = useState(null);
  const [scrolled,   setScrolled]   = useState(false);
  const { mode, toggleColorMode }   = useColorMode();
  const { user, logout }            = useAuth();
  const isDark = mode === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); setAnchorEl(null); navigate('/'); };

  const navBg = isDark
    ? scrolled ? 'rgba(5,8,15,0.85)' : 'rgba(5,8,15,0.6)'
    : scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.7)';

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{
        background: navBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        transition: 'background 0.3s',
      }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: '64px !important' }}>

          {/* Logo */}
          <Box
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', mr: 4 }}
          >
            <Box sx={{
              width: 34, height: 34, borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
            }}>
              <LocalHospitalRounded sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              CurePoint
            </Typography>
          </Box>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
              {navLinks.map(link => {
                const active = location.pathname === link.path;
                return (
                  <Button
                    key={link.path}
                    startIcon={link.icon}
                    onClick={() => navigate(link.path)}
                    sx={{
                      px: 2, py: 0.8, borderRadius: 2.5,
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.875rem',
                      color: active
                        ? (isDark ? '#818cf8' : '#6366f1')
                        : 'text.secondary',
                      bgcolor: active
                        ? alpha('#6366f1', isDark ? 0.15 : 0.08)
                        : 'transparent',
                      border: active ? `1px solid ${alpha('#6366f1', 0.25)}` : '1px solid transparent',
                      '&:hover': {
                        bgcolor: alpha('#6366f1', isDark ? 0.12 : 0.06),
                        color: isDark ? '#818cf8' : '#6366f1',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {/* Theme toggle */}
            <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleColorMode} size="small" sx={{
                width: 36, height: 36, borderRadius: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                color: 'text.secondary',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)', transform: 'rotate(15deg)' },
                transition: 'all 0.25s',
              }}>
                {isDark ? <LightMode sx={{ fontSize: 17 }} /> : <DarkMode sx={{ fontSize: 17 }} />}
              </IconButton>
            </Tooltip>

            {/* Auth */}
            {user ? (
              <>
                <Tooltip title={user.name}>
                  <IconButton onClick={e => setAnchorEl(e.currentTarget)} sx={{ p: 0.3 }}>
                    <Avatar sx={{
                      width: 34, height: 34, fontSize: 13, fontWeight: 800,
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
                    }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 3, border: '1px solid', borderColor: 'divider' } }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography fontWeight={700} fontSize="0.9rem">{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main', mx: 1, my: 0.5, borderRadius: 2 }}>
                    <Logout fontSize="small" /> Sign out
                  </MenuItem>
                </Menu>
              </>
            ) : !isMobile ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Login sx={{ fontSize: 16 }} />}
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 2, borderRadius: 2.5, fontWeight: 600, fontSize: '0.85rem',
                    color: 'text.secondary',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    '&:hover': { borderColor: '#6366f1', color: '#6366f1' },
                  }}>
                  Login
                </Button>
                <Button size="small" variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: 2.5, borderRadius: 2.5, fontWeight: 700, fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                  }}>
                  Sign Up
                </Button>
              </Box>
            ) : null}

            {/* Mobile hamburger */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} size="small" sx={{
                width: 36, height: 36, borderRadius: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                color: 'text.primary',
              }}>
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: 'background.default', border: 'none' } }}>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 30, height: 30, borderRadius: 1.5, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocalHospitalRounded sx={{ fontSize: 17, color: 'white' }} />
              </Box>
              <Typography fontWeight={800} sx={{ background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CurePoint
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>

          <List sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            {navLinks.map(link => {
              const active = location.pathname === link.path;
              return (
                <ListItemButton key={link.path}
                  selected={active}
                  onClick={() => { navigate(link.path); setDrawerOpen(false); }}
                  sx={{
                    borderRadius: 2.5, mb: 0.5, gap: 1.5,
                    '&.Mui-selected': {
                      bgcolor: alpha('#6366f1', 0.12),
                      color: '#6366f1',
                      '&:hover': { bgcolor: alpha('#6366f1', 0.16) }
                    }
                  }}>
                  {link.icon}
                  <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.9rem' }} />
                </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button fullWidth variant="outlined" startIcon={isDark ? <LightMode /> : <DarkMode />}
              onClick={toggleColorMode} sx={{ borderRadius: 2.5, justifyContent: 'flex-start', px: 2 }}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
            {!user ? (
              <>
                <Button fullWidth variant="outlined" onClick={() => { navigate('/login'); setDrawerOpen(false); }}
                  sx={{ borderRadius: 2.5 }}>Login</Button>
                <Button fullWidth variant="contained" onClick={() => { navigate('/signup'); setDrawerOpen(false); }}
                  sx={{ borderRadius: 2.5, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>Sign Up</Button>
              </>
            ) : (
              <Button fullWidth variant="outlined" color="error" startIcon={<Logout />}
                onClick={() => { handleLogout(); setDrawerOpen(false); }} sx={{ borderRadius: 2.5 }}>
                Sign Out
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
