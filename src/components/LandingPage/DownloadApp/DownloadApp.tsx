import Box from '@mui/material/Box';
import { Button, Link, Stack, Typography, useTheme } from '@mui/material';

import React from 'react';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import { AppCardList } from './AppCardList/AppCardList';
import { AppDescription } from './AppDescription/AppDescription';

export const DownloadApp = () => {
  const theme = useTheme();
  return (
    <Stack
      width={'100%'}
      height={'80rem'}
      justifyContent={'space-between'}
      sx={{
        [theme.breakpoints.down('sm')]: {
          height: 'auto',
          gap: '2rem',
          width: '100vw',
        },
      }}
    >
      <AppDescription />
      <Stack gap={'4rem'} height={'20%'}>
        <AppCardList />
        <Stack
          width={'100%'}
          height={'auto'}
          alignItems={'center'}
          gap={'2rem'}
          sx={{
            [theme.breakpoints.down('sm')]: {
              gap: '1.25rem',
            },
          }}
        >
          <Stack width={'100%'} height={'fit-content'} alignItems={'center'}>
            <Box display={'flex'} alignItems={'center'}  sx={{
                 [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                 }
               }}>
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
                    lineHeight: '1.2'
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
              sx={{ lineHeight: '1.2', [theme.breakpoints.down('sm')]: { fontSize: '2rem', textAlign: 'center' } }}
            >
              Cadastre seu negócio pelo site
            </Typography>
          </Stack>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <GradientRoundButton
              sx={{
                width: '100%',
                height: '3.5rem',
                fontSize: '1.3rem',
                fontWeight: 500,
                fontFamily: theme.typography.body1.fontFamily,
                [theme.breakpoints.down('sm')]: {
                 width: '90vw',
                 fontSize: '1.2rem',
               },
              }}
            >
              Cadastrar
            </GradientRoundButton>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};
