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
    <Stack width={'100%'} height={'70%'} justifyContent={'center'} alignItems={'center'}>
      <Box
        display={'flex'}
        width={'100%'}
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Stack width={'auto'} height={'70%'} gap={'2rem'}>
          <Image src={Cellphone} alt="Foto exemplo" style={{ width: '100%', height: '100%' }} />
          <Box
            width={'100%'}
            height={'auto'}
            display={'flex'}
            justifyContent={'center'}
            marginLeft={'2.5rem'}
          >
            <Image src={Shadow} alt="Foto exemplo" style={{ width: '70%', height: 'auto' }} />
          </Box>
        </Stack>
        <Stack gap={'1.5rem'} alignItems={'center'} width={'28%'} height={'75%'}>
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
          >
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              textAlign={'right'}
              sx={{ ineHeight: 0.1 }}
            >
              Não é um empreendedor ou deseja conhecer mais sobre nosso aplicativo e todas as opções
              de turismo rural em São Francisco de Paula?
            </Typography>
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              textAlign={'right'}
              sx={{ ineHeight: 1.2 }}
            >
              Baixe o app e surpreenda-se ao conhecer todos os diferentes eventos, serviços, rotas e
              pontos turísticos que esperam por você na cidade de São Chico!
            </Typography>
            <Box display={'flex'} width={'100%'} gap={'0.6rem'} justifyContent={'flex-end'}>
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
