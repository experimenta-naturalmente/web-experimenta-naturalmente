import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  useTheme,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import backgroundImg from '@/assets/BackgroundRegister.png';
import { TopBar } from '@/components/TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import { ExperienceCard } from '@/components/Admin/ExperienceCard';
import { ExperienceModal } from '@/components/Admin/ExperienceModal';
import {
  getAllExperiences,
  deleteExperience,
  updateExperience,
  createExperienceOnly,
  Experience,
  ExperiencePayload,
} from '@/utils/service';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

export const AdminPanel = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        // Usuário não é admin, redireciona para home
        router.push('/home');
      }
    }
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    loadExperiences();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredExperiences(experiences);
    } else {
      const filtered = experiences.filter(
        (exp) =>
          exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredExperiences(filtered);
    }
  }, [searchTerm, experiences]);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await getAllExperiences();
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
      showToast('Erro ao carregar experiências', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedExperience(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setExperienceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete) return;

    try {
      await deleteExperience(experienceToDelete);
      showToast('Experiência deletada com sucesso', 'success');
      await loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      showToast('Erro ao deletar experiência', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const handleSave = async (experienceData: Partial<ExperiencePayload> & { id?: string }) => {
    try {
      if (experienceData.id) {
        // Update existing
        const { id, ...updateData } = experienceData;
        await updateExperience(id, updateData);
        showToast('Experiência atualizada com sucesso', 'success');
      } else {
        // Create new
        if (!user?.uid) {
          showToast('Erro: usuário não autenticado', 'error');
          return;
        }
        await createExperienceOnly(experienceData as ExperiencePayload, user.uid);
        showToast('Experiência criada com sucesso', 'success');
      }
      await loadExperiences();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      showToast('Erro ao salvar experiência', 'error');
    }
  };

  if (authLoading || loading) {
    return (
      <Stack
        width="100%"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundImage: `url(${backgroundImg.src})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <CircularProgress sx={{ color: theme.palette.customPrimaryShades[600] }} />
      </Stack>
    );
  }

  return (
    <Stack
      width="100%"
      minHeight="100vh"
      padding={'1.5rem'}
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <TopBar />

      <Stack
        width="90%"
        maxWidth="1400px"
        alignSelf="center"
        mt={4}
        spacing={3}
        sx={{
          backgroundColor: theme.palette.neutrals.formsWhite,
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography variant="h3" color={theme.palette.neutrals.darkGrey} fontWeight={700}>
            Painel Administrativo
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-evenly"
          alignItems="center"
          gap={2}
        >
          <TextField
            placeholder="Buscar experiências..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.neutrals.mediumGrey }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: theme.palette.neutrals.formsWhite,
                borderRadius: '28px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid ' + theme.palette.neutrals.mediumGrey,
                },
                height: 'fit-content',
                width: { xs: '100%', sm: '600px' },
                fontSize: '1.2rem',
              },
            }}
          />

          <GradientRoundButton
            onClick={handleCreate}
            startIcon={<AddIcon />}
            sx={{ height: '2.75rem', px: 3, fontWeight: 500, fontSize: '0.95rem' }}
          >
            Nova Experiência
          </GradientRoundButton>
        </Stack>

        {filteredExperiences.length === 0 && !loading && (
          <Stack alignItems="center" py={8}>
            <Typography variant="h6" color={theme.palette.neutrals.mediumGrey}>
              {searchTerm
                ? 'Nenhuma experiência encontrada'
                : 'Nenhuma experiência cadastrada ainda'}
            </Typography>
          </Stack>
        )}

        <Grid container spacing={3}>
          {filteredExperiences.map((experience) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={experience.id}>
              <ExperienceCard experience={experience} onEdit={handleEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      </Stack>

      <ExperienceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        experience={selectedExperience}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '1rem' },
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight={600}>
            Confirmar exclusão
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar esta experiência?</Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: theme.palette.neutrals.mediumGrey }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: '8px' }}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

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
