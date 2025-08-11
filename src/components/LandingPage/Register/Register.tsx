import { Stack, Typography, useTheme } from '@mui/material';
import backgroundImg from '@/assets/BackgroundRegister.png'; // Importando a imagem de fundo
import React from 'react';
import { TopBar } from '../../TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';

export const Register = () => {
  const theme = useTheme();
  return (
    <Stack
      width="100%"
      height="100vh"
      padding={'1.5rem'}
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <TopBar isRegister={true} />
      <Stack
        width={'45%'}
        height={'90%'}
        gap={'1.5rem'}
        justifyContent={'center'}
        alignSelf={'center'}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: '#fff9f1',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '1rem',
            borderRadius: '1rem',
          }}
        >
          <Typography variant="h3" color={theme.palette.neutrals.darkGrey} fontWeight={700}>
            Cadastre seu negócio
          </Typography>
          <Stack width={'60%'} gap={'1rem'}>
            <Typography variant="body2" color={theme.palette.neutrals.darkGrey}>
              Ganhe visibilidade, cadastre seu negócio no Experimenta São Chico
            </Typography>
            <GradientRoundButton
              sx={{
                width: '15rem',
                height: '2.5rem',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Cadastrar
            </GradientRoundButton>
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
};
