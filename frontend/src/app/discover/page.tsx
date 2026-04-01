'use client';

import React from 'react';
import { Box, Typography, Container, Paper, Chip, Button, Avatar } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import Link from 'next/link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TranslateIcon from '@mui/icons-material/Translate';

const trendingItems = [
  {
    title: 'Claude Opus 4.6 & Sonnet 4.6',
    desc: 'Adaptive Thinking and 1M token context (beta) mark a major leap in agent capability.',
    provider: 'Anthropic',
    icon: '👑',
    tag: 'Agents',
  },
  {
    title: 'Gemini 3.1 Pro — Thought Signatures',
    desc: 'Thought Signatures bring new transparency to deep reasoning. 5M context window.',
    provider: 'Google',
    icon: '💎',
    tag: 'Reasoning',
  },
  {
    title: 'GPT-5.4 — Native Computer-Use Agents',
    desc: 'GPT-5.4 introduces native computer-use agents, letting it operate browsers autonomously.',
    provider: 'OpenAI',
    icon: '🧠',
    tag: 'Flagship',
  },
  {
    title: 'Llama 4 Maverick — 400B MoE',
    desc: "Meta's 400B Mixture-of-Experts model with native multimodal understanding.",
    provider: 'Meta',
    icon: '🦙',
    tag: 'Open Source',
  },
];

const newReleases = [
  { date: 'Apr 1', name: 'Claude Sonnet 4.6', provider: 'Anthropic', icon: '🎵', badge: 'NEW', desc: '200K context, best-in-class coding and analysis.' },
  { date: 'Mar 28', name: 'Gemini 3.1 Flash', provider: 'Google', icon: '⚡', badge: 'HOT', desc: 'Low-latency multimodal for production workloads.' },
  { date: 'Mar 22', name: 'Llama 4 Scout', provider: 'Meta', icon: '🔭', badge: 'NEW', desc: 'Compact Llama 4 variant for edge deployments.' },
  { date: 'Mar 18', name: 'Grok Imagine Pro', provider: 'xAI', icon: '🎨', badge: 'NEW', desc: 'Photorealistic image generation with strong prompt adherence.' },
  { date: 'Mar 14', name: 'Codestral 2', provider: 'Mistral', icon: '🛠️', badge: 'NEW', desc: '80K context, optimised for large codebase comprehension.' },
  { date: 'Mar 10', name: 'DeepSeek V3', provider: 'DeepSeek', icon: '🌊', badge: 'HOT', desc: 'Open-source rival to GPT-5 on coding and math.' },
];

const categories = [
  { label: 'Language', icon: <TranslateIcon />, count: 18, color: '#1A73E8', bg: '#EFF6FF' },
  { label: 'Vision', icon: <VisibilityIcon />, count: 4, color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Code', icon: <CodeIcon />, count: 5, color: '#059669', bg: '#ECFDF5' },
  { label: 'Image Gen', icon: <ImageIcon />, count: 3, color: '#C2612E', bg: '#FFF4ED' },
  { label: 'Audio', icon: <RecordVoiceOverIcon />, count: 1, color: '#D97706', bg: '#FFFBEB' },
  { label: 'Agents', icon: <SmartToyIcon />, count: 4, color: '#DB2777', bg: '#FDF2F8' },
];

const labActivity = [
  {
    lab: 'Anthropic',
    icon: '👑',
    action: 'Released Claude Sonnet 4.6 with Adaptive Thinking and expanded 200K context window.',
    time: '2 days ago',
    color: '#FFF4ED',
  },
  {
    lab: 'Google DeepMind',
    icon: '💎',
    action: 'Launched Gemini 3.1 Flash with sub-200ms latency and 1M context for production use.',
    time: '4 days ago',
    color: '#EFF6FF',
  },
  {
    lab: 'Meta AI',
    icon: '🦙',
    action: 'Open-sourced Llama 4 Scout — a compact edge-optimised variant of Llama 4 Maverick.',
    time: '9 days ago',
    color: '#ECFDF5',
  },
  {
    lab: 'xAI',
    icon: '🤖',
    action: 'Announced Grok Imagine Pro with significant improvements to photorealism and composition.',
    time: '13 days ago',
    color: '#F5F3FF',
  },
];

export default function Discover() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      {/* ── HERO ── */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #FFF4ED 0%, #F9FAFB 60%)',
          borderBottom: '1px solid #E5E7EB',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box display="inline-flex" alignItems="center" gap={1} mb={3}>
            <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: '1.1rem' }} />
            <Typography variant="body2" fontWeight={600} color="primary.main">
              Updated daily
            </Typography>
          </Box>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={800}
            letterSpacing="-1.5px"
            lineHeight={1.1}
            gutterBottom
          >
            Discover What&apos;s New<br />
            <Typography component="span" variant="inherit" color="primary">in AI</Typography>
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ opacity: 0.8, maxWidth: 560, mx: 'auto', mt: 2, mb: 5 }}>
            Stay ahead of the curve. Explore new model releases, trending research, lab activity, and curated picks from 28 AI labs.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button component={Link} href="/marketplace" variant="contained" disableElevation sx={{ borderRadius: 6, px: 4, py: 1.5, textTransform: 'none', fontWeight: 700 }}>
              Browse Marketplace
            </Button>
            <Button component={Link} href="/chat" variant="outlined" sx={{ borderRadius: 6, px: 4, py: 1.5, textTransform: 'none', fontWeight: 700, borderColor: '#E5E7EB', color: 'text.primary' }}>
              Try a Model
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>

        {/* ── TRENDING THIS WEEK ── */}
        <Box mb={10}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight={700}>🔥 Trending This Week</Typography>
            <Button component={Link} href="/marketplace" variant="text" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}>
              See all →
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {trendingItems.map((item) => (
              <Paper
                key={item.title}
                variant="outlined"
                sx={{
                  p: 4,
                  borderRadius: 4,
                  display: 'flex',
                  gap: 3,
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: 'grey.100',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight={700}>{item.title}</Typography>
                    <Chip label={item.tag} size="small" sx={{ bgcolor: '#FFF4ED', color: '#C2612E', fontWeight: 600, fontSize: '0.7rem' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{item.desc}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {item.provider}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* ── NEW RELEASES (Timeline) ── */}
        <Box mb={10}>
          <Typography variant="h4" fontWeight={700} mb={4}>🆕 New Releases</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {newReleases.map((rel, i) => (
              <Box
                key={rel.name}
                sx={{
                  display: 'flex',
                  gap: 3,
                  alignItems: 'flex-start',
                  position: 'relative',
                  pb: i < newReleases.length - 1 ? 4 : 0,
                }}
              >
                {/* Timeline spine */}
                {i < newReleases.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 47,
                      top: 40,
                      bottom: 0,
                      width: 2,
                      bgcolor: '#E5E7EB',
                    }}
                  />
                )}

                {/* Date badge */}
                <Box
                  sx={{
                    width: 56,
                    textAlign: 'center',
                    flexShrink: 0,
                    pt: 0.5,
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    {rel.date}
                  </Typography>
                </Box>

                {/* Dot */}
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    flexShrink: 0,
                    mt: 1.5,
                    zIndex: 1,
                  }}
                />

                {/* Card */}
                <Paper
                  variant="outlined"
                  sx={{
                    flexGrow: 1,
                    p: 2.5,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: '0.15s',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'grey.100',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0,
                    }}
                  >
                    {rel.icon}
                  </Box>
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={700}>{rel.name}</Typography>
                      <Chip
                        label={rel.badge}
                        size="small"
                        sx={{
                          bgcolor: rel.badge === 'HOT' ? '#FFF4ED' : '#E0F2F1',
                          color: rel.badge === 'HOT' ? '#C2612E' : '#00695C',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 18,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">{rel.provider} · {rel.desc}</Typography>
                  </Box>
                  <Button
                    component={Link}
                    href="/marketplace"
                    variant="text"
                    size="small"
                    sx={{ color: 'primary.main', textTransform: 'none', fontWeight: 600, flexShrink: 0 }}
                  >
                    View →
                  </Button>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── BROWSE BY CATEGORY ── */}
        <Box mb={10}>
          <Typography variant="h4" fontWeight={700} mb={4}>Browse by Category</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
              gap: 3,
            }}
          >
            {categories.map((cat) => (
              <Paper
                key={cat.label}
                component={Link}
                href="/marketplace"
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: cat.color,
                    bgcolor: cat.bg,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: cat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                    color: cat.color,
                  }}
                >
                  {cat.icon}
                </Box>
                <Typography variant="body2" fontWeight={700}>{cat.label}</Typography>
                <Typography variant="caption" color="text.secondary">{cat.count} models</Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* ── LAB ACTIVITY FEED ── */}
        <Box mb={6}>
          <Typography variant="h4" fontWeight={700} mb={4}>Lab Activity Feed</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {labActivity.map((item) => (
              <Paper
                key={item.lab}
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  transition: '0.15s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: item.color,
                    fontSize: '1.3rem',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Box flexGrow={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="body2" fontWeight={700}>{item.lab}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 2 }}>
                      {item.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                    {item.action}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
