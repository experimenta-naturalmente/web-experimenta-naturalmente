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
import OpeningHoursInput from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import type { OpeningHours as OpeningHoursMap } from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import bussinessIcon from '@/assets/BussinessIcon.png';
import { Experience, ExperiencePayload, Tag, OpeningHourItem } from '@/utils/service';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RoutesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (experience: Partial<ExperiencePayload> & { id?: string }) => Promise<void>;
  experience?: Experience | null;
}

export const RoutesModal = ({ open, onClose, onSave, experience }: RoutesModalProps) => {
  const theme = useTheme();
  const isEdit = !!experience;

  const [estabName, setEstabName] = useState('');
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
  const [loading, setLoading] = useState(false);
  const [originalTags, setOriginalTags] = useState<Tag[]>([]);
  const [originalOpeningHours, setOriginalOpeningHours] = useState<OpeningHourItem[] | undefined>(undefined);
  const [openingHoursModified, setOpeningHoursModified] = useState(false);
  const [tagsModified, setTagsModified] = useState(false);

  const DAY_KEY_TO_NAME: Record<string, string> = {
    mon: 'monday',
    tue: 'tuesday',
    wed: 'wednesday',
    thu: 'thursday',
    fri: 'friday',
    sat: 'saturday',
    sun: 'sunday',
  };

  const toDateTimeLocalValue = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours(),
    )}:${pad(date.getMinutes())}`;
  };

  const toIsoDateString = (value?: string) => {
    if (!value) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
  };

  const selectedCategoryName =
    categories.find((category) => category.id === selectedCategoryId)?.name?.toLowerCase() ?? '';
  const isEventCategory = selectedCategoryName.includes('evento');

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
      setSelectedCategoryId(experience.categoryId);

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
      setOpeningHoursMap(undefined);
      setSelectedTags([]);
      setOriginalTags([]);
      setOriginalOpeningHours(undefined);
      setOpeningHoursModified(false);
      setTagsModified(false);
    }
  }, [experience]);

  const handleSubmit = async () => {
    if (!estabName || !selectedCategoryId) {
      alert('Preencha os campos obrigatórios: Nome, E-mail, Telefone e Categoria');
      return;
    }

    await saveExperience();
  };

  const saveExperience = async () => {
    setLoading(true);
    try {
      // Usar horários originais se não foi modificado pelo usuário
      let openingHours;
      if (isEventCategory) {
        openingHours = undefined;
      } else if (isEdit && !openingHoursModified && originalOpeningHours) {
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
        categoryId: selectedCategoryId,
        tags: isEdit && !tagsModified ? originalTags : selectedTags,
        ...(openingHours ? { openingHours } : {}),
      };

      if (isEdit) {
        experienceData.id = experience.id;
      }

      const estimatedBytes = new TextEncoder().encode(JSON.stringify(experienceData)).length;
      if (estimatedBytes > 950000) {
        alert(
          'O conteúdo da experiência está muito grande para o banco de dados. Reduza a quantidade/tamanho das imagens e tente novamente.',
        );
        return;
      }

      await onSave(experienceData);
      onClose();
    } catch (e) {
      console.error('Error saving experience:', e);
      const message = e instanceof Error ? e.message : String(e);
      if (message.includes('exceeds the maximum allowed size')) {
        alert(
          'O documento excedeu 1MB no banco de dados. Reduza a quantidade/tamanho das imagens para salvar.',
        );
      } else {
        alert('Erro ao salvar experiência');
      }
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
          {isEdit ? 'Editar Rota' : 'Nova Rota'}
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

          {!isEventCategory && (
            <OpeningHoursInput
              value={openingHoursMap}
              onChange={(val) => {
                setOpeningHoursMap(val);
                setOpeningHoursModified(true);
              }}
            />
          )}

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
