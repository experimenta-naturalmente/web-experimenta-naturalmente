import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
  Snackbar,
  Alert,
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
import React, { useState, useEffect } from 'react';
import { TopBar } from '../../TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Input from '@/components/Inputs/Input/Input';
import OpeningHoursInput from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import { registerUser, createExperienceOnly } from '@/utils/service';
import type { OpeningHours as OpeningHoursMap } from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import { useRouter } from 'next/navigation';
import { collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const Register = () => {
  const theme = useTheme();
  const router = useRouter();

  const [step, setStep] = useState<number>(1);

  // account
  const [responsavel, setResponsavel] = useState('');
  const [responsavelCpf, setResponsavelCpf] = useState('');
  const [responsavelPhone, setResponsavelPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // experience
  const [estabName, setEstabName] = useState('');
  const [estEmail, setEstEmail] = useState('');
  const [estPhone, setEstPhone] = useState('');
  const [description, setDescription] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState<string | number>('');
  const [addressZip, setAddressZip] = useState('');
  const [attachmentsInput, setAttachmentsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [openingHoursMap, setOpeningHoursMap] = useState<OpeningHoursMap | undefined>(undefined);

  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>(
    'success',
  );

  const showToast = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'info',
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  // categories
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const snap = await getDocs(collection(db, 'experienceCategories'));
        const cats: { id: string; name: string }[] = [];
        snap.docs.forEach((doc) => {
          const data = doc.data() as any;
          cats.push({ id: doc.id, name: data.name ?? data.title ?? doc.id });
        });
        console.log('Loaded categories: ', cats);
        if (mounted && cats.length > 0) {
          setCategories(cats);
          setSelectedCategoryId(cats[0].id);
        }
      } catch (e) {
        console.warn('Failed to load categories', e);
      }
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const DAY_KEY_TO_NAME: Record<string, string> = {
    mon: 'monday',
    tue: 'tuesday',
    wed: 'wednesday',
    thu: 'thursday',
    fri: 'friday',
    sat: 'saturday',
    sun: 'sunday',
  };

  const handleCreateAccount = async () => {
    setError(null);
    if (!responsavel || !responsavelCpf || !email || !responsavelPhone || !password) {
      const msg = 'Nome, CPF, e-mail, telefone e senha do responsável são obrigatórios';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    if (password !== confirmPassword) {
      const msg = 'As senhas não conferem';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    try {
      const userDoc = await registerUser({
        displayName: responsavel,
        cpf: responsavelCpf,
        email,
        phone: responsavelPhone,
        createdAt: serverTimestamp(),
        password,
      });
      setCreatedUserId(userDoc.userId);
      showToast('Usuário criado com sucesso', 'success');
      setStep(2);
    } catch (e: any) {
      const msg = e?.message ?? 'Falha ao criar usuário';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleStep2Next = async () => {
    if (
      !selectedCategoryId ||
      !estabName ||
      !estEmail ||
      !estPhone ||
      !addressStreet ||
      !addressNumber ||
      !addressZip ||
      !cnpj
    ) {
      const msg = 'Preencha todas as informações do estabelecimento antes de continuar';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const attachments = attachmentsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((url) => ({ type: 'image', url }));

      const openingHours = openingHoursMap
        ? (Object.entries(openingHoursMap).map(([k, v]) => ({
            dayOfWeek: DAY_KEY_TO_NAME[k] ?? k,
            openingHour: v.open ?? '',
            closingHour: v.close ?? '',
            isWorkingDay: v.closed ? false : true,
          })) as import('@/utils/service').OpeningHourItem[])
        : undefined;

      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const finalExperience: import('@/utils/service').ExperiencePayload = {
        name: estabName,
        description,
        email: estEmail,
        phone: estPhone,
        cnpj,
        categoryId: selectedCategoryId,
        address: { street: addressStreet, number: addressNumber, zipCode: addressZip },
        attachments: attachments,
        openingHours,
        tags,
      };
      console.log('Final experience payload: ', finalExperience);
      if (!createdUserId) {
        const msg = 'Usuário não encontrado. Volte ao passo 1.';
        setError(msg);
        showToast(msg, 'error');
        setLoading(false);
        return;
      }
      console.log('Created user id: ', createdUserId);
      const expId = await createExperienceOnly(finalExperience, createdUserId);
      console.log('Created experience id: ', expId);
      showToast('Experiência criada com sucesso!', 'success');
      setTimeout(() => router.push('/'), 800);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

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
        {step === 1 && (
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
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
                <Typography variant="h6" color={theme.palette.neutrals.darkGrey}>
                  1/3 Dados da conta
                </Typography>
              </Stack>

              <Input
                icon={personIcon}
                placeholder="Nome do responsável"
                onChange={(val) => setResponsavel(val)}
              />
              <Input
                icon={personIcon}
                placeholder="CPF do responsável"
                onChange={(val) => setResponsavelCpf(val)}
              />
              <Input
                icon={mailIcon}
                placeholder="E-mail do responsável"
                type="email"
                onChange={(val) => setEmail(val)}
              />
              <Input
                icon={phoneIcon}
                placeholder="Telefone do responsável"
                type="tel"
                onChange={(val) => setResponsavelPhone(val)}
              />
              <Input
                icon={lockIcon}
                placeholder="Senha"
                type="password"
                onChange={(val) => setPassword(val)}
              />
              <Input
                icon={lockIcon}
                placeholder="Confirmar senha"
                type="password"
                onChange={(val) => setConfirmPassword(val)}
              />

              <GradientRoundButton
                sx={{ width: '15rem', height: '2.5rem', fontWeight: 500, fontSize: '0.9rem' }}
                onClick={handleCreateAccount}
              >
                Próximo
              </GradientRoundButton>
            </Stack>
          </div>
        )}

        {step === 2 && (
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
            <Stack width={'60%'} gap={'1rem'} sx={{ alignItems: 'center' }}>
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
                  onClick={() => setStep(1)}
                />
                <Typography variant="h6" color={theme.palette.neutrals.darkGrey}>
                  2/3 dados da experiencia
                </Typography>
              </Stack>

              <FormControl>
                <RadioGroup
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="nowrap">
                    {categories.slice(0, 3).map((cat) => (
                      <FormControlLabel
                        key={cat.id}
                        value={cat.id}
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label={cat.name}
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
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="nowrap">
                    {categories.slice(3).map((cat) => (
                      <FormControlLabel
                        key={cat.id}
                        value={cat.id}
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.neutrals.mediumGrey,
                              '&.Mui-checked': { color: theme.palette.primary[700] },
                              transform: 'scale(0.85)',
                            }}
                          />
                        }
                        label={cat.name}
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
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Input
                icon={bussinessIcon}
                placeholder="Nome fantasia"
                onChange={(val) => setEstabName(val)}
              />
              <Input
                icon={mailIcon}
                placeholder="E-mail do estabelecimento"
                type="email"
                onChange={(val) => setEstEmail(val)}
              />
              <Input
                icon={phoneIcon}
                placeholder="Telefone do estabelecimento"
                type="tel"
                onChange={(val) => setEstPhone(val)}
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
                  onChange={(val) => setAddressStreet(val)}
                />
                <Input placeholder="N°" onChange={(val) => setAddressNumber(val)} />
                <Input placeholder="CEP" onChange={(val) => setAddressZip(val)} />
              </Stack>
              <Input icon={lockIcon} placeholder="CNPJ" onChange={(val) => setCnpj(val)} />

              <GradientRoundButton
                sx={{ width: '15rem', height: '2.5rem', fontWeight: 500, fontSize: '0.9rem' }}
                onClick={handleStep2Next}
              >
                Próximo
              </GradientRoundButton>
            </Stack>
          </div>
        )}

        {step === 3 && (
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
            <Stack width={'60%'} gap={'1rem'} sx={{ alignItems: 'center' }}>
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
                  onClick={() => setStep(2)}
                />
                <Typography variant="h6" color={theme.palette.primary[400]}>
                  3/3 dados da experiencia
                </Typography>
              </Stack>

              <OpeningHoursInput
                value={openingHoursMap}
                onChange={(val) => setOpeningHoursMap(val)}
              />
              <Input
                icon={descriptionIcon}
                placeholder="Descrição"
                onChange={(val) => setDescription(val)}
              />
              <Input
                icon={imagesIcon}
                placeholder="Tags (separadas por ,)"
                onChange={(val) => setTagsInput(val)}
              />
              <Input
                icon={imagesIcon}
                placeholder="Fotos (URLs separadas por ,)"
                onChange={(val) => setAttachmentsInput(val)}
              />

              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}

              <GradientRoundButton
                sx={{ width: '15rem', height: '2.5rem', fontWeight: 500, fontSize: '0.9rem' }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </GradientRoundButton>
            </Stack>
          </div>
        )}
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
