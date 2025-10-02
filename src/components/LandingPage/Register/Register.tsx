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
// import socialIcon from '@/assets/SocialIcon.png';
import lockIcon from '@/assets/LockIcon.png';
import arrowIcon from '@/assets/ArrowIcon.png';
import bussinessIcon from '@/assets/BussinessIcon.png';
import locationIcon from '@/assets/LocationIcon.png';
import descriptionIcon from '@/assets/DescriptionIcon.png';
// import imagesIcon from '@/assets/ImagesIcon.png';
import React, { useState, useEffect } from 'react';
import { TopBar } from '../../TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Input from '@/components/Inputs/Input/Input';
import OpeningHoursInput from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import { createExperienceOnly, registerUser } from '@/utils/service';
import type { OpeningHours as OpeningHoursMap } from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import { useRouter } from 'next/navigation';
import { collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import InputTags from '@/components/Inputs/InputTags/InputTags';
import InputImages from '@/components/Inputs/InputImages/InputImages';

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
  // attachments and tags are lifted from child components
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
  // Estado para as tags e imagens
  const [availableTags, setAvailableTags] = useState<
    { id: string; name: string; experienceCategories: string[] }[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{ file: File; base64: string }[]>([]);

  // Carregar tags do banco
  useEffect(() => {
    async function loadTags() {
      try {
        const tagsSnap = await getDocs(collection(db, 'tags'));
        console.log(
          'Loaded tags: ',
          tagsSnap.docs.map((d) => d.data()),
        );

        const tags: { id: string; name: string; experienceCategories: string[] }[] = [];
        tagsSnap.docs.forEach((doc) => {
          const data = doc.data() as any;
          tags.push({
            id: doc.id,
            name: data.name,
            experienceCategories: data.experienceCategories ?? [],
          });
        });
        console.log('Processed tags: ', tags);
        setAvailableTags(tags);
      } catch (e) {
        console.warn('Failed to load tags', e);
      }
    }
    loadTags();
  }, []);

  // Função para toggle das tags
  // const handleTagToggle = (tagName: string) => {
  //   setSelectedTags((prev) =>
  //     prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
  //   );
  // };

  // Função para compressão de imagens
  // Removida pois não está sendo utilizada

  // Função para upload de imagens
  // const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files) return;

  //   const newAttachments: { file: File; base64: string }[] = [];
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     if (file.size > 5 * 1024 * 1024) {
  //       showToast('Uma imagem excede o limite de 5MB', 'error');
  //       continue;
  //     }
  //     try {
  //       const compressedBase64 = await compressImageToBase64(file);
  //       newAttachments.push({ file, base64: compressedBase64 });
  //     } catch (error) {
  //       console.error('Erro ao processar imagem:', error);
  //       showToast('Erro ao processar uma das imagens', 'error');
  //     }
  //   }

  //   setAttachments((prev) => [...prev, ...newAttachments]);
  // };

  // Função para remover imagem
  // const removeImage = (index: number) => {
  //   setAttachments((prev) => prev.filter((_, i) => i !== index));
  // };

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const snap = await getDocs(collection(db, 'experienceCategories'));
        const cats: { id: string; name: string }[] = [];
        snap.docs.forEach((doc) => {
          const data = doc.data();
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
      let userDoc = null;
      const existingUser = await getDocs(collection(db, 'users')).then((snapshot) =>
        snapshot.docs.find((doc) => {
          const data = doc.data();
          return data.email === email;
        }),
      );
      if (!existingUser) {
        userDoc = await registerUser({
          displayName: responsavel,
          cpf: responsavelCpf,
          email,
          phone: responsavelPhone,
          createdAt: serverTimestamp(),
          password,
        });
      }
      setCreatedUserId(userDoc != null ? userDoc.userId : (existingUser?.id ?? null));
      if (createdUserId == null) {
        const msg = 'Erro ao criar ou localizar usuário. Tente novamente.';
        setError(msg);
        showToast(msg, 'error');
        return;
      }

      showToast('Usuário criado com sucesso', 'success');
      setStep(2);
    } catch (e) {
      const errorMessage =
        typeof e === 'object' && e !== null && 'message' in e
          ? (e as { message?: string }).message
          : undefined;
      const msg = errorMessage ?? 'Falha ao criar usuário';
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
      const attachmentsPayload = attachments.map((a) => ({ type: 'image', url: a.base64 }));

      const openingHours = openingHoursMap
        ? (Object.entries(openingHoursMap).map(([k, v]) => ({
            dayOfWeek: DAY_KEY_TO_NAME[k] ?? k,
            openingHour: v.open ?? '',
            closingHour: v.close ?? '',
            isWorkingDay: v.closed ? false : true,
          })) as import('@/utils/service').OpeningHourItem[])
        : undefined;

      const tags = selectedTags;
      const finalExperience: import('@/utils/service').ExperiencePayload = {
        name: estabName,
        description,
        email: estEmail,
        phone: estPhone,
        cnpj,
        categoryId: selectedCategoryId,
        address: { street: addressStreet, number: +addressNumber, zipCode: addressZip },
        attachments: attachmentsPayload,
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
    } catch (e) {
      setError(
        typeof e === 'object' && e !== null && 'message' in e
          ? ((e as { message?: string }).message ?? String(e))
          : String(e),
      );
    } finally {
      setLoading(false);
    }
  };

  const tagsAvailable = (categoryId: string | undefined) => {
    if (!categoryId) return availableTags;
    const tags = availableTags.filter((tag) =>
      tag.experienceCategories
        .map((catRef: any) => catRef?._key?.path?.segments?.at?.(-1))
        .includes(categoryId),
    );
    return tags;
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
              Cadastre seu negócio 1/3
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
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" color={theme.palette.customPrimaryShades[400]}>
                  Dados pessoais
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
              Cadastre seu negócio 2/3
            </Typography>
            <Stack width={'60%'} gap={'1rem'} sx={{ alignItems: 'center' }}>
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '120%',
                  justifyContent: 'center',
                  gap: 'inherit',
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
                <Typography variant="h6" color={theme.palette.customPrimaryShades[400]}>
                  Dados da experiência
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
                              '&.Mui-checked': { color: theme.palette.customPrimaryShades[700] },
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
                              '&.Mui-checked': { color: theme.palette.customPrimaryShades[700] },
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
              {(() => {
                const hotelCategoryId = categories.find(
                  (cat) => cat.name.toLowerCase() === 'hotel',
                )?.id;
                const restaurantCategoryId = categories.find(
                  (cat) => cat.name.toLowerCase() === 'restaurante',
                )?.id;

                if (selectedCategoryId === hotelCategoryId) {
                  return (
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <select
                        style={{
                          width: '100%',
                          margin: 0,
                          padding: '12px',
                          borderRadius: '0.5rem',
                          border: `1px solid ${theme.palette.neutrals.mediumGrey}`,
                          fontSize: '1rem',
                          background: theme.palette.neutrals.formsWhite,
                          color: theme.palette.neutrals.darkGrey,
                        }}
                        onChange={() => {
                          // Adapte para salvar o tipo selecionado em um estado, ex: setHotelType(e.target.value)
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecione o tipo de hotel
                        </option>
                        <option value="pousada">Pousada</option>
                        <option value="hotel-fazenda">Hotel Fazenda</option>
                        <option value="hotel">Hotel</option>
                        <option value="resort">Resort</option>
                        <option value="outro">Outro</option>
                      </select>
                    </FormControl>
                  );
                }
                if (selectedCategoryId === restaurantCategoryId) {
                  return (
                    <FormControl fullWidth sx={{ mt: 1 }}>
                      <select
                        style={{
                          width: '100%',
                          margin: 0,
                          padding: '12px',
                          borderRadius: '0.5rem',
                          border: `1px solid ${theme.palette.neutrals.mediumGrey}`,
                          fontSize: '1rem',
                          background: theme.palette.neutrals.formsWhite,
                          color: theme.palette.neutrals.darkGrey,
                        }}
                        onChange={() => {
                          // Adapte para salvar o tipo selecionado em um estado, ex: setRestaurantType(e.target.value)
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecione o tipo de restaurante
                        </option>
                        <option value="food-truck">Food Truck</option>
                        <option value="bar">Bar</option>
                        <option value="lancheria">Lancheria</option>
                        <option value="restaurante">Restaurante</option>
                      </select>
                    </FormControl>
                  );
                }
                return null;
              })()}
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
              Cadastre seu negócio 3/3
            </Typography>
            <Stack width={'60%'} gap={'1rem'} sx={{ alignItems: 'center' }}>
              <Stack
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '120%',
                  justifyContent: 'center',
                  gap: 'inherit',
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
                <Typography variant="h6" color={theme.palette.customPrimaryShades[400]}>
                  Dados da experiência
                </Typography>
              </Stack>
              <Input
                icon={descriptionIcon}
                placeholder="Descrição"
                onChange={(val) => setDescription(val)}
              />
              <OpeningHoursInput
                value={openingHoursMap}
                onChange={(val) => setOpeningHoursMap(val)}
              />
              <InputImages onChange={(atts) => setAttachments(atts)} />
              <InputTags
                availableTags={tagsAvailable(selectedCategoryId)}
                onChange={(tags) => setSelectedTags(tags)}
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
