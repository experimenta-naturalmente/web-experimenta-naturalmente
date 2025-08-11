'use client';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { TopBar } from '@/components/TopBar/TopBar';

export default function ContatoPage() {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', backgroundColor: theme.palette.primary[100] }}>
      <TopBar />
      <Stack p={4} gap={2}>
        <Typography variant="h2" color={theme.palette.primary[600]}>Contato</Typography>
        <Typography variant="body1" color={theme.palette.neutrals.darkGrey}>
          Em breve adicionaremos um formulário de contato aqui. Enquanto isso, envie um email para contato@example.com.
        </Typography>
      </Stack>
    </Box>
  );
}
