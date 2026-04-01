'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Avatar,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
}

interface ModelDetailModalProps {
  model: Model | null;
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} id={`model-tab-${index}`} aria-labelledby={`model-tab-btn-${index}`}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
}

const mockReviews = [
  {
    name: 'Sarah K.',
    role: 'Full-Stack Developer',
    rating: 5,
    comment: 'Absolutely transformed my workflow. The code generation is accurate and the context window means I can feed it entire repos.',
    date: 'Mar 2026',
  },
  {
    name: 'James T.',
    role: 'AI Researcher',
    rating: 5,
    comment: 'Best-in-class for reasoning tasks. I\'ve compared it against everything on the market — nothing comes close for complex chain-of-thought.',
    date: 'Feb 2026',
  },
  {
    name: 'Priya M.',
    role: 'Product Manager',
    rating: 4,
    comment: 'Great for writing and summarising long documents. Pricing is fair for the quality. Would love even faster response times.',
    date: 'Feb 2026',
  },
];

const pricingTiers = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '/ month',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    features: ['100K tokens / day', 'Standard speed', 'Community support', 'API access'],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    color: '#C2612E',
    bgColor: '#FFF4ED',
    borderColor: '#F9D8C8',
    features: ['10M tokens / month', 'Priority speed', 'Email support', 'Full API access', 'Usage analytics'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    features: ['Unlimited tokens', 'Dedicated endpoints', 'SLA guarantee', 'SSO & audit logs', 'Dedicated CSM'],
  },
];

export default function ModelDetailModal({ model, open, onClose }: ModelDetailModalProps) {
  const [tab, setTab] = useState(0);

  if (!model) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="model-detail-title"
      PaperProps={{
        sx: { borderRadius: 4, maxHeight: '90vh' },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 4,
          pt: 4,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'grey.100',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0,
            }}
          >
            {model.icon}
          </Box>
          <Box>
            <Typography id="model-detail-title" variant="h5" fontWeight={800} lineHeight={1.2}>
              {model.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Chip
                label={model.provider}
                size="small"
                sx={{ bgcolor: '#F3F4F6', fontWeight: 600, fontSize: '0.75rem' }}
              />
              {model.badge && (
                <Chip
                  label={model.badge}
                  size="small"
                  sx={{
                    bgcolor: model.badge === 'Hot' ? '#FFF4ED' : '#E0F2F1',
                    color: model.badge === 'Hot' ? '#C2612E' : '#00695C',
                    fontWeight: 700,
                    borderRadius: 1,
                  }}
                />
              )}
              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ fontSize: '0.9rem', color: '#FCD34D' }} />
                <Typography variant="caption" fontWeight={700}>{model.rating}</Typography>
                <Typography variant="caption" color="text.secondary">({model.reviewCount.toLocaleString()})</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close model detail"
          sx={{ color: 'text.secondary', mt: 0.5 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 4, borderBottom: '1px solid #E5E7EB' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="Model detail tabs"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 90 },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
          }}
        >
          <Tab label="Details" id="model-tab-btn-0" aria-controls="model-tab-0" />
          <Tab label="How to Use" id="model-tab-btn-1" aria-controls="model-tab-1" />
          <Tab label="Pricing" id="model-tab-btn-2" aria-controls="model-tab-2" />
          <Tab label="Reviews" id="model-tab-btn-3" aria-controls="model-tab-3" />
        </Tabs>
      </Box>

      <DialogContent sx={{ px: 4, py: 3 }}>

        {/* ── TAB 0: Details ── */}
        <TabPanel value={tab} index={0}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
            {model.description}
          </Typography>

          {/* Tags */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={4}>
            {model.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ bgcolor: 'rgba(0,100,255,0.05)', color: '#1A73E8', fontWeight: 500, borderRadius: 4 }}
              />
            ))}
          </Box>

          {/* Specs row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              mb: 4,
            }}
          >
            {[
              { label: 'Context Window', value: model.contextWindow ?? 'N/A' },
              { label: 'Speed', value: model.speed ?? 'N/A' },
              { label: 'Price', value: model.price },
            ].map((spec) => (
              <Paper
                key={spec.label}
                variant="outlined"
                sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}
              >
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  {spec.label}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {spec.value}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Benchmarks */}
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Benchmarks
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { name: 'MMLU (Knowledge)', score: Math.round(model.rating * 18), max: 100 },
              { name: 'HumanEval (Coding)', score: Math.round(model.rating * 16), max: 100 },
              { name: 'MATH (Reasoning)', score: Math.round(model.rating * 14), max: 100 },
            ].map((bench) => (
              <Box key={bench.name}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">{bench.name}</Typography>
                  <Typography variant="body2" fontWeight={700}>{bench.score}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={bench.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 4 },
                  }}
                />
              </Box>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 1: How to Use ── */}
        <TabPanel value={tab} index={1}>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Get up and running with {model.name} in three steps.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              {
                step: 1,
                title: 'Get your API key',
                desc: `Sign up at ${model.provider}'s developer portal. Navigate to API keys and create a new secret key. Copy it to a safe location — you won't be able to see it again.`,
              },
              {
                step: 2,
                title: 'Make your first request',
                desc: `Install the SDK for your language (npm install openai / pip install anthropic). Initialize the client with your API key and call the completions endpoint. Use the model ID "${model.id}" in the model parameter.`,
              },
              {
                step: 3,
                title: 'Optimise your prompts',
                desc: 'Use a clear system prompt to set the model\'s role and constraints. Break complex tasks into steps. Add few-shot examples for specialized formats. Monitor token usage to control costs.',
              },
            ].map((s) => (
              <Box key={s.step} display="flex" gap={3}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {s.step}
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{s.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 2: Pricing ── */}
        <TabPanel value={tab} index={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
            {pricingTiers.map((tier) => (
              <Paper
                key={tier.name}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `2px solid ${tier.highlighted ? tier.borderColor : '#E5E7EB'}`,
                  bgcolor: tier.highlighted ? tier.bgColor : 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  position: 'relative',
                }}
              >
                {tier.highlighted && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: tier.color,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                    {tier.name}
                  </Typography>
                  <Box display="flex" alignItems="baseline" gap={0.5}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: tier.color }}>
                      {tier.price}
                    </Typography>
                    {tier.period && (
                      <Typography variant="caption" color="text.secondary">{tier.period}</Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {tier.features.map((f) => (
                    <Box key={f} display="flex" alignItems="center" gap={1}>
                      <CheckCircleOutlineIcon sx={{ fontSize: '1rem', color: tier.color }} />
                      <Typography variant="body2">{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant={tier.highlighted ? 'contained' : 'outlined'}
                  disableElevation
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    ...(tier.highlighted
                      ? { bgcolor: tier.color, '&:hover': { bgcolor: tier.color, filter: 'brightness(0.92)' } }
                      : { borderColor: tier.color, color: tier.color }),
                  }}
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </Paper>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 3: Reviews ── */}
        <TabPanel value={tab} index={3}>
          {/* Summary row */}
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight={800} color="primary.main" lineHeight={1}>
                {model.rating}
              </Typography>
              <Stack direction="row" sx={{ color: '#FCD34D', justifyContent: 'center', mt: 0.5 }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: '1rem' }} />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                {model.reviewCount.toLocaleString()} reviews
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              Ratings are based on verified purchases and usage data from builders on NexusAI.
            </Typography>
          </Box>

          {/* Review cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {mockReviews.map((review) => (
              <Paper key={review.name} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700, fontSize: '0.85rem' }}>
                      {review.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{review.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{review.role}</Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Stack direction="row" sx={{ color: '#FCD34D', justifyContent: 'flex-end' }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: '0.85rem' }} />
                      ))}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {review.comment}
                </Typography>
              </Paper>
            ))}
          </Box>
        </TabPanel>

      </DialogContent>
    </Dialog>
  );
}
