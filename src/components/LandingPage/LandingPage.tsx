import { Stack } from '@mui/material';
import { Login } from './Login/Login';
import { DownloadApp } from './DownloadApp/DownloadApp';
import { Project } from './Project/Project';

export const LandingPage = () => {
  return (
    <Stack height={'fit-content'} width={'100%'} gap={'12rem'}>
      <Login />
      <DownloadApp />
      <Project />
    </Stack>
  );
};
