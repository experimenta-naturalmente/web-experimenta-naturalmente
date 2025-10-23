import { Stack } from '@mui/material';
import { TopContent } from './TopContent/TopContent';
import { DownloadApp } from './DownloadApp/DownloadApp';
import { Project } from './Project/Project';

export const LandingPage = () => {
  return (
    <Stack height={'fit-content'} width={'100%'} gap={'12rem'}>
      <TopContent />
      <DownloadApp />
      <Project />
    </Stack>
  );
};
