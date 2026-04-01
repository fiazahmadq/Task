'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItemButton,
  Paper,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import modelsData from '../../data/models.json';
import { useStore } from '../../store/useStore';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import MicNoneIcon from '@mui/icons-material/MicNone';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BarChartIcon from '@mui/icons-material/BarChart';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StyleIcon from '@mui/icons-material/Style';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import { API_BASE_URL } from '@/lib/api';

const welcomeTiles = [
  { icon: '✍️', title: 'Write content', desc: 'Emails, posts, stories' },
  { icon: '🎨', title: 'Create images', desc: 'Art, photos, designs' },
  { icon: '🛠️', title: 'Build something', desc: 'Apps, tools, websites' },
  { icon: '⚡', title: 'Automate work', desc: 'Save hours every week' },
  { icon: '📊', title: 'Analyse data', desc: 'PDFs, sheets, reports' },
  { icon: '🔭', title: 'Just exploring', desc: "Show me what's possible" },
];

const welcomePrompts: Record<string, string> = {
  'Write content': 'Help me write high-converting content for my goal, including headline options and a polished final draft.',
  'Create images': 'Create a strong image prompt for my idea and recommend the best image model for quality and style control.',
  'Build something': 'Help me plan and build this project step by step, including architecture, implementation, and launch checklist.',
  'Automate work': 'Show me how to automate this workflow using AI, with tools, trigger logic, and an execution plan.',
  'Analyse data': 'Analyze this data task and provide key insights, trends, and recommended next actions.',
  'Just exploring': 'I am exploring AI options. Ask me a few simple questions and recommend the best models for my needs.',
};

const promptTabs = [
  'Monitor the situation',
  'Create a prototype',
  'Build a business plan',
  'Create content',
  'Analyze & research',
  'Learn something',
];

const leftSuggestions = [
  '• Help me find the best AI model for my project',
  '• Generate realistic images for my marketing campaign',
  '• Create AI agents for workflow automation',
];

const rightSuggestions = [
  '• I want to build an AI chatbot for my website',
  '• Analyse documents and extract key information',
  '• Add voice and speech recognition to my app',
];

const navTools = [
  { icon: <StorefrontIcon fontSize="small" />, label: 'Browse Marketplace' },
  { icon: <SmartToyIcon fontSize="small" />, label: 'Build an Agent' },
  { icon: <MenuBookIcon fontSize="small" />, label: 'How to use Guide' },
  { icon: <TipsAndUpdatesIcon fontSize="small" />, label: 'Prompt Engineering' },
  { icon: <AttachMoneyIcon fontSize="small" />, label: 'View Pricing' },
  { icon: <BarChartIcon fontSize="small" />, label: 'AI Models Analysis' },
];

const createTools = [
  { icon: <ImageOutlinedIcon fontSize="small" />, label: 'Create image' },
  { icon: <MusicNoteIcon fontSize="small" />, label: 'Generate Audio' },
  { icon: <VideoCallOutlinedIcon fontSize="small" />, label: 'Create video' },
  { icon: <SlideshowIcon fontSize="small" />, label: 'Create slides' },
  { icon: <BarChartIcon fontSize="small" />, label: 'Create Infographs' },
  { icon: <HelpOutlineIcon fontSize="small" />, label: 'Create quiz' },
  { icon: <StyleIcon fontSize="small" />, label: 'Create Flashcards' },
  { icon: <AccountTreeIcon fontSize="small" />, label: 'Create Mind map' },
];

const analyzeTools = [
  { icon: <AnalyticsIcon fontSize="small" />, label: 'Analyze Data' },
  { icon: <EditNoteIcon fontSize="small" />, label: 'Write content' },
  { icon: <CodeIcon fontSize="small" />, label: 'Code Generation' },
  { icon: <DescriptionIcon fontSize="small" />, label: 'Document Analysis' },
  { icon: <LanguageIcon fontSize="small" />, label: 'Translate' },
];

interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function QuickActionSection({
  label,
  items,
  onSelect,
}: {
  label: string;
  items: { icon: React.ReactNode; label: string }[];
  onSelect: (label: string) => void;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{ letterSpacing: '0.08em', display: 'block', mt: 2, mb: 0.5 }}
      >
        {label}
      </Typography>
      <List disablePadding>
        {items.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => onSelect(item.label)}
            sx={{
              borderRadius: 2,
              mb: 0.3,
              py: 0.8,
              px: 1.5,
              '&:hover': { bgcolor: '#FFF4ED' },
            }}
          >
            <Box sx={{ color: 'text.secondary', display: 'flex', mr: 1.5 }}>
              {item.icon}
            </Box>
            <Typography variant="body2">{item.label}</Typography>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default function ChatHub() {
  const { activeModelId, setActiveModelId, chatMessages, addChatMessage } = useStore();
  const [input, setInput] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [clientSessionId, setClientSessionId] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const activeModel = modelsData.find((m) => m.id === activeModelId) || modelsData[0];

  useEffect(() => {
    const existing = window.localStorage.getItem('nexus_session_id');
    if (existing) {
      setClientSessionId(existing);
      return;
    }
    const created = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem('nexus_session_id', created);
    setClientSessionId(created);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q && chatMessages.length === 0) {
      setInput(q);
    }
  }, [chatMessages.length]);

  const filteredModels = modelsData.filter(
    (m) =>
      m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
      m.provider.toLowerCase().includes(modelSearch.toLowerCase()),
  );

  const handleSend = async (messageOverride?: string) => {
    const userMessage = (messageOverride ?? input).trim();
    if (!userMessage) return;
    addChatMessage({ role: 'user', content: userMessage });
    setInput('');

    try {
      const token =
        typeof window !== 'undefined' ? window.localStorage.getItem('nexus_auth_token') : null;
      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...(token ? { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } } : {}),
        body: JSON.stringify({
          modelId: activeModel.id,
          message: userMessage,
          sessionId: clientSessionId,
          attachments: [],
        }),
      });

      if (!response.ok || !response.body) throw new Error('Chat backend unavailable');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partial = '';
      let aiMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        partial += decoder.decode(value, { stream: true });
        const events = partial.split('\n\n');
        partial = events.pop() ?? '';

        events.forEach((rawEvent) => {
          const dataLine = rawEvent.split('\n').find((line) => line.startsWith('data: '));
          if (!dataLine) return;
          try {
            const payload = JSON.parse(dataLine.replace('data: ', '')) as Record<string, unknown>;
            const token =
              (typeof payload.token === 'string' && payload.token) ||
              (typeof payload.content === 'string' && payload.content) ||
              (typeof payload.text === 'string' && payload.text) ||
              '';
            if (token) aiMessage += token;
          } catch {
            // Ignore malformed SSE chunks and continue
          }
        });
      }

      addChatMessage({
        role: 'ai',
        content: aiMessage || `I am ${activeModel.name}. I received your message.`,
      });
    } catch {
      addChatMessage({
        role: 'ai',
        content: `I am ${activeModel.name}. This is a simulated response to: "${userMessage}"`,
      });
    }
  };

  const handleVoiceInput = () => {
    const speechApi = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SpeechRecognition = speechApi.SpeechRecognition || speechApi.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addChatMessage({ role: 'ai', content: 'Voice input is not supported in this browser.' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);

    recognition.onresult = (event: SpeechRecognitionResultEventLike) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript.trim()) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => {
      addChatMessage({ role: 'ai', content: 'Voice capture failed. Please try again.' });
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleFileChosen = (event: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const names = Array.from(files)
      .map((file) => file.name)
      .join(', ');
    addChatMessage({
      role: 'user',
      content: `${type === 'image' ? 'Selected image' : 'Uploaded file'}: ${names}`,
    });
    event.target.value = '';
  };

  const quickActionPrompts: Record<string, string> = {
    'Browse Marketplace': 'Help me browse the marketplace and shortlist the top 5 models for my use case.',
    'Build an Agent': 'Help me design an AI agent workflow, including model choice, tools, and deployment steps.',
    'How to use Guide': 'Give me a simple beginner guide for using NexusAI effectively.',
    'Prompt Engineering': 'Teach me prompt engineering with practical examples for my current goal.',
    'View Pricing': 'Compare pricing for the best models for my task and suggest the most cost-effective option.',
    'AI Models Analysis': 'Analyze and compare top models for quality, speed, and cost for my requirements.',
    'Create image': 'Create an image prompt for my project and suggest the best image model to use.',
    'Generate Audio': 'Generate an audio/voice script and recommend the best audio model for production quality.',
    'Create video':
      'I want to create a video from a text idea. Please help me write a detailed script, suggest the best video model (Sora or Veo), and break scenes into visual descriptions.',
    'Create slides': 'Create a slide deck outline from my topic with title, agenda, and key bullet points.',
    'Create Infographs': 'Create an infographic concept with key sections, data points, and visual hierarchy.',
    'Create quiz': 'Generate a quiz with difficulty levels, answers, and short explanations.',
    'Create Flashcards': 'Create concise flashcards from my topic with question-answer format.',
    'Create Mind map': 'Create a mind map structure with main branches and subtopics.',
    'Analyze Data': 'Analyze my data and provide key insights, trends, and recommended next actions.',
    'Write content': 'Write high-quality content for my topic with clear structure and engaging tone.',
    'Code Generation': 'Generate production-ready code for my requirement with explanation and best practices.',
    'Document Analysis': 'Analyze my document and extract summary, key points, risks, and action items.',
    Translate: 'Translate my text while preserving tone and context. Also suggest localization improvements.',
  };

  const handleQuickActionSelect = (label: string) => {
    const prompt = quickActionPrompts[label] ?? `Help me with: ${label}`;
    setInput(prompt);
  };

  const handleWelcomeTileSelect = (title: string) => {
    const prompt = welcomePrompts[title] ?? `Help me with: ${title}`;
    void handleSend(prompt);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left Sidebar — Models */}
        <Box
          sx={{
            width: 200,
            borderRight: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            flexShrink: 0,
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="overline" fontWeight={700} color="text.secondary">
              MODELS
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search 525 models..."
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Box>
          <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
            {filteredModels.map((model) => (
              <ListItemButton
                key={model.id}
                selected={activeModelId === model.id}
                onClick={() => setActiveModelId(model.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 1.5,
                  py: 0.75,
                  '&.Mui-selected': {
                    bgcolor: '#FFF4ED',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#FFF4ED' },
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', minWidth: 0 }}>
                  <Typography sx={{ fontSize: '1rem', flexShrink: 0 }}>{model.icon}</Typography>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      sx={{ color: activeModelId === model.id ? 'primary.main' : 'inherit' }}
                    >
                      {model.name}{' '}
                      <Box component="span" sx={{ color: '#22C55E' }}>
                        •
                      </Box>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {model.provider}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Center — Chat Area */}
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: '#F4F2EE',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Message area or welcome card */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, pt: 3 }}>
            <Box sx={{ maxWidth: 700, mx: 'auto' }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1px solid #E5E7EB',
                  p: 5,
                  mt: 3,
                  textAlign: 'center',
                  bgcolor: 'white',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1.5px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <AddIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} mb={1}>
                  Welcome! I&apos;m here to help you 👋
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  No tech background needed. Tell me what you&apos;d like to achieve — I&apos;ll help you discover what&apos;s possible, step by step.
                </Typography>
                <Divider />
                <Typography variant="overline" fontWeight={700} color="primary.main" display="block" mt={2} mb={1.5}>
                  ✨ WHAT WOULD YOU LIKE TO DO TODAY?
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                  {welcomeTiles.map((tile) => (
                    <Paper
                      key={tile.title}
                      variant="outlined"
                      onClick={() => handleWelcomeTileSelect(tile.title)}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.light' },
                      }}
                    >
                      <Typography variant="h4" mb={1}>{tile.icon}</Typography>
                      <Typography variant="body2" fontWeight={700}>{tile.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{tile.desc}</Typography>
                    </Paper>
                  ))}
                </Box>
                <Typography variant="caption" color="text.disabled" display="block" mt={3}>
                  Or type anything below — there are no wrong answers ↓
                </Typography>
              </Paper>

              {chatMessages.length > 0 && (
                <Box sx={{ mt: 2.5 }}>
                {chatMessages.map((msg, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    mb={2}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        borderRadius: 3,
                        bgcolor: msg.role === 'user' ? 'grey.100' : 'white',
                        border: msg.role === 'ai' ? '1px solid #E5E7EB' : 'none',
                      }}
                    >
                      <Typography variant="body1">{msg.content}</Typography>
                    </Paper>
                  </Box>
                ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Bottom Input Area */}
          <Box
            sx={{
              mt: 'auto',
              bgcolor: 'white',
              borderTop: '1px solid #E5E7EB',
              px: 3,
              py: 2,
            }}
          >
            {/* Input Paper */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #E5E7EB',
                p: 2,
                mb: 2,
                bgcolor: 'white',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                multiple
                onChange={(e) => handleFileChosen(e, 'file')}
              />
              <input
                ref={imageInputRef}
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e) => handleFileChosen(e, 'image')}
              />
              <TextField
                fullWidth
                multiline
                maxRows={4}
                variant="standard"
                placeholder="Describe your project, ask a question, or just say hi — I'm here to help..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '0.95rem', px: 1 },
                }}
              />

              {/* Icon row */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                {/* Left icons */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    sx={{ color: isListening ? 'primary.main' : 'text.disabled' }}
                    onClick={handleVoiceInput}
                    aria-label="Voice input"
                  >
                    <MicNoneIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.disabled' }}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload file"
                  >
                    <FileUploadOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.disabled' }}>
                    <VideoCallOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.disabled' }}>
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.disabled' }}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach file"
                  >
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: 'text.disabled' }}
                    onClick={() => imageInputRef.current?.click()}
                    aria-label="Upload image"
                  >
                    <ImageOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.disabled' }}>
                    <AddCircleOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Right side */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ color: 'text.secondary', textTransform: 'none', mr: 1 }}
                  >
                    {activeModel.name} ▾
                  </Button>
                  <IconButton
                    onClick={handleSend}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 36,
                      height: 36,
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Paper>

            {/* Prompt tabs row */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                mb: 2,
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <Button
                variant="contained"
                size="small"
                disableElevation
                sx={{
                  borderRadius: 6,
                  bgcolor: '#111',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                Use cases
              </Button>
              {promptTabs.map((tab) => (
                <Button
                  key={tab}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    color: 'text.secondary',
                    borderColor: '#E5E7EB',
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>

            {/* Suggestion rows */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0.5,
                px: 1,
              }}
            >
              <Box>
                {leftSuggestions.map((s) => (
                  <Typography
                    key={s}
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={() => setInput(s)}
                  >
                    {s}
                  </Typography>
                ))}
              </Box>
              <Box>
                {rightSuggestions.map((s) => (
                  <Typography
                    key={s}
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={() => setInput(s)}
                  >
                    {s}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right Sidebar — Quick Actions */}
        <Box
          sx={{
            width: 240,
            bgcolor: '#FAFAFA',
            borderLeft: '1px solid #E5E7EB',
            p: 2,
            overflowY: 'auto',
            flexShrink: 0,
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <Typography variant="overline" fontWeight={700} color="text.secondary">
            QUICK ACTIONS
          </Typography>

          <QuickActionSection label="NAVIGATION & TOOLS:" items={navTools} onSelect={handleQuickActionSelect} />
          <QuickActionSection label="CREATE & GENERATE:" items={createTools} onSelect={handleQuickActionSelect} />
          <QuickActionSection label="ANALYZE & WRITE:" items={analyzeTools} onSelect={handleQuickActionSelect} />
        </Box>
      </Box>
    </Box>
  );
}
