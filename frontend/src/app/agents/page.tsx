'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Chip,
  Stack,
  TextField,
  Switch,
  InputAdornment,
  Divider,
} from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

// ─── Data ────────────────────────────────────────────────────────────────────

const templates = [
  {
    emoji: '🔍',
    title: 'Research Agent',
    desc: 'Automates web research, summarises findings, and generates structured reports on demand.',
    tags: ['GPT-5.4', 'Web search', 'Reports'],
    color: '#0ea5e9',
    bg: '#e0f2fe',
    category: 'Productivity',
  },
  {
    emoji: '🤝',
    title: 'Customer Support Agent',
    desc: 'Handles tickets, FAQs, and escalates complex issues with full conversation context.',
    tags: ['Claude Opus 4.6', 'Ticketing', 'Escalation'],
    color: '#b91c1c',
    bg: '#fee2e2',
    category: 'Support',
  },
  {
    emoji: '🛠️',
    title: 'Code Review Agent',
    desc: 'Reviews pull requests, flags bugs, suggests improvements, and explains changes inline.',
    tags: ['Claude Opus 4.6', 'GitHub', 'Code'],
    color: '#2563eb',
    bg: '#dbeafe',
    category: 'Engineering',
  },
  {
    emoji: '📊',
    title: 'Data Analysis Agent',
    desc: 'Connects to spreadsheets and databases, runs analysis, and delivers visual summaries.',
    tags: ['GPT-5 Turbo', 'SQL', 'Charts'],
    color: '#7c3aed',
    bg: '#f5f3ff',
    category: 'Analytics',
  },
  {
    emoji: '✍️',
    title: 'Content Writer Agent',
    desc: 'Drafts blog posts, social copy, and emails based on your brand voice and briefs.',
    tags: ['Claude Sonnet 4.6', 'SEO', 'Writing'],
    color: '#0891b2',
    bg: '#ecfeff',
    category: 'Marketing',
  },
  {
    emoji: '📅',
    title: 'Meeting Scheduler Agent',
    desc: 'Reads your calendar, proposes slots, sends invites, and follows up automatically.',
    tags: ['GPT-4o', 'Calendar', 'Email'],
    color: '#059669',
    bg: '#ecfdf5',
    category: 'Productivity',
  },
];

const steps = [
  {
    num: '01',
    title: 'Describe your agent',
    desc: 'Tell us what you want your agent to do in plain English. No technical knowledge needed.',
  },
  {
    num: '02',
    title: 'Pick your model & tools',
    desc: 'Choose from 30+ AI models and connect to web search, databases, APIs, or your own data.',
  },
  {
    num: '03',
    title: 'Deploy & monitor',
    desc: 'Go live in one click. Monitor runs, view logs, set schedules, and get alerts when something needs attention.',
  },
];

const capabilities = [
  {
    emoji: '🌐',
    title: 'Live web access',
    desc: 'Browse, scrape, and summarise any webpage in real time.',
  },
  {
    emoji: '🔗',
    title: 'API integrations',
    desc: 'Connect to Slack, Notion, GitHub, Google Sheets, and 100+ more.',
  },
  {
    emoji: '📋',
    title: 'Scheduled runs',
    desc: 'Set your agent on a cron schedule — hourly, daily, or on trigger.',
  },
  {
    emoji: '🔔',
    title: 'Smart alerts',
    desc: 'Get notified by email or Slack when your agent needs attention.',
  },
];

const modelChips = ['GPT-5 ▾', 'Claude Opus ▾', 'Gemini 3.1 ▾'];

// ─── Shared style tokens ─────────────────────────────────────────────────────

const orangeGradient = 'linear-gradient(180deg, #D46F35 0%, #B3511D 100%)';
const cardBorder = '1px solid #E5E7EB';

// ─── Component ───────────────────────────────────────────────────────────────

export default function AgentsPage() {
  const [agentName, setAgentName] = useState('');
  const [agentDesc, setAgentDesc] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [tools, setTools] = useState({
    webSearch: true,
    fileUpload: false,
    apiConnect: false,
    memory: true,
  });

  const toggleTool = (key: keyof typeof tools) => {
    setTools((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(templateSearch.toLowerCase()))
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F2EE', display: 'flex', flexDirection: 'column' }}>
      {/* ── 1. Navbar ─────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── 2. Hero ───────────────────────────────────────────────────────── */}
      <Box
        sx={{
          width: '100%',
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(194,97,46,0.12), transparent)',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              alignItems: 'center',
              gap: { xs: 6, lg: 10 },
            }}
          >
            {/* Hero left */}
            <Box sx={{ flex: 1, maxWidth: 640 }}>
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: '#FFF4ED',
                  color: '#C2612E',
                  borderRadius: 10,
                  px: 2,
                  py: 0.75,
                  mb: 3,
                  border: '1px solid rgba(194,97,46,0.2)',
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 0.3 }}>
                  ✦ AI-Powered Agent Builder
                </Typography>
              </Box>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-1.5px',
                  lineHeight: 1.1,
                  mb: 3,
                  fontSize: { xs: '2.2rem', md: '3rem', lg: '3.5rem' },
                  color: 'text.primary',
                }}
              >
                Build AI agents that work while you sleep
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.7 }}
              >
                Connect any AI model to tools, data sources, and workflows. No code required — just describe what you want your agent to do.
              </Typography>

              {/* CTA buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<AddIcon />}
                  sx={{
                    background: orangeGradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '0.95rem',
                    '&:hover': { background: 'linear-gradient(180deg, #CA6228 0%, #A34818 100%)' },
                  }}
                >
                  + New Agent
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#E5E7EB',
                    color: 'text.primary',
                    fontWeight: 600,
                    px: 3.5,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '0.95rem',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.03)', borderColor: '#D1D5DB' },
                  }}
                >
                  Browse templates →
                </Button>
              </Stack>

              {/* Stats row */}
              <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem sx={{ borderColor: '#D1D5DB' }} />}
                alignItems="center"
              >
                {[
                  { label: '2,400+', sub: 'Agents built' },
                  { label: '18', sub: 'Templates' },
                  { label: 'Any model', sub: 'Supported' },
                ].map((stat) => (
                  <Box key={stat.sub}>
                    <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.sub}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Hero right — agent canvas mockup */}
            <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 400, lg: 440 } }}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: 'white',
                  border: cardBorder,
                  borderRadius: 4,
                  p: 3,
                  boxShadow: '0 20px 60px -10px rgba(0,0,0,0.10)',
                }}
              >
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, display: 'block', mb: 2.5 }}>
                  AGENT WORKFLOW
                </Typography>

                <Stack spacing={0} alignItems="center">
                  {/* Node 1 */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: 3,
                      px: 3,
                      py: 1.75,
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Typography fontWeight={700} fontSize="0.9rem">
                      🔍 Research
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Web + docs
                    </Typography>
                  </Paper>

                  {/* Arrow */}
                  <Typography
                    color="text.disabled"
                    sx={{ fontSize: '1.4rem', lineHeight: 1, my: 0.75, userSelect: 'none' }}
                  >
                    ↓
                  </Typography>

                  {/* Node 2 */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: '#FFF4ED',
                      border: '1px solid #FDBA74',
                      borderRadius: 3,
                      px: 3,
                      py: 1.75,
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Typography fontWeight={700} fontSize="0.9rem">
                      🧠 Reasoning
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Claude Opus 4.6
                    </Typography>
                  </Paper>

                  {/* Arrow */}
                  <Typography
                    color="text.disabled"
                    sx={{ fontSize: '1.4rem', lineHeight: 1, my: 0.75, userSelect: 'none' }}
                  >
                    ↓
                  </Typography>

                  {/* Node 3 */}
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: '#ECFDF5',
                      border: '1px solid #6EE7B7',
                      borderRadius: 3,
                      px: 3,
                      py: 1.75,
                      width: '100%',
                      textAlign: 'center',
                    }}
                  >
                    <Typography fontWeight={700} fontSize="0.9rem">
                      📤 Output
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Email + Slack
                    </Typography>
                  </Paper>
                </Stack>

                {/* Bottom status bar */}
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: cardBorder,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#22C55E',
                        boxShadow: '0 0 0 2px rgba(34,197,94,0.25)',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                      Agent running...
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: '#E5E7EB',
                      color: 'text.secondary',
                      borderRadius: 2,
                      fontSize: '0.72rem',
                      py: 0.4,
                      px: 1.5,
                      minWidth: 0,
                      '&:hover': { borderColor: '#D1D5DB', bgcolor: 'rgba(0,0,0,0.03)' },
                    }}
                  >
                    ⏸ Pause
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── 3. How it works ───────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 10 }, width: '100%' }}>
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing="-0.8px"
            textAlign="center"
            sx={{ mb: 8 }}
          >
            From idea to running agent in minutes
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            {steps.map((step) => (
              <Box key={step.num}>
                {/* Number badge */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: orangeGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  <Typography
                    sx={{ color: 'white', fontWeight: 800, fontSize: '0.82rem', letterSpacing: 0.5 }}
                  >
                    {step.num}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {step.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 4. Agent Builder + Templates ──────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 6,
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Agent Builder canvas */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4" fontWeight={800} letterSpacing="-0.8px" gutterBottom>
                Agent Builder
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start from scratch or pick a template on the right
              </Typography>

              {/* Builder canvas */}
              <Paper
                elevation={0}
                sx={{
                  border: '2px dashed #E5E7EB',
                  borderRadius: 4,
                  minHeight: 380,
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  mb: 3,
                  bgcolor: 'white',
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#FFF4ED',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: 32 }} />
                </Box>

                <Typography variant="subtitle1" fontWeight={700} color="text.secondary">
                  Design your agent
                </Typography>

                {/* Input fields */}
                <Box sx={{ width: '100%', maxWidth: 480 }}>
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      placeholder="Agent name..."
                      variant="outlined"
                      fullWidth
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: '#FAFAFA',
                        },
                      }}
                    />
                    <TextField
                      placeholder="Describe what this agent should do..."
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={agentDesc}
                      onChange={(e) => setAgentDesc(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: '#FAFAFA',
                        },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Model chips */}
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  {modelChips.map((chip) => (
                    <Button
                      key={chip}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: '#E5E7EB',
                        color: 'text.primary',
                        fontWeight: 600,
                        borderRadius: 5,
                        fontSize: '0.78rem',
                        py: 0.5,
                        px: 1.75,
                        '&:hover': { borderColor: '#C2612E', color: '#C2612E', bgcolor: '#FFF4ED' },
                      }}
                    >
                      {chip}
                    </Button>
                  ))}
                </Stack>

                {/* Create button */}
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{
                    background: orangeGradient,
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    '&:hover': { background: 'linear-gradient(180deg, #CA6228 0%, #A34818 100%)' },
                  }}
                >
                  + New Agent
                </Button>
              </Paper>

              {/* Quick config cards — 2x2 grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {[
                  { key: 'webSearch', emoji: '🔍', title: 'Web Search', desc: 'Browse live web pages' },
                  { key: 'fileUpload', emoji: '📁', title: 'File Upload', desc: 'Read PDFs & docs' },
                  { key: 'apiConnect', emoji: '🔗', title: 'API Connect', desc: 'Call external services' },
                  { key: 'memory', emoji: '🧠', title: 'Memory', desc: 'Remember past runs' },
                ].map((tool) => (
                  <Paper
                    key={tool.key}
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: 'white',
                      border: cardBorder,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography fontSize="1.25rem" lineHeight={1}>
                        {tool.emoji}
                      </Typography>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>
                          {tool.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tool.desc}
                        </Typography>
                      </Box>
                    </Box>
                    <Switch
                      size="small"
                      checked={tools[tool.key as keyof typeof tools]}
                      onChange={() => toggleTool(tool.key as keyof typeof tools)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#C2612E' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#C2612E' },
                      }}
                    />
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Right: Templates */}
            <Box sx={{ width: { xs: '100%', lg: 420 }, flexShrink: 0 }}>
              <Typography
                variant="overline"
                fontWeight={800}
                color="text.secondary"
                sx={{ letterSpacing: 1.5, display: 'block', mb: 2 }}
              >
                AGENT TEMPLATES
              </Typography>

              {/* Search */}
              <TextField
                size="small"
                placeholder="Search 18 templates..."
                variant="outlined"
                fullWidth
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'white',
                  },
                }}
              />

              {/* Template cards */}
              <Stack spacing={2}>
                {filteredTemplates.map((template) => (
                  <Paper
                    key={template.title}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'white',
                      border: cardBorder,
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'border-color 0.18s, box-shadow 0.18s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 4px 16px -4px rgba(194,97,46,0.14)',
                      },
                    }}
                  >
                    {/* Row 1: emoji + title + category */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 2,
                          bgcolor: template.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        {template.emoji}
                      </Box>
                      <Typography variant="body2" fontWeight={700} sx={{ flex: 1 }}>
                        {template.title}
                      </Typography>
                      <Chip
                        label={template.category}
                        size="small"
                        sx={{
                          bgcolor: 'grey.100',
                          color: 'text.secondary',
                          fontWeight: 600,
                          fontSize: '0.68rem',
                          height: 20,
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.6 }}>
                      {template.desc}
                    </Typography>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                      {template.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: 'grey.100',
                            color: 'text.primary',
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: 22,
                            borderRadius: 1.5,
                          }}
                        />
                      ))}
                    </Box>

                    {/* Use template link */}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        textAlign: 'right',
                        color: '#C2612E',
                        fontWeight: 700,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Use template →
                    </Typography>
                  </Paper>
                ))}

                {filteredTemplates.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
                    <Typography variant="body2">No templates match your search.</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── 5. Capabilities ───────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing="-0.8px"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            What your agents can do
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            {capabilities.map((cap) => (
              <Paper
                key={cap.title}
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  borderColor: '#E5E7EB',
                  bgcolor: 'white',
                  transition: 'box-shadow 0.18s',
                  '&:hover': {
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Typography fontSize="2rem" sx={{ mb: 1.5, display: 'block', lineHeight: 1 }}>
                  {cap.emoji}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {cap.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {cap.desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 6. Dark CTA Banner ────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#1A1A1A', py: 8 }}>
        <Container maxWidth="md">
          <Stack alignItems="center" spacing={2.5}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ color: 'white', textAlign: 'center', letterSpacing: '-0.8px' }}
            >
              Start building your first agent
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 460 }}
            >
              Join 2,400+ builders already automating with NexusAI agents. Free to start.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddIcon />}
                sx={{
                  background: orangeGradient,
                  color: 'white',
                  fontWeight: 700,
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': { background: 'linear-gradient(180deg, #CA6228 0%, #A34818 100%)' },
                }}
              >
                + Create Agent
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: 'white',
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                View all templates →
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
