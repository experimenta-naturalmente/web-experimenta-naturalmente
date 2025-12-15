'use client';

import Link from 'next/link';
import { Stack, Typography } from '@mui/material';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';

export default function NotFound() {
  return (
    <Stack
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      gap={3}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Typography variant="h1" color="white" fontWeight={700}>
        404
      </Typography>
      <Typography variant="h4" color="white" textAlign="center">
        Página não encontrada
      </Typography>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <GradientRoundButton sx={{ mt: 2 }}>Voltar para Home</GradientRoundButton>
      </Link>
    </Stack>
  );
}
