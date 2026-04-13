import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Experience } from '@/utils/service';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export const RoutesCard = ({ experience, onEdit, onDelete }: ExperienceCardProps) => {
  const theme = useTheme();
  const [categoryName, setCategoryName] = useState<string | null>(null);

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

          <Divider />

          {/* <LocationOnIcon
        sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600], mt: 0.2 }}
        /> */}

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
          {/* {experience.tags && experience.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}> */}
          {/* {experience.tags.slice(0, 4).map((tag, idx) => {
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
              })} */}
          {/* {experience.tags.length > 4 && (
                <Chip
                  label={`+${experience.tags.length - 4}`}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    backgroundColor: theme.palette.neutrals.lightGrey,
                  }}
                />
              )} */}
          {/* </Stack>
          )} */}
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
