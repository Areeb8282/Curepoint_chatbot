import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, alpha } from '@mui/material';
import { ColorModeContext } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChatbotPage from './pages/ChatbotPage';
import DoctorList from './pages/DoctorList';
import DoctorProfile from './pages/DoctorProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HospitalList from './pages/HospitalList';
import HospitalDetail from './pages/HospitalDetail';

const BRAND = {
  indigo:  '#6366f1',
  cyan:    '#06b6d4',
  violet:  '#8b5cf6',
  emerald: '#10b981',
  rose:    '#f43f5e',
  amber:   '#f59e0b',
};

const getTheme = (mode) => {
  const dark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary:   { main: BRAND.indigo, light: '#818cf8', dark: '#4f46e5' },
      secondary: { main: BRAND.cyan,   light: '#67e8f9', dark: '#0891b2' },
      success:   { main: BRAND.emerald },
      error:     { main: BRAND.rose },
      warning:   { main: BRAND.amber },
      background: {
        default: dark ? '#05080f' : '#f1f5f9',
        paper:   dark ? '#0d1117' : '#ffffff',
      },
      divider: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
      text: {
        primary:   dark ? '#f1f5f9' : '#0f172a',
        secondary: dark ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: dark
              ? 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 60%), #05080f'
              : '#f1f5f9',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', fontWeight: 600, borderRadius: 10,
            transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 8px 24px rgba(99,102,241,0.35)', transform: 'translateY(-1px)' },
          },
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18, backgroundImage: 'none',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)',
            transition: 'transform 0.25s, box-shadow 0.25s',
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10, transition: 'box-shadow 0.2s',
              '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(BRAND.indigo, 0.18)}` }
            }
          }
        }
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
      MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
    }
  });
};

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => {
      setMode(prev => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', next);
        return next;
      });
    }
  }), [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <Routes>
              <Route path="/"           element={<Home />} />
              <Route path="/chat"       element={<ChatbotPage />} />
              <Route path="/doctors"    element={<DoctorList />} />
              <Route path="/doctor/:id" element={<DoctorProfile />} />
              <Route path="/hospitals"  element={<HospitalList />} />
              <Route path="/hospitals/:id" element={<HospitalDetail />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/signup"     element={<Signup />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
