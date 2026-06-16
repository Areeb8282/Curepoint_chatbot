import React, { useState } from 'react';
import { Box, Typography, Chip, Avatar, Button, alpha } from '@mui/material';
import { LocationOn, WorkHistory, ArrowForward, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const specMeta = {
  'Cardiologist':      { color: '#f43f5e', emoji: '❤️' },
  'Dermatologist':     { color: '#a855f7', emoji: '🧴' },
  'Neurologist':       { color: '#6366f1', emoji: '🧠' },
  'Orthopedic':        { color: '#f97316', emoji: '🦴' },
  'Pediatrician':      { color: '#10b981', emoji: '👶' },
  'Gynecologist':      { color: '#ec4899', emoji: '🌸' },
  'ENT Specialist':    { color: '#06b6d4', emoji: '👂' },
  'General Physician': { color: '#64748b', emoji: '🩺' },
};

// Generate a unique professional avatar URL for each doctor
// Cleans the name to ensure valid URL seed — no dots, special chars
function getDoctorAvatarUrl(name) {
  // Remove "Dr." prefix and special chars, use clean name as seed
  const seed = name.replace(/^Dr\.\s*/i, '').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '-');
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear&clothingColor=262e33,3c4f5c,65c9ff,929598&accessories=prescription01,prescription02,round&accessoriesProbability=60`;
}

function DoctorAvatar({ name, color, size = 52 }) {
  const [imgError, setImgError] = useState(false);
  const initials = name.split(' ').slice(1, 3).map(n => n[0]).join('');
  const avatarUrl = getDoctorAvatarUrl(name);

  if (imgError) {
    return (
      <Avatar sx={{
        width: size, height: size, fontSize: size * 0.33, fontWeight: 800, flexShrink: 0,
        background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
        boxShadow: `0 6px 16px ${alpha(color, 0.4)}`,
      }}>
        {initials}
      </Avatar>
    );
  }

  return (
    <Avatar
      src={avatarUrl}
      onError={() => setImgError(true)}
      sx={{
        width: size, height: size, flexShrink: 0,
        border: `2px solid ${alpha(color, 0.5)}`,
        bgcolor: alpha(color, 0.08),
        boxShadow: `0 6px 16px ${alpha(color, 0.3)}`,
        '& img': { objectFit: 'cover' },
      }}
    />
  );
}

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const meta     = specMeta[doctor.specialization] || { color: '#6366f1', emoji: '🩺' };
  const hospital = doctor.hospitals?.[0];

  return (
    <Box
      onClick={() => navigate(`/doctor/${doctor._id}`)}
      sx={{
        cursor: 'pointer', borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          transform: 'translateY(-5px)',
          borderColor: alpha(meta.color, 0.5),
          boxShadow: `0 20px 48px ${alpha(meta.color, 0.18)}`,
        }
      }}
    >
      {/* Gradient top bar */}
      <Box sx={{ height: 3, background: `linear-gradient(90deg, ${meta.color}, ${alpha(meta.color, 0.3)})` }} />

      <Box sx={{ p: 2.5 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', gap: 1.8, mb: 2, alignItems: 'flex-start' }}>
          <DoctorAvatar name={doctor.name} color={meta.color} size={52} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} fontSize="0.92rem" noWrap sx={{ mb: 0.4 }}>
              {doctor.name}
            </Typography>
            <Chip
              label={`${meta.emoji} ${doctor.specialization}`}
              size="small"
              sx={{
                height: 20, fontSize: '0.68rem', fontWeight: 700,
                bgcolor: alpha(meta.color, 0.12),
                color: meta.color,
                border: `1px solid ${alpha(meta.color, 0.25)}`,
              }}
            />
          </Box>

          {/* Rating pill */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.3,
            bgcolor: alpha(meta.color, 0.1), border: `1px solid ${alpha(meta.color, 0.2)}`,
            borderRadius: 2, px: 0.8, py: 0.3, flexShrink: 0,
          }}>
            <Star sx={{ fontSize: 12, color: meta.color }} />
            <Typography fontWeight={800} fontSize="0.8rem" sx={{ color: meta.color }}>
              {doctor.rating}
            </Typography>
          </Box>
        </Box>

        {/* Info row */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.8 }}>
          {[
            { icon: <WorkHistory sx={{ fontSize: 12 }} />, text: `${doctor.experience_years} yrs` },
            { icon: <LocationOn sx={{ fontSize: 12 }} />, text: doctor.area },
          ].map((item, i) => (
            <Box key={i} sx={{
              display: 'flex', alignItems: 'center', gap: 0.4,
              bgcolor: 'action.hover', px: 1, py: 0.35, borderRadius: 1.5,
            }}>
              <Box sx={{ color: 'text.disabled' }}>{item.icon}</Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Hospital */}
        {hospital && (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.8, mb: 2,
            px: 1.2, py: 0.7, borderRadius: 1.5,
            bgcolor: 'action.hover',
            borderLeft: `3px solid ${alpha(meta.color, 0.6)}`,
          }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} noWrap>
              🏥 {hospital.name}
            </Typography>
          </Box>
        )}

        <Button
          fullWidth variant="contained" size="small" endIcon={<ArrowForward sx={{ fontSize: 15 }} />}
          sx={{
            borderRadius: 2, fontWeight: 700, py: 0.9, fontSize: '0.8rem',
            background: `linear-gradient(135deg, ${meta.color}, ${alpha(meta.color, 0.8)})`,
            boxShadow: `0 4px 14px ${alpha(meta.color, 0.35)}`,
            '&:hover': { boxShadow: `0 8px 22px ${alpha(meta.color, 0.5)}` },
          }}
        >
          View & Book
        </Button>
      </Box>
    </Box>
  );
}
