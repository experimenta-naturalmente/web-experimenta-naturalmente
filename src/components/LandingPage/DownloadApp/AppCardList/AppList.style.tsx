import { List, styled } from '@mui/material';

export const AppList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  gap: '1.5rem',
  padding: '0',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
}));
