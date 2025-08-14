import React from 'react';
import Image from 'next/image';
import hourIcon from '@/assets/HourIcon.png';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type DayHours = {
  open?: string; // HH:MM
  close?: string; // HH:MM
  closed?: boolean;
};

export type OpeningHours = Record<DayKey, DayHours>;

const DAY_ORDER: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Segunda' },
  { key: 'tue', label: 'Terça' },
  { key: 'wed', label: 'Quarta' },
  { key: 'thu', label: 'Quinta' },
  { key: 'fri', label: 'Sexta' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
];

const emptyHours = (): OpeningHours => ({
  mon: { open: '09:00', close: '17:00', closed: false },
  tue: { open: '09:00', close: '17:00', closed: false },
  wed: { open: '09:00', close: '17:00', closed: false },
  thu: { open: '09:00', close: '17:00', closed: false },
  fri: { open: '09:00', close: '17:00', closed: false },
  sat: { open: '09:00', close: '13:00', closed: false },
  sun: { open: '00:00', close: '00:00', closed: true },
});

interface Props {
  value?: OpeningHours;
  onChange?: (val: OpeningHours) => void;
  label?: string;
}

export default function OpeningHoursInput({
  value,
  onChange,
  label = 'Horário de funcionamento',
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<OpeningHours>(value ?? emptyHours());

  React.useEffect(() => {
    if (value) setState(value);
  }, [value]);

  const handleDayChange = (
    day: DayKey,
    field: 'open' | 'close' | 'closed',
    val: string | boolean,
  ) => {
    setState((s) => ({ ...s, [day]: { ...s[day], [field]: val } }));
  };

  const handleSave = () => {
    onChange?.(state);
    setOpen(false);
  };

  const summary = React.useMemo(() => {
    const openDays = DAY_ORDER.filter((d) => !state[d.key].closed);
    if (openDays.length === 0) return 'Fechado';
    const first = openDays[0];
    const sample = state[first.key];
    return `${first.label} ${sample.open}-${sample.close} (${openDays.length} dias)`;
  }, [state]);

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFF9F1',
          p: 1.5,
          width: '100%',
          border: '1px solid #3A502C',
          gap: 1,
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        role="button"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <Image src={hourIcon} alt="hour icon" width={20} height={20} />
        </Box>
        <Typography sx={{ color: 'rgb(217 213 206)', fontSize: '1rem' }}>{label}</Typography>
        {/* <IconButton size="small" aria-label="editar horário">
          <EditIcon fontSize="small" />
        </IconButton> */}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Horário de funcionamento</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {DAY_ORDER.map((d) => {
              const day = d.key;
              const info = state[day];
              return (
                <Box key={day} display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 120 }}>
                    <Typography>{d.label}</Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!info.closed}
                        onChange={(e) => handleDayChange(day, 'closed', e.target.checked)}
                      />
                    }
                    label="Fechado"
                    sx={{ mr: 2 }}
                  />
                  <TextField
                    label="Abertura"
                    type="time"
                    value={info.open ?? ''}
                    onChange={(e) => handleDayChange(day, 'open', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    disabled={!!info.closed}
                    sx={{ width: 150 }}
                  />
                  <TextField
                    label="Fechamento"
                    type="time"
                    value={info.close ?? ''}
                    onChange={(e) => handleDayChange(day, 'close', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    disabled={!!info.closed}
                    sx={{ width: 150 }}
                  />
                </Box>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
