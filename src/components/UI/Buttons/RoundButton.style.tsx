import { Button, styled } from '@mui/material';

export const LightRoundButton = styled(Button)(({ theme }) => ({
  border: 'none',
  color: theme.palette.customPrimaryShades[500],
  backgroundColor: theme.palette.customPrimaryShades[100],
  ...theme.typography.mediumButton,
  borderRadius: '10rem',
  gap: '0.1rem',
  width: 'fit-content',
  height: 'fit-content',
  padding: '0.5rem 1rem',
}));

export const GradientRoundButton = styled(Button)(({ theme }) => ({
  border: 'none',
  color: theme.palette.neutrals.baseWhite,
  background: `linear-gradient(45deg, ${theme.palette.customPrimaryShades[600]} 30%, ${theme.palette.customPrimaryShades[400]} 90%)`,
  ...theme.typography.mediumButton,
  borderRadius: '10rem',
  gap: '0.1rem',
  width: 'fit-content',
  height: 'fit-content',
  padding: '0.5rem 1rem',
}));

export const GradientReverseRoundButton = styled(Button)(({ theme }) => ({
  border: 'none',
  color: theme.palette.primary[400],
  backgroundColor: theme.palette.neutrals.baseWhite,
  ...theme.typography.mediumButton,
  borderRadius: '10rem',
  gap: '0.1rem',
  width: 'fit-content',
  height: 'fit-content',
  padding: '0.5rem 1rem',
}));

export const ColoredRoundButton = styled(Button)(({ theme }) => ({
  border: 'none',
  color: theme.palette.neutrals.baseWhite,
  backgroundColor: theme.palette.customPrimaryShades[400],
  ...theme.typography.mediumButton,
  borderRadius: '10rem',
  gap: '0.1rem',
  width: 'fit-content',
  height: 'fit-content',
  padding: '0.5rem 1rem',
}));
