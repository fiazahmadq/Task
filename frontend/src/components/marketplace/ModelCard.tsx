'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  price: string;
  badge?: string;
  icon: string;
  contextWindow?: string;
  speed?: string;
  category?: string;
}

interface MCardProps {
  model: Model;
  onLearnMore?: (model: Model) => void;
}

// Color-code tags by index for visual variety
const tagColors = [
  { bg: 'rgba(59,130,246,0.08)', color: '#1D4ED8' },   // blue
  { bg: 'rgba(20,184,166,0.08)', color: '#0F766E' },    // teal
  { bg: 'rgba(245,158,11,0.08)', color: '#B45309' },    // amber
  { bg: 'rgba(244,63,94,0.08)', color: '#BE123C' },     // rose
  { bg: 'rgba(139,92,246,0.08)', color: '#6D28D9' },    // violet
];

const badgeStyle: Record<string, { bg: string; color: string }> = {
  Hot:  { bg: '#FFF4ED', color: '#C2612E' },
  New:  { bg: '#E0F2F1', color: '#00695C' },
  Open: { bg: '#EFF6FF', color: '#1D4ED8' },
  Beta: { bg: '#FFFBEB', color: '#B45309' },
};

export default function ModelCard({ model, onLearnMore }: MCardProps) {
  const badge = model.badge && badgeStyle[model.badge] ? model.badge : null;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        bgcolor: 'white',
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: '#C2612E',
          boxShadow: '0 8px 28px -4px rgba(194,97,46,0.12)',
          transform: 'translateY(-3px)',
        },
      }}
      onClick={() => onLearnMore?.(model)}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Row 1: Icon + Name + Badge */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ width: 44, height: 44, bgcolor: '#F3F4F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              {model.icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} color="text.primary">
                {model.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {model.provider}
              </Typography>
            </Box>
          </Box>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                bgcolor: badgeStyle[badge].bg,
                color: badgeStyle[badge].color,
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 22,
                borderRadius: '6px',
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.55, flexGrow: 1 }}>
          {model.description}
        </Typography>

        {/* Tags */}
        <Box display="flex" flexWrap="wrap" gap={0.75} mb={2.5}>
          {model.tags.slice(0, 4).map((tag, i) => {
            const c = tagColors[i % tagColors.length];
            return (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.68rem', height: 22, borderRadius: '6px' }}
              />
            );
          })}
        </Box>

        {/* Footer: Stars + Price + CTA */}
        <Box sx={{ borderTop: '1px solid #F3F4F6', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Stack direction="row">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ fontSize: '0.8rem', color: i < Math.round(model.rating) ? '#FBBF24' : '#E5E7EB' }} />
              ))}
            </Stack>
            <Typography variant="caption" fontWeight={700} color="text.primary" ml={0.3}>
              {model.rating}
            </Typography>
            <Typography variant="caption" color="text.disabled" ml={0.2}>
              ({model.reviewCount.toLocaleString()})
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="caption" fontWeight={700} sx={{ color: '#059669' }}>
              {model.price}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: '#C2612E', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={(e) => { e.stopPropagation(); onLearnMore?.(model); }}
            >
              Learn more →
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
