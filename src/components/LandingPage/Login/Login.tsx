import { Stack, Typography, useTheme } from '@mui/material';
import backgroundImg from '@/assets/Background.png'; // Importando a imagem de fundo
import React from 'react';
import { TopBar } from '../../TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';

export const Login = () => {
  const theme = useTheme();
  return (
    <Stack
      width="100%"
      height="75rem"
      padding={'1.5rem'}
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <TopBar />
      <Stack width={'45%'} height={'90%'} gap={'1.5rem'} justifyContent={'center'}>
        <Typography variant="h2" color={theme.palette.neutrals.baseWhite}>
          Cadastre-se agora e comece a divulgar o seu negócio.
        </Typography>
        <Stack width={'60%'} gap={'1rem'}>
          <Typography variant="body2" color={theme.palette.neutrals.baseWhite}>
            Ou baixe nosso aplicativo para explorar as maravilhas de São Francisco de Paula equanto
            contribui para o crescimento do turismo e da economia local.
          </Typography>
          <GradientRoundButton
            sx={{
              width: '50%',
              height: '10%rem',
              fontWeight: 500,
              fontSize: '1.2rem',
            }}
          >
            Baixe o App
          </GradientRoundButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
