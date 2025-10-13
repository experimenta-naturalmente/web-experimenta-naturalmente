import { Box, ButtonGroup } from '@mui/material';
import { TopBarContainer } from './TopBar.style';
import { NavigationButton } from './NavigationButton/NavigationButton';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Logo from '../../assets/ESCNLogo.svg';
import { ColoredRoundButton, LightRoundButton } from '../UI/Buttons/RoundButton.style';
import Link from 'next/link';

type TopBarProps = { isRegister?: boolean; isLogin?: boolean };

export const TopBar = ({ isRegister = false, isLogin = false }: TopBarProps) => {
  return (
    <TopBarContainer>
      <Logo style={{ height: '5rem', width: '10rem' }} />
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
      </Box>
    </TopBarContainer>
  );
};
