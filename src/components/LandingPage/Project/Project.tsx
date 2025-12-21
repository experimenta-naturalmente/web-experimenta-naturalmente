/* eslint-disable @next/next/no-img-element */
import { projectDescription } from '@/utils/constants';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import DynamicLogo from '../../../assets/DynamicLogo.svg';
import ProjectBoard from '../../../assets/ProjectBoard.svg';

export const Project = () => {
  const theme = useTheme();
  return (
    <Stack
      height={'120rem'}
      width={'100%'}
      justifyContent={'flex-end'}
      marginTop={'8rem'}
      sx={{
        [theme.breakpoints.down('sm')]: {
          height: 'auto',
          marginTop: '4rem',
          width: '100vw',
        },
      }}
    >
      <Stack height={'88%'} width={'100%'} justifyContent={'space-between'}>
        <Box
          display={'flex'}
          height={'32%'}
          width={'100%'}
          paddingLeft={'1.5rem'}
          justifyContent={'space-between'}
          position={'relative'}
          sx={{
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              gap: '1rem',
              paddingLeft: '1rem',
              alignItems: 'flex-start',
            },
          }}
        >
          {/* DynamicLogo as background */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingRight: '1.5rem',
              [theme.breakpoints.down('sm')]: {
                justifyContent: 'center',
                paddingRight: 0,
                bottom: '-2rem',
              },
            }}
          >
            <DynamicLogo />
          </Box>
          <Stack
            width={'56%'}
            gap={'2rem'}
            sx={{
              position: 'relative',
              zIndex: 1,
              [theme.breakpoints.down('sm')]: {
                width: '100%',
                gap: '1rem',
                backgroundColor: "#ffffff7d",
                marginBottom: '4rem',
              },
            }}
          >
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
        </Box>
        <ProjectBoard alt="project board" />
      </Stack>
    </Stack>
  );
};
