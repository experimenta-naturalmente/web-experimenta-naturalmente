import { Stack } from '@mui/material';
import backgroundImg from '@/assets/Background.png'; // Importando a imagem de fundo
import React from 'react';
import { TopBar } from '../../TopBar/TopBar';
import { IntroductionSection } from './IntroductionSection';

export const Start = () => {
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
      <IntroductionSection />
    </Stack>
  );
};
