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


export const Routes = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info' | 'warning'>(
    'success',
  );

  type Stop = {
    id: string;
    name: string;
    address: string;
  };

  type Route = {
    name: string;
    description: string;
    stops: Stop[];
  };

  const [route, setRoute] = useState<Route>({
    name: '',
    description: '',
    stops: [],
  });
  const [newStop, setNewStop] = useState<Stop>({
    id: '',
    name: '',
    address: '',
  });

  // ---------------- ITEM DRAGGABLE ----------------

  function SortableItem({ stop, onRemove }: { stop: Stop; onRemove: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
      id: stop.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <Card ref={setNodeRef} style={style} sx={{ mb: 2 }}>
        <CardContent
          {...attributes}
          {...listeners}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "grab"
          }}
        >
          <Box>
            <Typography>{stop.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {stop.address}
            </Typography>
          </Box>

          <IconButton onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    );
  }

  // valida route e newstop

  if (!route || !newStop) {
    return <div>Carregando...</div>;
  }

  // -------- ADD STOP --------

  const handleAddStop = () => {
    if (!newStop.name) return;

    const stop: Stop = {
      id: crypto.randomUUID(),
      name: newStop.name,
      address: newStop.address
    };

    setRoute({
      ...route,
      stops: [...route.stops, stop]
    });

    setNewStop({ id: '', name: '', address: '' });
  };

  // -------- REMOVE STOP --------

  const handleRemoveStop = (id: string) => {
    setRoute({
      ...route,
      stops: route.stops.filter((s) => s.id !== id)
    });
  };

  // -------- DRAG END --------

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = route.stops.findIndex((item) => item.id === active.id);
    const newIndex = route.stops.findIndex((item) => item.id === over.id);
    const newStops = arrayMove(route.stops, oldIndex, newIndex);

    setRoute({
      ...route,
      stops: newStops
    });
  };

  // -------- SUBMIT --------

  const handleSubmit = () => {
    console.log(route);
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
        Nova Rota
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-evenly"
          alignItems="center"
          gap={2}
        ></Stack>
        <Box sx={{ mx: 'auto', mt: 4 }}>
          <Typography variant="h5">Criar Rota Turística</Typography>
          <TextField
            label="Nome da rota"
            fullWidth
            margin="normal"
            value={route.name}
            onChange={(e) => setRoute({ ...route, name: e.target.value })}
          />

          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={1}
            margin="normal"
            value={route.description}
            onChange={(e) => setRoute({ ...route, description: e.target.value })}
          />

          <Typography variant="h6" mt={3}>
            Paradas (arraste para ordenar)
          </Typography>

          {/* Form de nova parada */}
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Nome do local"
              fullWidth
              value={newStop.name}
              onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
            />

            <TextField
              label="Endereço"
              fullWidth
              value={newStop.address}
              onChange={(e) => setNewStop({ ...newStop, address: e.target.value })}
            />

            <Button variant="contained" onClick={handleAddStop}>
              Adicionar
            </Button>
          </Box>

          {/* Lista de paradas */}
          <Box mt={2}>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={route.stops.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {route.stops.map((stop) => (
                  <SortableItem
                    key={stop.id}
                    stop={stop}
                    onRemove={() => handleRemoveStop(stop.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Box>

          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
            Salvar rota
          </Button>
        </Box>
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
