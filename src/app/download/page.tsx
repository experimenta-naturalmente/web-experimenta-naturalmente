'use client';
import { Box, useTheme } from '@mui/material';
import { TopBar } from '@/components/TopBar/TopBar';
import { DownloadApp } from '@/components/LandingPage/DownloadApp/DownloadApp';

export default function DownloadPage() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: theme.palette.customPrimaryShades[100],
      }}
    >
      <TopBar />
      <DownloadApp />
    </Box>
  );
}
