'use client';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FormEvent, useMemo, useState } from 'react';
import { TopBar } from '@/components/TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Link from 'next/link';

type ContactFormData = {
  nome: string;
  email: string;
  mensagem: string;
};

export default function ContatoPage() {
  const theme = useTheme();

  const [formData, setFormData] = useState<ContactFormData>({
    nome: '',
    email: '',
    mensagem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>(
    'success',
  );

  const isEmailValid = useMemo(() => {
    if (!formData.email) return true;
    return /^\S+@\S+\.\S+$/.test(formData.email.trim());
  }, [formData.email]);

  const showToast = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'success',
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nome = formData.nome.trim();
    const email = formData.email.trim();
    const mensagem = formData.mensagem.trim();

    if (!nome || !email || !mensagem) {
      showToast('Preencha Nome, Email e Mensagem.', 'warning');
      return;
    }

    if (!isEmailValid) {
      showToast('Informe um email valido.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, mensagem }),
      });

      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !result?.success) {
        showToast(result?.message || 'Nao foi possivel enviar a mensagem agora.', 'error');
        return;
      }

      showToast('Mensagem enviada com sucesso!');
      setFormData({ nome: '', email: '', mensagem: '' });
    } catch {
      showToast('Erro de conexao. Tente novamente em instantes.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: theme.palette.customPrimaryShades[100],
      }}
    >
      <TopBar />
      <Stack p={{ xs: 2.5, md: 4 }} gap={2} alignItems="center">
        <Typography variant="h2" color={theme.palette.customPrimaryShades[600]}>
          Contato
        </Typography>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: '42rem',
            borderRadius: '1.25rem',
            p: { xs: 2, md: 3 },
            backgroundColor: theme.palette.neutrals.baseWhite,
            border: `1px solid ${theme.palette.customPrimaryShades[200]}`,
            boxShadow: `0 16px 36px ${theme.palette.customPrimaryShades[200]}`,
          }}
        >
          <Stack gap={2.5}>
            <Typography variant="body1" color={theme.palette.customPrimaryShades[600]}>
              Envie sua mensagem para nossa equipe.
            </Typography>

            <TextField
              label="Nome"
              placeholder="Seu nome"
              fullWidth
              value={formData.nome}
              onChange={(event) => handleChange('nome', event.target.value)}
              required
            />

            <TextField
              label="Email"
              placeholder="seuemail@exemplo.com"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
              error={!isEmailValid}
              helperText={!isEmailValid ? 'Email invalido.' : ' '}
            />

            <TextField
              label="Mensagem"
              placeholder="Digite sua mensagem"
              multiline
              minRows={5}
              fullWidth
              value={formData.mensagem}
              onChange={(event) => handleChange('mensagem', event.target.value)}
              required
            />

            <Box>
              <GradientRoundButton type="submit" disabled={isSubmitting} sx={{ px: 3, py: 1 }}>
                {isSubmitting ? (
                  <>
                    <CircularProgress
                      size={18}
                      sx={{ color: theme.palette.neutrals.baseWhite, mr: 1 }}
                    />
                    Enviando...
                  </>
                ) : (
                  'Enviar'
                )}
              </GradientRoundButton>
            </Box>

            <Typography variant="body3" color={theme.palette.neutrals.darkGrey}>
              Se preferir, envie direto para
              <Link
                href="mailto:experimentanaturalmente@gmail.com"
                style={{ textDecoration: 'underline', marginLeft: '0.25rem' }}
              >
                experimentanaturalmente@gmail.com
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Stack>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
