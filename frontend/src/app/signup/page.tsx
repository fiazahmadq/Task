'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { API_BASE_URL } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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

  const nameError = useMemo(() => {
    if (!name) return null;
    return name.trim().length >= 2 ? null : 'Name must be at least 2 characters';
  }, [name]);

  const canSubmit = !!name && !!email && !!password && !emailError && !passwordError && !nameError && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      const json = (await res.json()) as { error?: { message?: string }; data?: unknown };
      if (!res.ok) throw new Error(json.error?.message ?? 'Signup failed');

      router.push(`/login?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
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
              Create account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get started in under a minute. No credit card required.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2.1}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                fullWidth
                error={!!nameError}
                helperText={nameError ?? ' '}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
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
                autoComplete="new-password"
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
                {submitting ? 'Creating…' : 'Create account'}
              </Button>

              <Divider />

              <Typography variant="body2" color="text.secondary" textAlign="center">
                Already have an account?{' '}
                <Typography component={Link} href="/login" variant="body2" sx={{ color: 'primary.main', fontWeight: 800, textDecoration: 'none' }}>
                  Sign in
                </Typography>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

