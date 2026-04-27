import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Autocomplete,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  useTheme,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Delete } from "@mui/icons-material";
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import Input from '@/components/Inputs/Input/Input';
import OpeningHoursInput from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import type { OpeningHours as OpeningHoursMap } from '@/components/Inputs/OpeningHoursInput/OpeningHoursInput';
import bussinessIcon from '@/assets/BussinessIcon.png';
import { ExperienceRoute, OpeningHourItem, Route, RoutePayload } from '@/utils/service';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RoutesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (route: Partial<RoutePayload> & { id?: string }) => Promise<void>;
  route?: Route | null;
}

export const RoutesModal = ({ open, onClose, onSave, route }: RoutesModalProps) => {
  const theme = useTheme();
  const isEdit = !!route;

  const [loading, setLoading] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [openingHoursMap, setOpeningHoursMap] = useState<OpeningHoursMap | undefined>(undefined);
  const [originalOpeningHours, setOriginalOpeningHours] = useState<OpeningHourItem[] | undefined>(undefined);
  const [openingHoursModified, setOpeningHoursModified] = useState(false);
  const [returnToOrigin, setReturnToOrigin] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceRoute | null>(null);
  // Options to select
  const [experienceOptions, setExperienceOptions] = useState<ExperienceRoute[]>([]);
  // Selected and order list
  const [experienceList, setExperienceList] = useState<ExperienceRoute[] | undefined>(undefined);

  const DAY_KEY_TO_NAME: Record<string, string> = {
    mon: 'monday',
    tue: 'tuesday',
    wed: 'wednesday',
    thu: 'thursday',
    fri: 'friday',
    sat: 'saturday',
    sun: 'sunday',
  };

  const handleChangeRadio = (event: { target: { value: string } }) => {
    // O value vem como string, então convertemos para boolean
    setReturnToOrigin(event.target.value === 'true');
  };

  const addExperience = () => {
    if (!selectedExperience) return;
    // Verifica se já existe
    const exists = experienceList?.find((exp) => exp.id === selectedExperience.id);
    if (exists) return;
    // Adiciona à lista
    setExperienceList([...(experienceList ?? []), selectedExperience]);
    // Limpa seleção
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!experienceList) return;

    const newList = [...experienceList];

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newList.length) return;

    // troca
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];

    // recalcula order
    const reordered = newList.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    setExperienceList(reordered);
  };

  const removeItem = (id: number) => {
    if (!experienceList) return;

    const filtered = experienceList.filter((item) => item.id !== id);

    // reordena depois de remover
    const reordered = filtered.map((item, i) => ({
      ...item,
      order: i + 1,
    }));

    setExperienceList(reordered);
  };

  useEffect(() => {
    async function loadExperiences() {
      try {
        let order = 0;
        const experiencesSnap = await getDocs(collection(db, 'experiences'));
        const experiences: {
          id: number;
          name: string;
          order: number;
        }[] = [];
        experiencesSnap.docs.forEach((doc) => {
          const data = doc.data();
          experiences.push({
            id: order,
            name: data.name,
            order: order++,
          });
        });
        setExperienceOptions(experiences);
      } catch (e) {
        console.warn('Failed to load experiences', e);
      }
    }
    loadExperiences();
  }, [isEdit]);

  useEffect(() => {
    // Edit Load Data
    if (route) {
      setRouteName(route.name || '');

      setExperienceList(route.experienceList);

      setReturnToOrigin(route.isLoop);

      // Salvar horários de funcionamento originais
      setOriginalOpeningHours(route.openingHours);

      // Convert opening hours to map format
      if (route.openingHours && route.openingHours.length > 0) {
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

        route.openingHours.forEach((hour) => {
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
      setRouteName('');
      setExperienceList([]);
      setReturnToOrigin(false);
      setOpeningHoursMap(undefined);
      setOriginalOpeningHours(undefined);
      setOpeningHoursModified(false);
    }
  }, [route]);

  const handleSubmit = async () => {
    if (!routeName || !openingHoursMap) {
      alert('Preencha os campos obrigatórios: Experiencias, Nome, e Horário');
      return;
    }

    await saveRoute();
  };

  const saveRoute = async () => {
    setLoading(true);
    try {
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

      const routeData: Partial<RoutePayload> & { id?: string } = {
        name: routeName,
        isLoop: returnToOrigin,
        ...(openingHours ? { openingHours } : {}),
        ...(experienceList ? { experienceList } : {}),
      };
      //name: string;
      //isLoop: boolean;
      //openingHours?: OpeningHourItem[];
      //experiences?: ExperienceRoute[];

      if (isEdit) {
        routeData.id = route.id;
      }

      const estimatedBytes = new TextEncoder().encode(JSON.stringify(routeData)).length;
      if (estimatedBytes > 950000) {
        alert(
          'O conteúdo da experiência está muito grande para o banco de dados. Reduza a quantidade/tamanho das imagens e tente novamente.',
        );
        return;
      }

      await onSave(routeData);
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
        <Typography
          variant="h4"
          component="span"
          color={theme.palette.neutrals.darkGrey}
          fontWeight={700}
        >
          {isEdit ? 'Editar Rota' : 'Nova Rota'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row">
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Autocomplete
                sx={{ fontSize: '0.9rem' }}
                options={experienceOptions}
                getOptionLabel={(option) => option.name}
                value={selectedExperience || null}
                onChange={(_e, newValue) => setSelectedExperience(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Experiência"
                    sx={{ width: '300px', fontSize: '0.9rem' }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id} // 👈 importante
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={addExperience}
                disabled={!selectedExperience}
              >
                Adicionar
              </Button>

              <Stack>
                <Typography
                  variant="body2"
                  color={theme.palette.neutrals.darkGrey}
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Início
                </Typography>
                <List sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
                  {experienceList
                    ?.sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <ListItem
                        sx={{ mr: '6.25rem' }}
                        key={item.id}
                        secondaryAction={
                          <Box>
                            <IconButton
                              onClick={() => moveItem(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUpward />
                            </IconButton>
                            <IconButton
                              onClick={() => moveItem(index, 'down')}
                              disabled={index === experienceList?.length - 1}
                            >
                              <ArrowDownward />
                            </IconButton>
                            <IconButton onClick={() => removeItem(item.id)}>
                              <Delete />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={item.name}
                          sx={{ '.MuiTypography-root': { fontSize: '1.2rem' } }}
                        />
                      </ListItem>
                    ))}
                </List>
                <Typography
                  variant="body2"
                  color={theme.palette.neutrals.darkGrey}
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Destino
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <FormControl>
            <Typography
              variant="body2"
              color={theme.palette.neutrals.darkGrey}
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Retornar ao ponto de origem?
            </Typography>
            <RadioGroup
              row
              value={returnToOrigin.toString()} // precisa ser string
              onChange={handleChangeRadio}
              sx={{ fontSize: '0.9rem', color: theme.palette.neutrals.mediumGrey }}
            >
              <FormControlLabel
                value="true"
                control={
                  <Radio
                    sx={{
                      color: theme.palette.neutrals.mediumGrey,
                      '&.Mui-checked': { color: theme.palette.customPrimaryShades[700] },
                      transform: 'scale(0.85)',
                    }}
                  />
                }
                label="Sim"
                sx={{
                  '.MuiTypography-root': {
                    fontSize: '0.9rem',
                    color: theme.palette.neutrals.mediumGrey,
                  },
                }}
              />
              <FormControlLabel
                value="false"
                control={
                  <Radio
                    sx={{
                      color: theme.palette.neutrals.mediumGrey,
                      '&.Mui-checked': { color: theme.palette.customPrimaryShades[700] },
                      transform: 'scale(0.85)',
                    }}
                  />
                }
                label="Não"
                sx={{
                  '.MuiTypography-root': {
                    fontSize: '0.9rem',
                    color: theme.palette.neutrals.mediumGrey,
                  },
                }}
              />
            </RadioGroup>
          </FormControl>

          <Input
            icon={bussinessIcon}
            placeholder="Nome da Rota *"
            value={routeName}
            onChange={(val) => setRouteName(val)}
          />
          <OpeningHoursInput
            value={openingHoursMap}
            onChange={(val) => {
              setOpeningHoursMap(val);
              setOpeningHoursModified(true);
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
