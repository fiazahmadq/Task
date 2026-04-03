'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DiamondIcon from '@mui/icons-material/Diamond';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LanguageCode } from '@/i18n/translations';

const navItems = [
  { key: 'nav.chatHub', path: '/chat' },
  { key: 'nav.marketplace', path: '/marketplace' },
  { key: 'nav.agents', path: '/agents' },
  { key: 'nav.discoverNew', path: '/discover' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileNavAnchor, setMobileNavAnchor] = useState<null | HTMLElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const openLang = Boolean(anchorEl);
  const openMobileNav = Boolean(mobileNavAnchor);
  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
  const handleLangClose = () => { setAnchorEl(null); };
  const handleMobileNavOpen = (event: React.MouseEvent<HTMLElement>) => { setMobileNavAnchor(event.currentTarget); };
  const handleMobileNavClose = () => { setMobileNavAnchor(null); };

  const languages = [
    { code: 'SA', name: 'العربية' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'ES', name: 'Español' },
    { code: 'BR', name: 'Português' },
    { code: 'CN', name: '中文' },
    { code: 'JP', name: '日本語' },
    { code: 'KR', name: '한국어' },
    { code: 'IN', name: 'हिन्दी' },
    { code: 'PK', name: 'اردو' },
    { code: 'TR', name: 'Türkçe' },
    { code: 'RU', name: 'Русский' },
    { code: 'IT', name: 'Italiano' },
    { code: 'NL', name: 'Nederlands' },
  ];

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    handleLangClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'transparent',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backdropFilter: 'blur(8px)',
        pt: 1,
        pb: 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" component={Link} href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 0.5, 
              borderRadius: 1.5, 
              display: 'flex', 
              mr: 1 
            }}
          >
            <DiamondIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="bold" letterSpacing="-0.5px" color="text.primary">
            NexusAI
          </Typography>
        </Box>

        {/* Mobile nav button */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
          onClick={openMobileNav ? handleMobileNavClose : handleMobileNavOpen}
          aria-label={openMobileNav ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {openMobileNav ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Center Nav Links */}
        <Stack direction="row" spacing={3} display={{ xs: 'none', md: 'flex' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
            return (
              <Button 
                key={item.key}
                component={Link}
                href={item.path}
                sx={{ 
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 600 : 500,
                  bgcolor: isActive ? 'primary.light' : 'transparent',
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  '&:hover': {
                    bgcolor: isActive ? 'primary.light' : 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                {t(item.key as 'nav.chatHub' | 'nav.marketplace' | 'nav.agents' | 'nav.discoverNew')}
              </Button>
            );
          })}
        </Stack>
        <Menu
          anchorEl={mobileNavAnchor}
          open={openMobileNav}
          onClose={handleMobileNavClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              width: 220,
              mt: 1,
            },
          }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.key}
              component={Link}
              href={item.path}
              onClick={handleMobileNavClose}
              sx={{
                bgcolor: pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/') ? 'rgba(25,118,210,0.08)' : 'transparent',
                color: pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/') ? 'primary.main' : 'text.primary',
              }}
            >
              {t(item.key as 'nav.chatHub' | 'nav.marketplace' | 'nav.agents' | 'nav.discoverNew')}
            </MenuItem>
          ))}
        </Menu>
        {/* Right Actions */}
        <Stack direction="row" spacing={2} alignItems="center">
          <>
            <Button 
              onClick={handleLangClick}
              variant="outlined" 
              size="small"
              startIcon={<LanguageIcon fontSize="small" />}
              endIcon={<KeyboardArrowDownIcon fontSize="small" />}
              sx={{ 
                borderColor: openLang ? 'primary.main' : '#E5E7EB', 
                color: openLang ? 'primary.main' : 'text.primary',
                bgcolor: openLang ? '#FFF4ED' : 'transparent',
                borderRadius: 6,
                px: { xs: 1, sm: 2 },
                minWidth: 0,
                display: { xs: 'none', sm: 'flex'},
                '&:hover': { bgcolor: openLang ? '#FFF4ED' : 'rgba(0,0,0,0.04)', borderColor: openLang ? 'primary.main' : '#E5E7EB' }
              }}
            >
              {language}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openLang}
              onClose={handleLangClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflowX: 'visible',
                  overflowY: 'auto',
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 200,
                  maxHeight: 400,
                  border: '1px solid #E5E7EB'
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ px: 2, pt: 1, pb: 0.5, display: 'block', lineHeight: 1 }}>
                {t('lang.appLanguage')}
              </Typography>
              <Divider sx={{ mb: 0 }} />
              <MenuItem
                onClick={() => handleLanguageSelect('US')}
                sx={{
                  bgcolor: language === 'US' ? '#FFF4ED' : 'transparent',
                  color: language === 'US' ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: language === 'US' ? '#FFF4ED' : 'rgba(0,0,0,0.04)' },
                  py: 1.5,
                }}
              >
                <Typography variant="caption" fontWeight={800} sx={{ mr: 1, width: 20 }}>US</Typography>
                <Typography variant="body2" fontWeight={language === 'US' ? 700 : 500}>English</Typography>
              </MenuItem>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code as LanguageCode)}
                  sx={{
                    color: language === lang.code ? 'primary.main' : 'text.secondary',
                    bgcolor: language === lang.code ? '#FFF4ED' : 'transparent',
                    '&:hover': { bgcolor: language === lang.code ? '#FFF4ED' : 'rgba(0,0,0,0.04)' },
                    py: 1.5,
                  }}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ mr: 1, width: 20 }}>{lang.code}</Typography>
                  <Typography variant="body2" fontWeight={language === lang.code ? 700 : 500}>{lang.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
          <Button 
            component={Link}
            href="/login"
            variant="outlined" 
            sx={{ 
              borderColor: '#E5E7EB', 
              color: 'text.primary',
              borderRadius: 6,
              px: 3,
              display: { xs: 'none', sm: 'flex'},
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {t('nav.signIn')}
          </Button>
          <Button 
            component={Link}
            href="/signup"
            variant="contained" 
            disableElevation
            sx={{ 
              borderRadius: 6,
              px: 3,
              background: 'linear-gradient(180deg, #D46F35 0%, #B3511D 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(180deg, #CA6228 0%, #A34818 100%)',
              }
            }}
          >
            {t('nav.tryFree')}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
