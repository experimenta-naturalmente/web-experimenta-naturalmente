import { Box, styled } from '@mui/material';

export const TopBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0.3rem 0.25rem', // padding top e bottom reduzido
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1100, // acima do conteúdo padrão
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  background: 'rgba(0,0,0,0.55)', // glass preto translúcido
  borderBottom: '1px solid rgba(0,0,0,0.18)',
  boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
  transition: 'background 0.3s',
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
    padding: '0.25rem 0.125rem',
  },
}));
