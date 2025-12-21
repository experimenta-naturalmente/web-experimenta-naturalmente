import { Stack } from '@mui/material';
import { TopContent } from './TopContent/TopContent';
import { DownloadApp } from './DownloadApp/DownloadApp';
import { Project } from './Project/Project';

export const LandingPage = () => {
  return (
    <Stack
      height={'fit-content'}
      width={'100%'}
      gap={'8rem'}
      sx={{
        paddingBottom: '2rem',
        ['@media (max-width: 600px)'] : {
          gap: '3rem',
        },
      }}
    >
      <TopContent />
      <DownloadApp />
      <Project />
    </Stack>
  );
};
