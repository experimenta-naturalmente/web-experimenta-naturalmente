import { Box, styled } from '@mui/material';

export const TopBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '3rem',
  width: '100%',
  padding: '0 1rem',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1100, // acima do conteúdo padrão
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  background: 'rgba(255,255,255,0.7)',
  borderBottom: '1px solid rgba(255,255,255,0.3)',
  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
  transition: 'background 0.3s',
  // Suporte a dark mode
  [theme.palette.mode === 'dark' ? '&' : '']: {
    background: 'rgba(30,30,30,0.6)',
    borderBottom: '1px solid rgba(30,30,30,0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
  },
}));
