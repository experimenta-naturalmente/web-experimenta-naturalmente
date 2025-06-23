import { ListItem, Typography, useTheme } from '@mui/material';
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
    <ListItem
      sx={{
        flexDirection: 'column',
        gap: '0.2rem',
        borderRadius: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: '14rem',
        height: '14rem',
        padding: '2.5rem',
        margin: '0',
        backgroundColor:
          variant === 'light'
            ? theme.palette.customPrimaryShades[200]
            : variant === 'lightNormal'
              ? theme.palette.customPrimaryShades[300]
              : variant === 'darkNormal'
                ? theme.palette.customPrimaryShades[500]
                : theme.palette.customPrimaryShades[700],
        color:
          variant === 'light'
            ? theme.palette.customPrimaryShades[500]
            : variant === 'lightNormal'
              ? theme.palette.customPrimaryShades[700]
              : variant === 'darkNormal'
                ? theme.palette.customPrimaryShades[200]
                : theme.palette.customPrimaryShades[300],
      }}
    >
      <Icon sx={{ fontSize: '4rem' }} />
      <Typography variant="h3" fontWeight={700}>
        {title}
      </Typography>
      <Typography
        sx={{ textAlign: 'center' }}
        color={
          variant === 'light' || variant === 'lightNormal'
            ? theme.palette.neutrals.baseBlack
            : theme.palette.neutrals.baseWhite
        }
      >
        {text}
      </Typography>
    </ListItem>
  );
};
