import { Alert, Link, Stack, Typography, useTheme } from '@mui/material';
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
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login OK, redireciona para home
      router.push('/home');
    } catch (error: any) {
      // Tratando erro do Firebase e mostrando mensagem amigável
      if (error.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido.');
      } else if (error.code === 'auth/missing-password') {
        setError('Insira a senha.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Usuário ou senha inválidos.');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Email de recuperação enviado!');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('Email inválido.');
      } else if (error.code === 'auth/missing-email') {
        setError('Insira o email no login.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email inválido.');
      } else {
        setError('Ocorreu um erro.');
      }
    }
  };

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // const [toastOpen, setToastOpen] = useState(false);
  // const [toastMessage, setToastMessage] = useState('');
  // const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>(
  //  'success',
  // );

  // const showToast = (
  //   message: string,
  //   severity: 'success' | 'error' | 'info' | 'warning' = 'info',
  // ) => {
  //   setToastMessage(message);
  //   setToastSeverity(severity);
  //   setToastOpen(true);
  // };

  useEffect(() => {}, []);

  return (
    <Stack
      width="100%"
      height="100vh"
      padding={'1.5rem'}
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <TopBar isLogin={true} />

      <Stack
        width={'45%'}
        height={'90%'}
        gap={'1.5rem'}
        justifyContent={'center'}
        alignSelf={'center'}
      >
        <div
          style={{
            display: 'flex',
            backgroundColor: theme.palette.neutrals.formsWhite,
            alignItems: 'center',
            flexDirection: 'column',
            padding: '1rem',
            borderRadius: '1rem',
          }}
        >
          <Typography variant="h3" color={theme.palette.neutrals.darkGrey} fontWeight={700}>
            Entre na plataforma
          </Typography>
          <Stack
            width={'60%'}
            gap={'1rem'}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Typography
              variant="h6"
              color={theme.palette.neutrals.darkGrey}
              textAlign="center"
              width="200%"
              fontSize="1.08rem"
            >
              Gerencie suas experiências no Experimenta São Chico
            </Typography>

            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignSelf: 'center',
                width: '110%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" color={theme.palette.customPrimaryShades[400]}>
                Login
              </Typography>
            </Stack>

            <form onSubmit={handleLogin}>
              <Stack
                spacing={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Input
                  icon={mailIcon}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e)}
                />
                <Input
                  icon={lockIcon}
                  placeholder="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e)}
                />

                <GradientRoundButton
                  type="submit"
                  sx={{ width: '15rem', height: '2.5rem', fontWeight: 500, fontSize: '0.9rem' }}
                  //onClick={handleCreateAccount}
                  onClick={() => {}}
                >
                  Entrar
                </GradientRoundButton>
                {error && (
                  <Alert
                    severity="warning"
                    sx={{ fontSize: '0.875rem', mb: 2, textWrap: 'wrap', width: '100%' }}
                  >
                    {error}
                  </Alert>
                )}
                <Link underline="hover" variant="body3" onClick={() => handleForgotPassword(email)}>
                  Esqueci minha senha
                </Link>
              </Stack>
            </form>
          </Stack>
        </div>
      </Stack>

      {/* <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar> */}
    </Stack>
  );
};
