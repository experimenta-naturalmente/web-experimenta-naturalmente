import { Stack, Typography, useTheme } from '@mui/material';
import { ElementType } from 'react';

export interface IProps {
  variant: 'light' | 'lightNormal' | 'darkNormal' | 'dark';
  Icon: ElementType;
  title: string;
  text: string;
}

export const AppCard = ({ variant, Icon, title, text }: IProps) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        gap: '0.2rem',
        borderRadius: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: '14rem',
        height: '14rem',
        padding: '2.5rem',
        backgroundColor:
          variant === 'light'
            ? theme.palette.primary[200]
            : variant === 'lightNormal'
              ? theme.palette.primary[300]
              : variant === 'darkNormal'
                ? theme.palette.primary[500]
                : theme.palette.primary[700],
        color:
          variant === 'light'
            ? theme.palette.primary[500]
            : variant === 'lightNormal'
              ? theme.palette.primary[700]
              : variant === 'darkNormal'
                ? theme.palette.primary[200]
                : theme.palette.primary[300],
      }}
    >
      <Icon sx={{ fontSize: '4rem' }} />
      <Typography variant="h3" fontWeight={700}>
        {title}
      </Typography>
      <Typography
        sx={{ textAlign: 'center' }}
        variant="body3"
        color={
          variant === 'light' || variant === 'lightNormal'
            ? theme.palette.neutrals.baseBlack
            : theme.palette.neutrals.baseWhite
        }
      >
        {text}
      </Typography>
    </Stack>
  );
};
