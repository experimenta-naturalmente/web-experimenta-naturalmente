import {
  Box,
  ButtonGroup,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { TopBarContainer } from './TopBar.style';
import { NavigationButton } from './NavigationButton/NavigationButton';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import PlaceIcon from '@mui/icons-material/Place';
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
  const [open, setOpen] = useState(false);

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
        <Logo
          style={{ width: 'auto', cursor: 'pointer' }}
          sx={{
            height: {
              xs: '4.8rem',
              sm: '5.5rem',
              md: '6rem',
              lg: '6.8rem',
            },
          }}
        />
      </Link>
      <Box
        sx={{
          display: 'flex',
          gap: {
            sm: '0.5rem',
            md: '0.75rem',
            lg: '1rem',
          },
        }}
      >
        {/* Desktop navigation */}
        <ButtonGroup sx={{ gap: {
              sm: '0.5rem',
              md: '0.75rem',
              lg: '1rem',
            },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <NavigationButton label="Home" href="/#home" />
          <NavigationButton label="Projeto" href="/#projeto" />
          <NavigationButton label="Baixe o App" href="/#baixe-o-app" />
          <NavigationButton label="Contato" href="/contato" />
        </ButtonGroup>

        {user ? (
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* Usuário logado */}
            {isAdmin ? (
              <>
                <Link href="/admin" style={{ textDecoration: 'none' }}>
                  <ColoredRoundButton>
                    <BusinessIcon sx={{ height: '1.1rem' }} />
                    Experiências
                  </ColoredRoundButton>
                </Link>
                <Link href="/routes" style={{ textDecoration: 'none' }}>
                  <ColoredRoundButton>
                    <PlaceIcon sx={{ height: '1.1rem' }} />
                    Rotas
                  </ColoredRoundButton>
                </Link>
              </>
            ) : (
              <Link href="/home" style={{ textDecoration: 'none' }}>
                <ColoredRoundButton>
                  <BusinessIcon sx={{ height: '1.1rem' }} />
                  Minhas Experiências
                </ColoredRoundButton>
              </Link>
            )}
            <LightRoundButton
              onClick={handleLogout}
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              <LogoutIcon sx={{ height: '1.1rem' }} />
              Sair
            </LightRoundButton>
          </Box>
        ) : (
          <>
            {/* Usuário não logado */}
            {!isLogin && (
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <LightRoundButton sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                  Entrar
                </LightRoundButton>
              </Link>
            )}
            {!isRegister && (
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <ColoredRoundButton sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                  Cadastrar
                  <ArrowOutwardIcon sx={{ height: '1.1rem' }} />
                </ColoredRoundButton>
              </Link>
            )}
          </>
        )}
        {/* Mobile hamburger*/}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton aria-label="menu" onClick={() => setOpen(true)}>
            <MenuIcon sx={{ color: '#ffffff' }} />
          </IconButton>
        </Box>
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{ width: 260, padding: '1rem' }}
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/#home">
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/#projeto">
                  <ListItemText primary="Projeto" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/#baixe-o-app">
                  <ListItemText primary="Baixe o App" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href="/contato">
                  <ListItemText primary="Contato" />
                </ListItemButton>
              </ListItem>
            </List>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}
            >
              {user ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link href="/admin" style={{ textDecoration: 'none' }}>
                        <ColoredRoundButton>
                          <BusinessIcon sx={{ height: '1.1rem' }} />
                          Experiências
                        </ColoredRoundButton>
                      </Link>
                      <Link href="/routes" style={{ textDecoration: 'none' }}>
                        <ColoredRoundButton>
                          <PlaceIcon sx={{ height: '1.1rem' }} />
                          Rotas
                        </ColoredRoundButton>
                      </Link>
                    </>
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
