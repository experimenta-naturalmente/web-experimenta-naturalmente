import { Box, styled } from '@mui/material';

export const TopBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '3rem',
  width: '100%',
  padding: '0 1rem',
  [theme.breakpoints.down('sm')]: {
    width: '100vw',
  },
}));
