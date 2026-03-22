import { Box, styled } from '@mui/material';

export const TopBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: '4rem',
  position: 'fixed',
  padding: '0.25rem 1rem', // padding top e bottom
  top: 0,
  left: 0,
  zIndex: 1100, // acima do conteúdo padrão
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  background: 'rgba(0,0,0,0.55)', // glass preto translúcido
  borderBottom: '1px solid rgba(0,0,0,0.18)',
  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
  transition: 'background 0.3s',
  // Suporte a dark mode
  [theme.palette.mode === 'dark' ? '&' : '']: {
    background: 'rgba(30,30,30,0.6)',
    borderBottom: '1px solid rgba(30,30,30,0.3)',
  },
}));
