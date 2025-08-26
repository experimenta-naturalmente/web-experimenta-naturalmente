import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import backgroundImg from '@/assets/BackgroundRegister.png';
import personIcon from '@/assets/PersonIcon.png';
import mailIcon from '@/assets/MailIcon.png';
import phoneIcon from '@/assets/PhoneIcon.png';
import socialIcon from '@/assets/SocialIcon.png';
import lockIcon from '@/assets/LockIcon.png';
import arrowIcon from '@/assets/ArrowIcon.png';
import bussinessIcon from '@/assets/BussinessIcon.png';
import locationIcon from '@/assets/LocationIcon.png';
import descriptionIcon from '@/assets/DescriptionIcon.png';
import imagesIcon from '@/assets/ImagesIcon.png';
import React from 'react';
import { TopBar } from '../../TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Input from '@/components/Inputs/Input/Input';
import OpeningHoursInput from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';

export const Register = () => {
  const theme = useTheme();
  const [isAtFirstPage, setIsAtFirstPage] = React.useState(true);
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
      <TopBar isRegister={true} />
      <Stack
        width={'45%'}
        height={'90%'}
        gap={'1.5rem'}
        justifyContent={'center'}
        alignSelf={'center'}
      >
        {isAtFirstPage ? (
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
              Cadastre seu negócio
            </Typography>
            <Stack
              width={'60%'}
              gap={'1rem'}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                color={theme.palette.neutrals.darkGrey}
                textAlign="center"
                width="200%"
                fontSize="1.08rem"
              >
                Ganhe visibilidade, cadastre seu negócio no Experimenta São Chico
              </Typography>

              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '110%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" color={theme.palette.primary[400]}>
                  Dados da conta
                </Typography>
                <Typography variant="h6" color={theme.palette.neutrals.darkGrey}>
                  Dados do estabelecimento
                </Typography>
              </Stack>
              <Input
                icon={personIcon}
                placeholder="Nome do responsável"
                onChange={(val) => console.log('Nome:', val)}
              />
              <Input
                icon={mailIcon}
                placeholder="E-mail"
                type="email"
                onChange={(val) => console.log('Email:', val)}
              />
              <Input
                icon={phoneIcon}
                placeholder="Telefone do negócio"
                type="tel"
                onChange={(val) => console.log('Telefone:', val)}
              />
              <Input
                icon={socialIcon}
                placeholder="Redes sociais(Facebook/Instagram/Whatsapp)"
                onChange={(val) => console.log('Redes sociais:', val)}
              />
              <Input
                icon={lockIcon}
                placeholder="Senha"
                type="password"
                onChange={(val) => console.log('Senha:', val)}
              />
              <Input
                icon={lockIcon}
                placeholder="Confirmar senha"
                type="password"
                onChange={(val) => console.log('Confirmar senha:', val)}
              />
              <GradientRoundButton
                sx={{
                  width: '15rem',
                  height: '2.5rem',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
                onClick={() => setIsAtFirstPage(false)}
              >
                Próximo
              </GradientRoundButton>
            </Stack>
          </div>
        ) : (
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
              Cadastre seu negócio
            </Typography>
            <Stack
              width={'60%'}
              gap={'1rem'}
              sx={{
                alignItems: 'center',
              }}
            >
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '120%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <img
                  src={arrowIcon.src}
                  alt="arrow icon"
                  width={20}
                  height={20}
                  onClick={() => setIsAtFirstPage(true)}
                />
                <Typography variant="h6" color={theme.palette.neutrals.darkGrey}>
                  Dados da conta
                </Typography>
                <Typography variant="h6" color={theme.palette.primary[400]}>
                  Dados do estabelecimento
                </Typography>
              </Stack>
              <Stack>
                <FormControl>
                  <RadioGroup>
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="nowrap">
                      <FormControlLabel
                        value="hotel"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label="Hotel"
                        sx={{
                          '.MuiTypography-root': {
                            fontSize: '0.95rem',
                            color: theme.palette.neutrals.mediumGrey,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          minWidth: 0,
                          flexShrink: 1,
                        }}
                      />
                      <FormControlLabel
                        value="produtorRural"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label="Produtor rural"
                        sx={{
                          '.MuiTypography-root': {
                            fontSize: '0.95rem',
                            color: theme.palette.neutrals.mediumGrey,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          minWidth: 0,
                          flexShrink: 1,
                        }}
                      />
                      <FormControlLabel
                        value="pontoTuristico"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label="Ponto turístico"
                        sx={{
                          '.MuiTypography-root': {
                            fontSize: '0.95rem',
                            color: theme.palette.neutrals.mediumGrey,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          minWidth: 0,
                          flexShrink: 1,
                        }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} justifyContent="center" flexWrap="nowrap">
                      <FormControlLabel
                        value="evento"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label="Evento"
                        sx={{
                          '.MuiTypography-root': {
                            fontSize: '0.95rem',
                            color: theme.palette.neutrals.mediumGrey,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          minWidth: 0,
                          flexShrink: 1,
                        }}
                      />
                      <FormControlLabel
                        value="restaurante"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label="Restaurante"
                        sx={{
                          '.MuiTypography-root': {
                            fontSize: '0.95rem',
                            color: theme.palette.neutrals.mediumGrey,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          minWidth: 0,
                          flexShrink: 1,
                        }}
                      />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Stack>
              <Input
                icon={bussinessIcon}
                placeholder="Nome do estabelecimento"
                onChange={(val) => console.log('Nome do estabelecimento:', val)}
              />
              <Stack
                sx={{
                  maxWidth: '100%',
                  display: 'grid',
                  gridTemplateColumns: '49% 16.5% 31.5%',
                  gap: '0.4rem',
                }}
              >
                <Input
                  icon={locationIcon}
                  placeholder="Endereço"
                  onChange={(val) => console.log('Endereço:', val)}
                />
                <Input placeholder="N°" onChange={(val) => console.log('Número:', val)} />
                <Input placeholder="CEP" onChange={(val) => console.log('CEP:', val)} />
              </Stack>
              <OpeningHoursInput
                onChange={(val) => console.log('Horário de funcionamento:', val)}
              />
              <Input
                icon={descriptionIcon}
                placeholder="Descrição"
                onChange={(val) => console.log('Descrição:', val)}
              />
              <Input
                icon={lockIcon}
                placeholder="CNPJ"
                onChange={(val) => console.log('CNPJ:', val)}
              />
              <Input
                icon={imagesIcon}
                placeholder="Imagens do negócio"
                onChange={(val) => console.log('Imagens:', val)}
              />
              <GradientRoundButton
                sx={{
                  width: '15rem',
                  height: '2.5rem',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              >
                Cadastrar
              </GradientRoundButton>
            </Stack>
          </div>
        )}
      </Stack>
    </Stack>
  );
};
