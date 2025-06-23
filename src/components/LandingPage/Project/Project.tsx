/* eslint-disable @next/next/no-img-element */
import { projectDescription } from '@/utils/constants';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import DynamicLogo from '../../../assets/DynamicLogo.png';
import ProjectBoard from '../../../assets/ProjectBoard.png';
import Image from 'next/image';

export const Project = () => {
  const theme = useTheme();
  return (
    <Stack height={'160rem'} width={'100%'} justifyContent={'flex-end'}>
      <Stack height={'90%'} width={'100%'} justifyContent={'space-between'}>
        <Box
          display={'flex'}
          height={'40%'}
          width={'100%'}
          paddingLeft={'1.5rem'}
          justifyContent={'space-between'}
        >
          <Stack width={'55%'} gap={'1rem'}>
            <Box height={'15%'} />
            <Typography variant="h1" color={theme.palette.customPrimaryShades[600]}>
              Projeto
            </Typography>
            <Typography
              variant="body1"
              fontSize={'1.4rem'}
              color={theme.palette.neutrals.darkGrey}
              sx={{ whiteSpace: 'pre-line' }}
            >
              {projectDescription}
            </Typography>
          </Stack>
          <Image src={DynamicLogo} alt="dynamic logo" style={{ height: '100%', width: 'auto' }} />
        </Box>
        <img src={ProjectBoard.src} alt="project board" style={{ width: 'auto', height: '55%' }} />
      </Stack>
    </Stack>
  );
};
