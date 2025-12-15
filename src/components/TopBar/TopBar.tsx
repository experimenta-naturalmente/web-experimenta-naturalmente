import { Box, ButtonGroup, Typography } from '@mui/material';
import { TopBarContainer } from './TopBar.style';
import { NavigationButton } from './NavigationButton/NavigationButton';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import { ColoredRoundButton, LightRoundButton } from '../UI/Buttons/RoundButton.style';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Logo from '@/assets/ESCNLogo.svg';

type TopBarProps = { isRegister?: boolean; isLogin?: boolean };

export const TopBar = ({ isRegister = false, isLogin = false }: TopBarProps) => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <TopBarContainer>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Logo style={{ height: '2.5rem', width: 'auto', cursor: 'pointer' }} />
      </Link>
      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        <ButtonGroup sx={{ gap: '1rem' }}>
          <NavigationButton label="Home" href="/" />
          <NavigationButton label="Projeto" href="/projeto" />
          <NavigationButton label="Baixe o App" href="/download" />
          <NavigationButton label="Contato" href="/contato" />
        </ButtonGroup>

        {user ? (
          <>
            {/* Usuário logado */}
            {isAdmin ? (
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <ColoredRoundButton>
                  <BusinessIcon sx={{ height: '1.1rem' }} />
                  Experiências
                </ColoredRoundButton>
              </Link>
            ) : (
              <Link href="/home" style={{ textDecoration: 'none' }}>
                <ColoredRoundButton>
                  <BusinessIcon sx={{ height: '1.1rem' }} />
                  Minhas Experiências
                </ColoredRoundButton>
              </Link>
            )}
            <LightRoundButton onClick={handleLogout}>
              <LogoutIcon sx={{ height: '1.1rem' }} />
              Sair
            </LightRoundButton>
          </>
        ) : (
          <>
            {/* Usuário não logado */}
            {!isLogin && (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <LightRoundButton>Entrar</LightRoundButton>
              </Link>
            )}
            {!isRegister && (
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <ColoredRoundButton>
                  Cadastrar
                  <ArrowOutwardIcon sx={{ height: '1.1rem' }} />
                </ColoredRoundButton>
              </Link>
            )}
          </>
        )}
      </Box>
    </TopBarContainer>
  );
};
