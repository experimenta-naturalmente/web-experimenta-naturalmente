import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  useTheme,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Input from '@/components/Inputs/Input/Input';
import InputTags from '@/components/Inputs/InputTags/InputTags';
import InputImages from '@/components/Inputs/InputImages/InputImages';
import OpeningHoursInput from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import type { OpeningHours as OpeningHoursMap } from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import mailIcon from '@/assets/MailIcon.png';
import phoneIcon from '@/assets/PhoneIcon.png';
import bussinessIcon from '@/assets/BussinessIcon.png';
import locationIcon from '@/assets/LocationIcon.png';
import descriptionIcon from '@/assets/DescriptionIcon.png';
import lockIcon from '@/assets/LockIcon.png';
import { Experience, ExperiencePayload, Attachment, Tag, OpeningHourItem } from '@/utils/service';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ExperienceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (experience: Partial<ExperiencePayload> & { id?: string }) => Promise<void>;
  experience?: Experience | null;
}

export const ExperienceModal = ({ open, onClose, onSave, experience }: ExperienceModalProps) => {
  const theme = useTheme();
  const isEdit = !!experience;

  const [estabName, setEstabName] = useState('');
  const [estEmail, setEstEmail] = useState('');
  const [estPhone, setEstPhone] = useState('');
  const [description, setDescription] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState<string | number>('');
  const [addressZip, setAddressZip] = useState('');
  const [openingHoursMap, setOpeningHoursMap] = useState<OpeningHoursMap | undefined>(undefined);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [availableTags, setAvailableTags] = useState<
    {
      id: string;
      name: string;
      experienceCategories: { _key: { path: { segments: string[] } } }[];
    }[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<{ file: File; base64: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showImageWarning, setShowImageWarning] = useState(false);
  const [existingImages, setExistingImages] = useState<Attachment[]>([]);
  const [originalTags, setOriginalTags] = useState<Tag[]>([]);
  const [originalOpeningHours, setOriginalOpeningHours] = useState<OpeningHourItem[] | undefined>(undefined);
  const [openingHoursModified, setOpeningHoursModified] = useState(false);
  const [tagsModified, setTagsModified] = useState(false);

  const formatPhone = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 11);
    if (limitedValue.length <= 2) return limitedValue;
    if (limitedValue.length <= 7) return limitedValue.replace(/(\d{2})(\d+)/, '($1) $2');
    if (limitedValue.length <= 10) return limitedValue.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return limitedValue.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 14);
    if (limitedValue.length <= 2) return limitedValue;
    if (limitedValue.length <= 5) return limitedValue.replace(/(\d{2})(\d+)/, '$1.$2');
    if (limitedValue.length <= 8) return limitedValue.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    if (limitedValue.length <= 12)
      return limitedValue.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    return limitedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
  };

  const formatCEP = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const limitedValue = cleanValue.slice(0, 8);
    if (limitedValue.length <= 5) return limitedValue;
    return limitedValue.replace(/(\d{5})(\d+)/, '$1-$2');
  };

  const DAY_KEY_TO_NAME: Record<string, string> = {
    mon: 'monday',
    tue: 'tuesday',
    wed: 'wednesday',
    thu: 'thursday',
    fri: 'friday',
    sat: 'saturday',
    sun: 'sunday',
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const snap = await getDocs(collection(db, 'experienceCategories'));
        const cats: { id: string; name: string }[] = [];
        snap.docs.forEach((doc) => {
          const data = doc.data();
          cats.push({ id: doc.id, name: data.name ?? data.title ?? doc.id });
        });
        if (cats.length > 0) {
          setCategories(cats);
          if (!isEdit) setSelectedCategoryId(cats[0].id);
        }
      } catch (e) {
        console.warn('Failed to load categories', e);
      }
    }

    async function loadTags() {
      try {
        const tagsSnap = await getDocs(collection(db, 'tags'));
        const tags: {
          id: string;
          name: string;
          experienceCategories: { _key: { path: { segments: string[] } } }[];
        }[] = [];
        tagsSnap.docs.forEach((doc) => {
          const data = doc.data();
          tags.push({
            id: doc.id,
            name: data.name,
            experienceCategories: data.experienceCategories ?? [],
          });
        });
        setAvailableTags(tags);
      } catch (e) {
        console.warn('Failed to load tags', e);
      }
    }

    loadCategories();
    loadTags();
  }, [isEdit]);

  useEffect(() => {
    if (experience) {
      setEstabName(experience.name || '');
      setEstEmail(experience.email || '');
      setEstPhone(experience.phone || '');
      setDescription(experience.description || '');
      setCnpj(experience.cnpj || '');
      setAddressStreet(experience.address?.street || '');
      setAddressNumber(experience.address?.number || '');
      setAddressZip(experience.address?.zipCode || '');
      setSelectedCategoryId(experience.categoryId);
      
      // Salvar imagens existentes
      setExistingImages(experience.attachments?.filter((att) => att.type === 'image') || []);

      // Salvar tags originais
      setOriginalTags(experience.tags || []);
      
      // Convert tags to string array if they are objects
      const tagsAsStrings = (experience.tags || [])
        .map((tag) => (typeof tag === 'string' ? tag : tag?.name || ''))
        .filter(Boolean);
      setSelectedTags(tagsAsStrings);

      // Salvar horários de funcionamento originais
      setOriginalOpeningHours(experience.openingHours);
      
      // Convert opening hours to map format
      if (experience.openingHours && experience.openingHours.length > 0) {
        const hoursMap: OpeningHoursMap = {
          mon: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
          tue: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
          wed: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
          thu: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
          fri: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
          sat: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
          sun: {
            open: undefined,
            close: undefined,
            closed: undefined,
          },
        };
        const nameToKey: Record<string, string> = {
          monday: 'mon',
          tuesday: 'tue',
          wednesday: 'wed',
          thursday: 'thu',
          friday: 'fri',
          saturday: 'sat',
          sunday: 'sun',
        };

        experience.openingHours.forEach((hour) => {
          const key = nameToKey[hour.dayOfWeek] || hour.dayOfWeek;
          hoursMap[key as keyof OpeningHoursMap] = {
            open: hour.openingHour,
            close: hour.closingHour,
            closed: !hour.isWorkingDay,
          };
        });
        setOpeningHoursMap(hoursMap);
      }
    } else {
      // Reset form for new experience
      setEstabName('');
      setEstEmail('');
      setEstPhone('');
      setDescription('');
      setCnpj('');
      setAddressStreet('');
      setAddressNumber('');
      setAddressZip('');
      setOpeningHoursMap(undefined);
      setSelectedTags([]);
      setAttachments([]);
      setExistingImages([]);
      setOriginalTags([]);
      setOriginalOpeningHours(undefined);
      setOpeningHoursModified(false);
      setTagsModified(false);
    }
  }, [experience]);

  const handleSubmit = async () => {
    if (!estabName || !estEmail || !estPhone || !selectedCategoryId) {
      alert('Preencha os campos obrigatórios: Nome, E-mail, Telefone e Categoria');
      return;
    }

    // Se for edição e houver novas imagens, mostrar aviso
    if (isEdit && attachments.length > 0 && existingImages.length > 0) {
      setShowImageWarning(true);
      return;
    }

    await saveExperience();
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      // Se houver novas imagens, usar elas; senão, manter as existentes
      const attachmentsPayload = attachments.length > 0
        ? attachments.map((a) => ({ type: 'image', url: a.base64 }))
        : existingImages;

      // Usar horários originais se não foi modificado pelo usuário
      let openingHours;
      if (isEdit && !openingHoursModified && originalOpeningHours) {
        // Mantém os horários originais se não foi alterado
        openingHours = originalOpeningHours;
      } else if (openingHoursMap) {
        // Usa os novos horários se foi modificado
        openingHours = Object.entries(openingHoursMap).map(([k, v]) => ({
          dayOfWeek: DAY_KEY_TO_NAME[k] ?? k,
          openingHour: v.open ?? '',
          closingHour: v.close ?? '',
          isWorkingDay: v.closed ? false : true,
        }));
      } else {
        openingHours = undefined;
      }

      const experienceData: Partial<ExperiencePayload> & { id?: string } = {
        name: estabName,
        description,
        email: estEmail,
        phone: estPhone,
        cnpj,
        categoryId: selectedCategoryId,
        address: { street: addressStreet, number: +addressNumber, zipCode: addressZip },
        openingHours,
        tags: isEdit && !tagsModified ? originalTags : selectedTags,
        attachments: attachmentsPayload,
      };

      if (isEdit) {
        experienceData.id = experience.id;
      }

      await onSave(experienceData);
      onClose();
    } catch (e) {
      console.error('Error saving experience:', e);
      alert('Erro ao salvar experiência');
    } finally {
      setLoading(false);
    }
  };

  const tagsAvailable = (categoryId: string | undefined) => {
    if (!categoryId) return availableTags;
    return availableTags.filter((tag) =>
      tag.experienceCategories
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((catRef: any) => catRef?._key?.path?.segments?.at?.(-1))
        .includes(categoryId),
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '1rem',
          backgroundColor: theme.palette.neutrals.formsWhite,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h4" color={theme.palette.neutrals.darkGrey} fontWeight={700}>
          {isEdit ? 'Editar Experiência' : 'Nova Experiência'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl>
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Categoria
            </Typography>
            <RadioGroup
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <Stack direction="row" spacing={1} justifyContent="flex-start" flexWrap="wrap">
                {categories.map((cat) => (
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
                        fontSize: '0.9rem',
                        color: theme.palette.neutrals.mediumGrey,
                      },
                    }}
                  />
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>

          <Input
            icon={bussinessIcon}
            placeholder="Nome fantasia *"
            value={estabName}
            onChange={(val) => setEstabName(val)}
          />

          <Input
            icon={mailIcon}
            placeholder="E-mail *"
            type="email"
            value={estEmail}
            onChange={(val) => setEstEmail(val)}
          />

          <Input
            icon={phoneIcon}
            placeholder="Telefone *"
            type="tel"
            value={estPhone}
            onChange={(val) => {
              const formatted = formatPhone(val);
              setEstPhone(formatted);
            }}
          />

          <Input
            icon={descriptionIcon}
            placeholder="Descrição"
            value={description}
            onChange={(val) => setDescription(val)}
          />

          <Stack
            sx={{
              display: 'grid',
              gridTemplateColumns: '49% 16.5% 31.5%',
              gap: '0.4rem',
            }}
          >
            <Input
              icon={locationIcon}
              placeholder="Endereço"
              value={addressStreet}
              onChange={(val) => setAddressStreet(val)}
            />
            <Input
              placeholder="N°"
              value={addressNumber.toString()}
              onChange={(val) => setAddressNumber(val)}
            />
            <Input
              placeholder="CEP"
              value={addressZip}
              onChange={(val) => {
                const formatted = formatCEP(val);
                setAddressZip(formatted);
              }}
            />
          </Stack>

          <Input
            icon={lockIcon}
            placeholder="CNPJ"
            value={cnpj}
            onChange={(val) => {
              const formatted = formatCNPJ(val);
              setCnpj(formatted);
            }}
          />

          <OpeningHoursInput 
            value={openingHoursMap} 
            onChange={(val) => {
              setOpeningHoursMap(val);
              setOpeningHoursModified(true);
            }} 
          />

          <InputImages onChange={(atts) => setAttachments(atts)} />

          <InputTags
            availableTags={tagsAvailable(selectedCategoryId)}
            initialSelectedTags={selectedTags}
            onChange={(tags) => {
              setSelectedTags(tags);
              setTagsModified(true);
            }}
          />
        </Stack>
      </DialogContent>

      {/* Modal de aviso sobre substituição de imagens */}
      <Dialog
        open={showImageWarning}
        onClose={() => setShowImageWarning(false)}
        PaperProps={{
          sx: {
            borderRadius: '1rem',
            backgroundColor: theme.palette.neutrals.formsWhite,
            maxWidth: '450px',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" color={theme.palette.neutrals.darkGrey} fontWeight={600}>
            Substituir Imagens?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color={theme.palette.neutrals.mediumGrey}>
            Você adicionou novas imagens. Ao salvar, as imagens atuais ({existingImages.length}{' '})
            serão substituídas pelas {attachments.length} nova(s) imagem(ns).
          </Typography>
          <Typography variant="body2" color={theme.palette.neutrals.mediumGrey} sx={{ mt: 2 }}>
            Deseja continuar?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <GradientRoundButton
            onClick={() => setShowImageWarning(false)}
            sx={{
              width: '7rem',
              height: '2.5rem',
              fontWeight: 500,
              fontSize: '0.85rem',
              background: theme.palette.neutrals.mediumGrey,
              '&:hover': {
                background: theme.palette.neutrals.darkGrey,
              },
            }}
          >
            Cancelar
          </GradientRoundButton>
          <GradientRoundButton
            onClick={() => {
              setShowImageWarning(false);
              saveExperience();
            }}
            sx={{ width: '7rem', height: '2.5rem', fontWeight: 500, fontSize: '0.85rem' }}
          >
            Confirmar
          </GradientRoundButton>
        </DialogActions>
      </Dialog>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <GradientRoundButton
          onClick={onClose}
          sx={{
            width: '8rem',
            height: '2.5rem',
            fontWeight: 500,
            fontSize: '0.9rem',
            background: theme.palette.neutrals.mediumGrey,
            '&:hover': {
              background: theme.palette.neutrals.darkGrey,
            },
          }}
        >
          Cancelar
        </GradientRoundButton>
        <GradientRoundButton
          onClick={handleSubmit}
          disabled={loading}
          sx={{ width: '8rem', height: '2.5rem', fontWeight: 500, fontSize: '0.9rem' }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </GradientRoundButton>
      </DialogActions>
    </Dialog>
  );
};
