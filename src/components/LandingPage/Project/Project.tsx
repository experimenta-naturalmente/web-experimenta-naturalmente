/* eslint-disable @next/next/no-img-element */
import { projectDescription } from '@/utils/constants';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import DynamicLogo from '../../../assets/DynamicLogo.svg';
import ProjectBoard from '../../../assets/ProjectBoard.svg';

export const Project = () => {
  const theme = useTheme();
  return (
    <Stack height={'120rem'} width={'100%'} justifyContent={'flex-end'} marginTop={'8rem'}>
      <Stack height={'88%'} width={'100%'} justifyContent={'space-between'}>
        <Box
          display={'flex'}
          height={'32%'}
          width={'100%'}
          paddingLeft={'1.5rem'}
          justifyContent={'space-between'}
        >
          <Stack width={'56%'} gap={'2rem'}>
            <Box height={'8%'} />
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
          <DynamicLogo />
        </Box>
        <ProjectBoard alt="project board" />
      </Stack>
    </Stack>
  );
};
