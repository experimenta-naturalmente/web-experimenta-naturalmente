import { Alert, Link, Snackbar, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import backgroundImg from '@/assets/BackgroundRegister.png';
import mailIcon from '@/assets/MailIcon.png';
import lockIcon from '@/assets/LockIcon.png';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '../../TopBar/TopBar';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Input from '@/components/Inputs/Input/Input';

export const Login = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>(
    'success',
  );
  const [error, setError] = useState('');

  const showToast = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'info',
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Login OK, verifica se é admin
      const { getUserData } = await import('@/utils/service');
      const userData = await getUserData(userCredential.user.uid);

      setError('');
      showToast('Login Realizado!', 'success');

      // Redireciona para /admin se for admin, senão para /home
      if (userData?.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } catch (err: unknown) {
      // Tratando erro do Firebase e mostrando mensagem amigável
      const error = (err as { code?: string }) || {};
      if (error.code === 'auth/user-not-found') {
        const msg = 'Usuário não encontrado.';
        showToast(msg, 'warning');
      } else if (error.code === 'auth/invalid-email') {
        const msg = 'Email inválido.';
        showToast(msg, 'warning');
      } else if (error.code === 'auth/missing-password') {
        const msg = 'Insira a senha.';
        showToast(msg, 'warning');
      } else if (error.code === 'auth/invalid-credential') {
        const msg = 'Usuário ou senha inválidos.';
        showToast(msg, 'warning');
      } else {
        const msg = 'Ocorreu um erro. Tente novamente mais tarde.';
        showToast(msg, 'error');
      }
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError('');
      showToast('Email de recuperação enviado!', 'success');
    } catch (err: unknown) {
      const error = (err as { code?: string }) || {};
      if (error.code === 'auth/user-not-found') {
        const msg = 'Email inválido.';
        setError(msg);
        showToast(msg, 'warning');
      } else if (error.code === 'auth/missing-email') {
        const msg = 'Insira o email no login.';
        setError(msg);
        showToast(msg, 'warning');
      } else if (error.code === 'auth/invalid-email') {
        const msg = 'Email inválido.';
        setError(msg);
        showToast(msg, 'warning');
      } else {
        const msg = 'Ocorreu um erro. Tente novamente mais tarde.';
        setError(msg);
        showToast(msg, 'error');
      }
    }
  };

  useEffect(() => {}, []);

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
      <TopBar isLogin={true} />

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
            Entre na plataforma
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
              Gerencie suas experiências no Experimenta São Chico
            </Typography>

            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography variant="h6" color={theme.palette.customPrimaryShades[400]}>
                Login
              </Typography>
            </Stack>

            <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e)}
                  //size={isSmallScreen ? 'small' : 'medium'} // assumindo que seu Input aceite essa prop
                  sx={{ width: '100%' }}
                />
                <Input
                  icon={lockIcon}
                  placeholder="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e)}
                  //size={isSmallScreen ? 'small' : 'medium'}
                  sx={{ width: '100%' }}
                />

                <GradientRoundButton
                  type="submit"
                  sx={{
                    width: isSmallScreen ? '100%' : '15rem',
                    height: isSmallScreen ? '3rem' : '2.5rem',
                    fontWeight: 500,
                    fontSize: isSmallScreen ? '1rem' : '0.9rem',
                  }}
                >
                  Entrar
                </GradientRoundButton>

                {error && (
                  <Alert
                    severity="warning"
                    sx={{ fontSize: '0.875rem', mb: 2, width: '100%', whiteSpace: 'normal' }}
                  >
                    {error}
                  </Alert>
                )}

                <Link
                  underline="hover"
                  variant="body3"
                  onClick={() => handleForgotPassword(email)}
                  sx={{ cursor: 'pointer' }}
                >
                  Esqueci minha senha
                </Link>
              </Stack>
            </form>
          </Stack>
        </div>
      </Stack>

      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};
