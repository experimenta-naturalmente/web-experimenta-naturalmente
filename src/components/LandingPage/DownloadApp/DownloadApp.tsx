import Box from '@mui/material/Box';
import { Button, Stack, Typography, useTheme } from '@mui/material';

import React from 'react';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import { AppCardList } from './AppCardList/AppCardList';
import { AppDescription } from './AppDescription/AppDescription';

export const DownloadApp = () => {
  const theme = useTheme();
  return (
    <Stack width={'100%'} height={'100rem'} justifyContent={'space-between'}>
      <AppDescription />
      <Stack gap={'4rem'} height={'20%'}>
        <AppCardList />
        <Stack width={'100%'} height={'auto'} alignItems={'center'} gap={'2rem'}>
          <Stack width={'100%'} height={'fit-content'} alignItems={'center'}>
            <Box display={'flex'} alignItems={'center'}>
              <Button
                disableRipple
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color={theme.palette.customPrimaryShades[300]}
                  fontWeight={700}
                  sx={{
                    textDecoration: 'underline',
                    textTransform: 'none',
                    lineHeight: '1.2',
                  }}
                >
                  Baixe o app
                </Typography>
              </Button>
              <Typography
                variant="body2"
                color={theme.palette.neutrals.darkGrey}
                textAlign={'center'}
                sx={{ lineHeight: 1.2 }}
              >
                para começar a descobir São Chico ou se for um empreendedor
              </Typography>
            </Box>
            <Typography
              variant="h2"
              fontWeight={600}
              color={theme.palette.neutrals.baseBlack}
              sx={{ lineHeight: '1.2' }}
            >
              Cadastre seu negócio pelo site
            </Typography>
          </Stack>
          <GradientRoundButton
            sx={{
              width: '15%',
              height: '3.5rem',
              fontSize: '1.3rem',
              fontWeight: 500,
              fontFamily: theme.typography.body1.fontFamily,
            }}
          >
            Cadastrar
          </GradientRoundButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
