import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Experience } from '@/utils/service';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export const ExperienceCard = ({ experience, onEdit, onDelete }: ExperienceCardProps) => {
  const theme = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const images = experience.attachments?.filter((att) => att.type === 'image') || [];

  // Buscar nome da categoria
  useEffect(() => {
    async function fetchCategoryName() {
      if (!experience.categoryId) return;
      try {
        const catDocRef = doc(db, 'experienceCategories', experience.categoryId);
        const catDoc = await getDoc(catDocRef);
        if (catDoc.exists()) {
          const data = catDoc.data();
          setCategoryName(data.name ?? data.title ?? experience.categoryId);
        } else {
          setCategoryName(experience.categoryId);
        }
      } catch (error) {
        console.warn('Failed to fetch category name:', error);
        setCategoryName(experience.categoryId);
      }
    }
    fetchCategoryName();
  }, [experience.categoryId]);

  // Carrossel automático
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  const formatAddress = () => {
    if (!experience.address) return null;
    const { street, number, zipCode } = experience.address;
    const parts = [];
    if (street) parts.push(street);
    if (number) parts.push(`nº ${number}`);
    if (zipCode) parts.push(`CEP ${zipCode}`);
    return parts.join(', ');
  };

  const formatOpeningHours = () => {
    if (!experience.openingHours || experience.openingHours.length === 0) return null;

    const daysMap: Record<string, string> = {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
      sunday: 'Dom',
    };

    return experience.openingHours
      .filter((hour) => hour.isWorkingDay !== false)
      .map(
        (hour) =>
          `${daysMap[hour.dayOfWeek] || hour.dayOfWeek}: ${hour.openingHour} - ${hour.closingHour}`,
      )
      .join(' | ');
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.neutrals.formsWhite,
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Carrossel de Imagens */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '200px',
          borderRadius: '1rem 1rem 0 0',
          overflow: 'hidden',
          backgroundColor: theme.palette.neutrals.lightGrey,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex].url}
              alt={experience.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {images.length > 1 && (
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                {images.map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor:
                        idx === currentImageIndex
                          ? theme.palette.customPrimaryShades[600]
                          : 'rgba(255,255,255,0.5)',
                      transition: 'background-color 0.3s',
                    }}
                  />
                ))}
              </Stack>
            )}
          </>
        ) : (
          <Typography variant="body2" color={theme.palette.neutrals.mediumGrey}>
            Sem imagens cadastradas
          </Typography>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Stack spacing={1.5}>
          {/* Nome - Categoria */}
          <Typography
            variant="h6"
            color={theme.palette.neutrals.darkGrey}
            fontWeight={600}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {experience.name}
            {categoryName && (
              <Typography
                component="span"
                variant="body2"
                color={theme.palette.customPrimaryShades[600]}
                sx={{ ml: 1 }}
              >
                - {categoryName}
              </Typography>
            )}
          </Typography>

          {/* Descrição */}
          {experience.description && (
            <Typography
              variant="body2"
              color={theme.palette.neutrals.mediumGrey}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {experience.description}
            </Typography>
          )}

          <Divider />

          {/* Email - Telefone */}
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
            {experience.email && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <EmailIcon
                  sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600] }}
                />
                <Typography variant="body2" color={theme.palette.neutrals.darkGrey}>
                  {experience.email}
                </Typography>
              </Stack>
            )}
            {experience.phone && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PhoneIcon
                  sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600] }}
                />
                <Typography variant="body2" color={theme.palette.neutrals.darkGrey}>
                  {experience.phone}
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* CNPJ */}
          {experience.cnpj && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BusinessIcon
                sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600] }}
              />
              <Typography variant="body2" color={theme.palette.neutrals.darkGrey}>
                CNPJ: {experience.cnpj}
              </Typography>
            </Stack>
          )}

          {/* Endereço */}
          {formatAddress() && (
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <LocationOnIcon
                sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600], mt: 0.2 }}
              />
              <Typography variant="body2" color={theme.palette.neutrals.darkGrey}>
                {formatAddress()}
              </Typography>
            </Stack>
          )}

          {/* Horário de Funcionamento */}
          {formatOpeningHours() && (
            <Stack direction="row" spacing={0.5} alignItems="flex-start">
              <AccessTimeIcon
                sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600], mt: 0.2 }}
              />
              <Typography
                variant="body2"
                color={theme.palette.neutrals.darkGrey}
                sx={{ fontSize: '0.75rem' }}
              >
                {formatOpeningHours()}
              </Typography>
            </Stack>
          )}

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {experience.tags.slice(0, 4).map((tag, idx) => {
                const tagLabel = typeof tag === 'string' ? tag : tag?.name || 'Tag';
                return (
                  <Chip
                    key={idx}
                    label={tagLabel}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      backgroundColor: theme.palette.customPrimaryShades[100],
                      color: theme.palette.customPrimaryShades[700],
                    }}
                  />
                );
              })}
              {experience.tags.length > 4 && (
                <Chip
                  label={`+${experience.tags.length - 4}`}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    backgroundColor: theme.palette.neutrals.lightGrey,
                  }}
                />
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => onEdit(experience)}
          sx={{
            color: theme.palette.customPrimaryShades[600],
            '&:hover': {
              backgroundColor: theme.palette.customPrimaryShades[100],
            },
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(experience.id)}
          sx={{
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
