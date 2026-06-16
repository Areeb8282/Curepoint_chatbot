import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button,
  Avatar, Select, MenuItem, Chip, CircularProgress, Grid, alpha, Paper
} from '@mui/material';
import {
  Send, SmartToy, Person, LocationOn, AutoAwesome,
  KeyboardArrowDown, WarningAmber, CheckCircle, Info
} from '@mui/icons-material';
import { sendChatMessage } from '../services/api';
import DoctorCard from '../components/DoctorCard';

const SUGGESTIONS = [
  { label: 'Stomach ache',      value: 'I have stomach ache' },
  { label: 'Fever & headache',  value: 'I have fever and headache' },
  { label: 'Chest pain',        value: 'I have chest pain' },
  { label: 'Skin rash',         value: 'I have skin rash and itching' },
  { label: 'Ear pain',          value: 'I have ear pain' },
  { label: 'Joint pain',        value: 'I have joint pain and stiffness' },
  { label: 'Pregnancy care',    value: 'I need pregnancy care' },
  { label: 'Child fever',       value: 'My child has fever' },
];

const SEVERITY_CONFIG = {
  low:      { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  icon: <CheckCircle sx={{ fontSize: 16 }} />,  label: 'LOW SEVERITY'      },
  moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  icon: <Info sx={{ fontSize: 16 }} />,          label: 'MODERATE SEVERITY' },
  high:     { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.3)',   icon: <WarningAmber sx={{ fontSize: 16 }} />,  label: 'HIGH SEVERITY'     },
};

function Dot({ delay }) {
  return (
    <Box sx={{
      width: 7, height: 7, borderRadius: '50%', bgcolor: '#6366f1',
      animation: 'bounceDot 1.2s infinite',
      animationDelay: `${delay}s`,
    }} />
  );
}

// Render bot message — handles **bold**, newlines, severity badges, numbered precautions
function BotMessage({ text, severity }) {
  const sev = severity && SEVERITY_CONFIG[severity];

  const renderText = (t) =>
    t.split('\n').map((line, i) => {
      if (!line.trim()) return <Box key={i} sx={{ height: 4 }} />;

      // Precautions section header
      if (line.startsWith('🛡️')) {
        return (
          <Typography key={i} variant="body2" sx={{
            fontWeight: 800, fontSize: '0.82rem', color: '#10b981',
            mt: 1.5, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5
          }}>
            {line}
          </Typography>
        );
      }

      // Numbered precaution items
      if (/^\d+\./.test(line.trim())) {
        return (
          <Box key={i} sx={{
            display: 'flex', gap: 1, mb: 0.5,
            pl: 0.5,
          }}>
            <Typography variant="body2" sx={{
              fontSize: '0.8rem', lineHeight: 1.6, color: 'text.primary',
              '& strong': { fontWeight: 700 }
            }}>
              {line.trim().replace(/^(\d+\.\s*)/, (m) => m)}
            </Typography>
          </Box>
        );
      }

      // Bold: **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <Typography key={i} variant="body2" sx={{ lineHeight: 1.7, fontSize: '0.875rem', color: 'text.primary' }}>
          {parts.map((p, j) =>
            j % 2 === 1
              ? <Box key={j} component="span" sx={{ fontWeight: 800, color: 'text.primary' }}>{p}</Box>
              : p
          )}
        </Typography>
      );
    });

  return (
    <Box>
      {renderText(text)}
      {sev && (
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.6,
          mt: 1.5, px: 1.5, py: 0.5, borderRadius: 2,
          bgcolor: sev.bg, border: `1px solid ${sev.border}`, color: sev.color,
        }}>
          {sev.icon}
          <Typography variant="caption" fontWeight={800} sx={{ letterSpacing: '0.05em' }}>
            {sev.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

const SYMPTOM_PHRASES = [
  'i have', 'i am having', 'i feel', 'i am feeling', 'i got', 'suffering from',
  'experiencing', 'my child has', 'now i have', 'also have', 'another symptom',
  'different problem', 'new problem', 'something else', 'also feeling',
];
const SYMPTOM_WORDS = [
  'stomach', 'chest', 'head', 'back', 'skin', 'ear', 'throat', 'fever',
  'pain', 'ache', 'rash', 'cough', 'cold', 'vomit', 'dizzy', 'nausea',
  'bleeding', 'swelling', 'itching', 'burning', 'fatigue', 'tired', 'weak',
  'joint', 'bone', 'eye', 'nose', 'breath', 'heart', 'period', 'pregnant',
  'seizure', 'tremor', 'ringing', 'discharge', 'sore', 'cramp', 'palpitation',
  'migraine', 'allergy', 'infection', 'injury', 'fracture', 'sprain',
];

function isNewSymptomMessage(msg) {
  const lower = msg.toLowerCase();
  const hasSymptomPhrase = SYMPTOM_PHRASES.some(p => lower.includes(p));
  const hasSymptomWord   = SYMPTOM_WORDS.some(w => lower.includes(w));
  return hasSymptomPhrase && hasSymptomWord;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([{
    sender: 'bot',
    text: "Hi! I'm Dr. CurePoint, your AI health assistant. 🩺\n\nI'll ask you a few questions before suggesting anything — just like a real doctor would. Tell me what's bothering you today.",
  }]);
  const [input, setInput]       = useState('');
  const [area, setArea]         = useState('Bandra');
  const [doctors, setDoctors]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [severity, setSeverity] = useState(null);
  const [round, setRound]       = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const newMessages = [...messages, { sender: 'user', text: msg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setDoctors([]);
    setSeverity(null);

    // Detect new symptom mid-conversation — reset round on the frontend immediately
    const isNew = round > 0 && isNewSymptomMessage(msg);
    const effectiveRound = isNew ? 0 : round;

    const history = newMessages.slice(1).map(m => ({
      sender: m.sender,
      text: m.rawText || m.text,
    }));

    try {
      const res = await sendChatMessage(msg, area, history, effectiveRound);
      const data = res.data;

      if (data.isAssessment) {
        setRound(0);
      } else {
        setRound(effectiveRound + 1);
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        rawText: data.rawReply || data.reply,
        severity: data.severity || null,
      }]);

      if (data.doctors?.length > 0) setDoctors(data.doctors);
      if (data.severity) setSeverity(data.severity);
    } catch {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
      }]);
    } finally { setLoading(false); }
  };

  const reset = () => {
    setMessages([{
      sender: 'bot',
      text: "Hi! I'm Dr. CurePoint, your AI health assistant. 🩺\n\nI'll ask you a few questions before suggesting anything — just like a real doctor would. Tell me what's bothering you today.",
    }]);
    setDoctors([]);
    setSeverity(null);
    setInput('');
    setRound(0);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">

        {/* ── Header ── */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
            px: 2, py: 0.7, borderRadius: 5, mb: 2,
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
          }}>
            <AutoAwesome sx={{ fontSize: 14, color: 'white' }} />
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>
              AI DOCTOR · POWERED BY GEMINI
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
            Dr. CurePoint
          </Typography>
          <Typography color="text.secondary">
            Asks follow-up questions like a real doctor before suggesting anything
          </Typography>
        </Box>

        {/* ── Location + Reset ── */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap',
          p: 2, mb: 3, borderRadius: 3,
          bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <LocationOn sx={{ color: '#6366f1', fontSize: 20 }} />
            <Typography fontWeight={700} fontSize="0.9rem">Your area</Typography>
          </Box>
          <Select value={area} onChange={e => setArea(e.target.value)} size="small"
            IconComponent={KeyboardArrowDown}
            sx={{ borderRadius: 2.5, minWidth: 150, fontWeight: 600, fontSize: '0.875rem',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#6366f1', 0.3) },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' },
            }}>
            {['Bandra','Kurla','Andheri','Mahim'].map(a => (
              <MenuItem key={a} value={a} sx={{ fontWeight: 600 }}>📍 {a}</MenuItem>
            ))}
          </Select>
          <Button size="small" onClick={reset} sx={{ ml: 'auto', color: 'text.secondary', borderRadius: 2, fontSize: '0.8rem' }}>
            New Consultation
          </Button>
        </Box>

        {/* ── Chat window ── */}
        <Box sx={{
          height: 520, display: 'flex', flexDirection: 'column',
          borderRadius: 3, overflow: 'hidden',
          border: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          mb: 2,
        }}>
          {/* Header */}
          <Box sx={{
            px: 2.5, py: 1.8,
            background: 'linear-gradient(135deg, #4f46e5, #6366f1, #06b6d4)',
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
              <SmartToy sx={{ fontSize: 20, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography fontWeight={800} color="white" fontSize="0.95rem">Dr. CurePoint AI</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ade80', animation: 'glowPulse 2s infinite' }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Online · Asks follow-up questions like a real doctor
                </Typography>
              </Box>
            </Box>
            {severity && SEVERITY_CONFIG[severity] && (
              <Box sx={{
                ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5,
                bgcolor: SEVERITY_CONFIG[severity].bg,
                border: `1px solid ${SEVERITY_CONFIG[severity].border}`,
                color: SEVERITY_CONFIG[severity].color,
                px: 1.5, py: 0.4, borderRadius: 2,
              }}>
                {SEVERITY_CONFIG[severity].icon}
                <Typography variant="caption" fontWeight={800}>{severity.toUpperCase()}</Typography>
              </Box>
            )}
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, i) => (
              <Box key={i} sx={{
                display: 'flex', gap: 1.2, alignItems: 'flex-end',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.sender === 'bot' && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#6366f1', flexShrink: 0, mb: 0.5 }}>
                    <SmartToy sx={{ fontSize: 15 }} />
                  </Avatar>
                )}
                <Box sx={{
                  maxWidth: '78%', px: 2, py: 1.5,
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'background.default',
                  border: msg.sender === 'bot' ? '1px solid' : 'none',
                  borderColor: 'divider',
                  boxShadow: msg.sender === 'user'
                    ? '0 4px 16px rgba(99,102,241,0.35)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {msg.sender === 'user' ? (
                    <Typography variant="body2" sx={{ color: 'white', lineHeight: 1.65, fontSize: '0.875rem' }}>
                      {msg.text}
                    </Typography>
                  ) : (
                    <BotMessage text={msg.text} severity={msg.severity} />
                  )}
                </Box>
                {msg.sender === 'user' && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#06b6d4', flexShrink: 0, mb: 0.5 }}>
                    <Person sx={{ fontSize: 15 }} />
                  </Avatar>
                )}
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-end' }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#6366f1' }}>
                  <SmartToy sx={{ fontSize: 15 }} />
                </Avatar>
                <Box sx={{
                  px: 2, py: 1.4, borderRadius: '4px 18px 18px 18px',
                  bgcolor: 'background.default', border: '1px solid', borderColor: 'divider',
                }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Dot delay={0} /><Dot delay={0.2} /><Dot delay={0.4} />
                  </Box>
                </Box>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <Box sx={{
            p: 2, borderTop: '1px solid', borderColor: 'divider',
            display: 'flex', gap: 1.5, bgcolor: 'background.paper',
          }}>
            <TextField
              fullWidth size="small"
              placeholder="Describe your symptoms or answer the doctor's question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !loading && send()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, '&.Mui-focused fieldset': { borderColor: '#6366f1' } } }}
            />
            <Button variant="contained" onClick={() => send()} disabled={loading || !input.trim()}
              sx={{
                borderRadius: 3, minWidth: 46, px: 1.8,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                '&:hover': { boxShadow: '0 8px 22px rgba(99,102,241,0.5)' },
                '&:disabled': { opacity: 0.5 },
              }}>
              <Send sx={{ fontSize: 18 }} />
            </Button>
          </Box>
        </Box>

        {/* ── Disclaimer ── */}
        <Paper elevation={0} sx={{
          p: 1.5, mb: 3, borderRadius: 2,
          bgcolor: alpha('#f59e0b', 0.08), border: `1px solid ${alpha('#f59e0b', 0.25)}`,
          display: 'flex', alignItems: 'flex-start', gap: 1,
        }}>
          <WarningAmber sx={{ fontSize: 16, color: '#f59e0b', mt: 0.2, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            <Box component="span" fontWeight={700} sx={{ color: '#f59e0b' }}>Medical Disclaimer: </Box>
            Dr. CurePoint is an AI assistant for preliminary guidance only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor for medical concerns.
          </Typography>
        </Paper>

        {/* ── Quick suggestions ── */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 5, alignItems: 'center' }}>
          <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ mr: 0.5 }}>
            Start with:
          </Typography>
          {SUGGESTIONS.map(s => (
            <Chip key={s.value} label={s.label} size="small" variant="outlined"
              onClick={() => send(s.value)}
              sx={{
                cursor: 'pointer', borderRadius: 2, fontSize: '0.75rem',
                borderColor: alpha('#6366f1', 0.3), color: 'text.secondary',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: alpha('#6366f1', 0.1), borderColor: '#6366f1', color: '#6366f1' }
              }}
            />
          ))}
        </Box>

        {/* ── Doctor results ── */}
        {doctors.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.01em' }}>
                Recommended Specialists
              </Typography>
              <Chip label={`${doctors.length} in ${area}`} size="small"
                sx={{ bgcolor: alpha('#6366f1', 0.12), color: '#6366f1', fontWeight: 700 }} />
            </Box>
            <Grid container spacing={2.5}>
              {doctors.map(doctor => (
                <Grid size={{ xs: 12, sm: 6 }} key={doctor._id}>
                  <DoctorCard doctor={doctor} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
