'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Navbar from '@/components/layout/Navbar';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const presetEmail = search.get('email') ?? '';

  const [email, setEmail] = useState(presetEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    return /^\S+@\S+\.\S+$/.test(email) ? null : 'Enter a valid email';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return password.length >= 8 ? null : 'Password must be at least 8 characters';
  }, [password]);

  const canSubmit = !!email && !!password && !emailError && !passwordError && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await login(email.trim(), password);
      window.localStorage.setItem('nexus_auth_token', result.token);
      router.push('/chat');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F2EE' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 9 } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid #E5E7EB',
            p: { xs: 3, sm: 4 },
            bgcolor: 'white',
            boxShadow: '0 24px 70px -30px rgba(17,17,17,0.28)',
          }}
        >
          <Stack spacing={1.5} mb={3}>
            <Typography variant="h4" fontWeight={900} letterSpacing="-0.8px">
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back. Continue to your personalised hub.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.1}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                fullWidth
                error={!!emailError}
                helperText={emailError ?? ' '}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <TextField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                fullWidth
                error={!!passwordError}
                helperText={passwordError ?? ' '}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography variant="body2" sx={{ color: '#B91C1C', fontWeight: 600 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                disabled={!canSubmit}
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: 999,
                  py: 1.25,
                  fontWeight: 900,
                  textTransform: 'none',
                  background: 'linear-gradient(180deg, #D46F35 0%, #B3511D 100%)',
                  '&:hover': { background: 'linear-gradient(180deg, #CA6228 0%, #A34818 100%)' },
                }}
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </Button>

              <Divider />

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Don&apos;t have an account?{' '}
                <Typography component={Link} href="/signup" variant="body2" sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none' }}>
                  Create one
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

