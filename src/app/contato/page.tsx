'use client';
import {
  Alert,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import backgroundImg from '@/assets/lago-sao-bernardo.jpg';
import mailIcon from '@/assets/MailIcon.png';
import Input from '@/components/Inputs/Input/Input';
import { FormEvent, useMemo, useState } from 'react';
import { TopBar } from '@/components/TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Link from 'next/link';

type ContactFormData = {
  nome: string;
  email: string;
  mensagem: string;
};

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<ContactFormData>({
    nome: '',
    email: '',
    mensagem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

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
    <Stack
      width="100%"
      height="100vh"
      padding={isSmallScreen ? '1rem' : '1.5rem'}
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overflowX: 'hidden',
        maxWidth: '100vw',
      }}
    >
      <TopBar />

      <Stack
        width={isSmallScreen ? '90%' : '45%'}
        height="90%"
        gap={isSmallScreen ? '1rem' : '1.5rem'}
        justifyContent="center"
        alignSelf="center"
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.palette.neutrals.formsWhite,
            alignItems: 'center',
            flexDirection: 'column',
            padding: isSmallScreen ? '1rem' : '1.5rem',
            borderRadius: '1rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Typography
            variant={isSmallScreen ? 'h4' : 'h3'}
            color={theme.palette.neutrals.darkGrey}
            fontWeight={700}
            textAlign="center"
          >
            Fale com a equipe
          </Typography>

          <Stack
            width="100%"
            gap={isSmallScreen ? '0.75rem' : '1rem'}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}
          >
            <Typography
              variant="h6"
              color={theme.palette.neutrals.darkGrey}
              textAlign="center"
              sx={{
                width: isSmallScreen ? '100%' : '80%',
                fontSize: isSmallScreen ? '1rem' : '1.08rem',
              }}
            >
              Envie sua mensagem para nossa equipe do Experimenta São Chico
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack
                spacing={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Input
                  icon={mailIcon}
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e)}
                  sx={{ width: '100%' }}
                />
                <Input
                  icon={mailIcon}
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e)}
                  sx={{ width: '100%' }}
                />
                <Input
                  placeholder="Mensagem"
                  value={formData.mensagem}
                  onChange={(e) => handleChange('mensagem', e)}
                  sx={{ width: '100%' }}
                />

                <GradientRoundButton
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    width: isSmallScreen ? '100%' : '15rem',
                    height: isSmallScreen ? '3rem' : '2.5rem',
                    fontWeight: 500,
                    fontSize: isSmallScreen ? '1rem' : '0.9rem',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={18} sx={{ color: theme.palette.neutrals.baseWhite, mr: 1 }} />
                      Enviando...
                    </>
                  ) : (
                    'Enviar'
                  )}
                </GradientRoundButton>
              </Stack>
            </form>

            <Typography variant="body3" color={theme.palette.neutrals.darkGrey}>
              Se preferir, envie direto para
              <MuiLink
                href="mailto:experimentanaturalmente@gmail.com"
                underline="hover"
                sx={{ ml: 0.5 }}
              >
                experimentanaturalmente@gmail.com
              </MuiLink>
            </Typography>
          </Stack>
        </div>
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
    </Stack>
  );
}
