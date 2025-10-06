'use client';
import { Box, useTheme } from '@mui/material';
import { TopBar } from '@/components/TopBar/TopBar';
import { Project } from '@/components/LandingPage/Project/Project';

export default function ProjetoPage() {
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
      <Project />
    </Box>
  );
}
