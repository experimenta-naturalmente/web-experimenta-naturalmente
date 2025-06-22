import { Stack, Typography, useTheme } from '@mui/material';
import { GradientRoundButton } from '../../UI/Buttons/RoundButton.style';

export const IntroductionSection = () => {
  const theme = useTheme();
  return (
    <Stack width={'45%'} height={'90%'} gap={'1.5rem'} justifyContent={'center'}>
      <Typography variant="h3" color={theme.palette.neutrals.baseWhite}>
        Cadastre-se agora e comece a divulgar o seu negócio.
      </Typography>
      <Stack width={'60%'} gap={'1rem'}>
        <Typography variant="body2" color={theme.palette.neutrals.baseWhite}>
          Ou baixe nosso aplicativo para explorar as maravilhas de São Francisco de Paula equanto
          contribui para o crescimento do turismo e da economia local.
        </Typography>
        <GradientRoundButton
          sx={{
            width: '15rem',
            height: '2.5rem',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          Baixe o App
        </GradientRoundButton>
      </Stack>
    </Stack>
  );
};
