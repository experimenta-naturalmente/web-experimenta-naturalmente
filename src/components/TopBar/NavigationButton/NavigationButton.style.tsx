import { Button, styled } from '@mui/material';

export const CustomNavigationButton = styled(Button)(({ theme }) => ({
  border: 'none',
  color: theme.palette.neutrals.baseWhite,
  ...theme.typography.smallButton,
}));
