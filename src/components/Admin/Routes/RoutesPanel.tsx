import { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  useTheme,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import backgroundImg from '@/assets/BackgroundRegister.png';
import { TopBar } from '@/components/TopBar/TopBar';
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RoutesModal } from './RoutesModal';
import { createRouteOnly, Experience, getAllExperiences, getAllRoutes, Route, RoutePayload } from '@/utils/service';
import { RoutesCard } from './RoutesCard';


export const Routes = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>(
    'success',
  );

  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = async (routeData: Partial<RoutePayload> & { id?: string }) => {
    try {
      if (routeData.id) {
        showToast('Rota atualizada com sucesso', 'success');
      } else {
        // Create new
        if (!user?.uid) {
          showToast('Erro: usuário não autenticado', 'error');
          return;
        }
        await createRouteOnly(routeData as RoutePayload, user.uid);
        showToast('Rota criada com sucesso', 'success');
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving route:', error);
      showToast('Erro ao salvar rota', 'error');
    }
  };

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
    setLoading(false);
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    loadExperiences();
    //loadCategories();
  }, []);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const data = await getAllRoutes();
      setFilteredRoutes(data);
    } catch (error) {
      console.error('Error loading routes:', error);
      showToast('Erro ao carregar rotas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route: Route) => {
    // setSelectedExperience(experience);
    setModalOpen(true);
  };

  const handleCreate = () => {
    // setSelectedExperience(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // setExperienceToDelete(id);
    // setDeleteDialogOpen(true);
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
            Rotas
          </Typography>
        </Stack>
        Listagem
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-evenly"
          alignItems="center"
          gap={2}
        >
          <TextField
            placeholder="Buscar rotas..."
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
                height: '2.75rem',
                width: { xs: '100%', sm: '600px' },
                fontSize: '0.95rem',
              },
            }}
          />
          <GradientRoundButton
            onClick={handleCreate}
            sx={{ height: '2.75rem', px: 3, fontWeight: 500, fontSize: '0.95rem' }}
          >
            Nova Rota
          </GradientRoundButton>
        </Stack>
        <Grid container spacing={3}>
          {filteredRoutes.map((experience) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={experience.id}>
              <RoutesCard route={experience} onEdit={handleEdit} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
        <RoutesModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
        <Snackbar
          open={toastOpen}
          autoHideDuration={4000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setToastOpen(false)}
            severity={toastSeverity}
            sx={{ width: '100%' }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
};
