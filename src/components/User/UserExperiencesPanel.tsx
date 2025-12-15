import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  useTheme,
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
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import backgroundImg from '@/assets/BackgroundRegister.png';
import { TopBar } from '@/components/TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import { ExperienceCard } from '@/components/Admin/ExperienceCard';
import { ExperienceModal } from '@/components/Admin/ExperienceModal';
import {
  getExperiencesByOwnerId,
  deleteExperience,
  updateExperience,
  createExperienceOnly,
  Experience,
  ExperiencePayload,
} from '@/utils/service';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

export const UserExperiencesPanel = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

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
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadUserExperiences();
    }
  }, [user]);

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

  const loadUserExperiences = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getExperiencesByOwnerId(user.uid);
      setExperiences(data);
      setFilteredExperiences(data);
    } catch (error) {
      console.error('Error loading experiences:', error);
      showToast('Erro ao carregar experiências', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedExperience(null);
    setModalOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setSelectedExperience(experience);
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
      loadUserExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      showToast('Erro ao deletar experiência', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const handleSave = async (experienceData: Partial<ExperiencePayload> & { id?: string }) => {
    if (!user) return;

    try {
      if (selectedExperience) {
        // Atualizar experiência existente
        await updateExperience(selectedExperience.id, experienceData);
        showToast('Experiência atualizada com sucesso', 'success');
      } else {
        // Criar nova experiência
        await createExperienceOnly(experienceData as ExperiencePayload, user.uid);
        showToast('Experiência criada com sucesso', 'success');
      }
      setModalOpen(false);
      loadUserExperiences();
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
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Stack
      width="100%"
      minHeight="100vh"
      padding="1.5rem"
      sx={{
        backgroundImage: `url(${backgroundImg.src})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <TopBar isLogin={false} />

      <Stack width="100%" gap="2rem" mt={4}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            variant="h4"
            color={theme.palette.neutrals.darkGrey}
            fontWeight={700}
            sx={{
              backgroundColor: theme.palette.neutrals.formsWhite,
              padding: '1rem 2rem',
              borderRadius: '1rem',
            }}
          >
            Minhas Experiências
          </Typography>

          <GradientRoundButton
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              height: '3rem',
              fontWeight: 600,
              fontSize: '1rem',
              paddingX: '2rem',
            }}
          >
            Nova Experiência
          </GradientRoundButton>
        </Stack>

        {/* Search Bar */}
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
          }}
          sx={{
            backgroundColor: theme.palette.neutrals.formsWhite,
            borderRadius: '0.5rem',
            maxWidth: '500px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.customPrimaryShades[400],
              },
              '&:hover fieldset': {
                borderColor: theme.palette.customPrimaryShades[500],
              },
            },
          }}
        />

        {/* Experiences Grid */}
        {filteredExperiences.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              backgroundColor: theme.palette.neutrals.formsWhite,
              padding: '3rem',
              borderRadius: '1rem',
              minHeight: '300px',
            }}
          >
            <Typography variant="h6" color={theme.palette.neutrals.mediumGrey}>
              {searchTerm
                ? 'Nenhuma experiência encontrada'
                : 'Você ainda não cadastrou nenhuma experiência'}
            </Typography>
            {!searchTerm && (
              <GradientRoundButton
                startIcon={<AddIcon />}
                onClick={handleCreate}
                sx={{
                  mt: 2,
                  height: '2.5rem',
                  fontWeight: 500,
                }}
              >
                Cadastrar Primeira Experiência
              </GradientRoundButton>
            )}
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Box>
        )}
      </Stack>

      {/* Experience Modal */}
      <ExperienceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        experience={selectedExperience}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '1rem',
            padding: '1rem',
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Confirmar Exclusão
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar esta experiência?</Typography>
          <Typography color={theme.palette.error.main} sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem' }}>
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
            sx={{ fontWeight: 600 }}
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
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
