import { Box, Stack, Typography, useTheme } from '@mui/material';
import { DownloadAppButton } from './DowloadAppButton/DownloadAppButton';
import Image from 'next/image';
import Cellphone from '../../../../assets/Cellphone.png';
import Shadow from '../../../../assets/Shadow.png';
import GooglePlayIcon from '../../../../assets/GooglePlayIcon.png';
import AppStoreIcon from '../../../../assets/AppStoreIcon.png';

export const AppDescription = () => {
  const theme = useTheme();
  return (
    <Stack
      width={'100%'}
      height={'70%'}
      justifyContent={'center'}
      alignItems={'center'}
      sx={{
        [theme.breakpoints.down('sm')]: {
          height: 'auto',
          paddingX: '1rem',
        },
      }}
    >
      <Box
        display={'flex'}
        width={'100%'}
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            gap: '1rem',
          },
        }}
      >
        <Stack
          width={'auto'}
          height={'70%'}
          gap={'2rem'}
          sx={{
            [theme.breakpoints.down('sm')]: {
              width: '70%',
              height: 'auto',
              gap: '1rem',
            },
          }}
        >
          <Image src={Cellphone} alt="Foto exemplo" style={{ width: '100%', height: '100%' }} />
          <Box
            width={'100%'}
            height={'auto'}
            display={'flex'}
            justifyContent={'center'}
            marginLeft={'2.5rem'}
            sx={{
              [theme.breakpoints.down('sm')]: {
                marginLeft: 0,
              },
            }}
          >
            <Image
              src={Shadow}
              alt="Foto exemplo"
              style={{ width: '70%', height: 'auto' }}
            />
          </Box>
        </Stack>
        <Stack
          gap={'1.5rem'}
          alignItems={'center'}
          width={'28%'}
          height={'75%'}
          sx={{
            [theme.breakpoints.down('sm')]: {
              width: '100%',
              height: 'auto',
            },
          }}
        >
          <Box height={'10%'} />
          <Typography variant="h1" color={theme.palette.customPrimaryShades[600]}>
            Baixe o App
          </Typography>
          <Stack
            width={'90%'}
            alignSelf={'flex-end'}
            height={'auto'}
            justifyContent={'flex-end'}
            gap={'1.5rem'}
            sx={{
              [theme.breakpoints.down('sm')]: {
                width: '100%',
                alignSelf: 'auto',
                gap: '1rem',
              },
            }}
          >
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              textAlign={'right'}
              sx={{ ineHeight: 0.1,  [theme.breakpoints.down('sm')]: { textAlign: 'center' } }}
              
            >
              Não é um empreendedor ou deseja conhecer mais sobre nosso aplicativo e todas as opções
              de turismo rural em São Francisco de Paula?
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              textAlign={'right'}
              sx={{ ineHeight: 1.2, [theme.breakpoints.down('sm')]: { textAlign: 'center' } }}
            >
              Baixe o app e surpreenda-se ao conhecer todos os diferentes eventos, serviços, rotas e
              pontos turísticos que esperam por você na cidade de São Chico!
            </Typography>
            <Box
              display={'flex'}
              width={'100%'}
              gap={'0.6rem'}
              justifyContent={'flex-end'}
              sx={{
                [theme.breakpoints.down('sm')]: {
                  justifyContent: 'center',
                },
              }}
            >
              <DownloadAppButton
                icon={GooglePlayIcon.src}
                title={'Google Play'}
                subtitle={'GET IT ON'}
                url={'aaaa'}
              />
              <DownloadAppButton
                icon={AppStoreIcon.src}
                title={'Apple Store'}
                subtitle={'Available on the'}
                url={'aaaa'}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};
