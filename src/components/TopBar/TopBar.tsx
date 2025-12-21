import { Box, ButtonGroup, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
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
import Logo from '@/assets/NovoLogo.svg';
import theme from '@/theme/Theme';

type TopBarProps = { isRegister?: boolean; isLogin?: boolean };

export const TopBar = ({ isRegister = false, isLogin = false }: TopBarProps) => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

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
        <Logo style={{ height: '6.8rem', width: 'auto', cursor: 'pointer' }}  sx={{
                 [theme.breakpoints.down('sm')]: {
                   height: '4.8rem',
                 }
               }}/>
      </Link>
      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        {/* Desktop navigation */}
        <ButtonGroup sx={{ gap: '1rem', display: { xs: 'none', sm: 'flex' } }}>
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
            <LightRoundButton onClick={handleLogout} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              <LogoutIcon sx={{ height: '1.1rem' }} />
              Sair
            </LightRoundButton>
          </>
        ) : (
          <>
            {/* Usuário não logado */}
            {!isLogin && (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <LightRoundButton sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Entrar</LightRoundButton>
              </Link>
            )}
            {!isRegister && (
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <ColoredRoundButton sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  Cadastrar
                  <ArrowOutwardIcon sx={{ height: '1.1rem' }} />
                </ColoredRoundButton>
              </Link>
            )}
          </>
        )}
        {/* Mobile hamburger */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <IconButton aria-label="menu" onClick={() => setOpen(true)}>
            <MenuIcon sx={{ color: '#ffffff' }} />
          </IconButton>
        </Box>

        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 260, padding: '1rem' }} role="presentation" onClick={() => setOpen(false)}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/">
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/projeto">
                  <ListItemText primary="Projeto" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/download">
                  <ListItemText primary="Baixe o App" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/contato">
                  <ListItemText primary="Contato" />
                </ListItemButton>
              </ListItem>
            </List>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              {user ? (
                <>
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
          </Box>
        </Drawer>
      </Box>
    </TopBarContainer>
  );
};
