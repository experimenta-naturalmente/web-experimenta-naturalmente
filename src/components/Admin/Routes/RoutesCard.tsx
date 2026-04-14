// import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Route } from '@/utils/service';

interface ExperienceCardProps {
  route: Route;
  onEdit: (route: Route) => void;
  onDelete: (id: string) => void;
}

export const RoutesCard = ({ route: experience, onEdit, onDelete }: ExperienceCardProps) => {
  const theme = useTheme();

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
          </Typography>

          <Divider />

          {experience.experienceList && experience.experienceList.length > 0 && (
            <List sx={{ border: '1px solid #ccc', borderRadius: 1 }}>
              {experience.experienceList
                ?.sort((a, b) => a.order - b.order)
                .slice(0, 3)
                .map((item) => (
                  <ListItem sx={{ mr: '6.25rem' }} key={item.id}>
                    <RadioButtonUncheckedIcon
                      sx={{
                        mr: '0.6rem',
                        fontSize: '1rem',
                        color: theme.palette.customPrimaryShades[600],
                        mt: 0.2,
                      }}
                    />
                    <ListItemText
                      primary={item.name}
                      sx={{
                        '.MuiTypography-root': {
                          fontSize: '1.2rem',
                          color: theme.palette.customPrimaryShades[600],
                        },
                      }}
                    />
                  </ListItem>
                ))}
              {experience.experienceList.length > 3 && (
                <ListItem sx={{ mr: '6.25rem' }}>
                  <ListItemText
                    primary={`+${experience.experienceList.length - 3}`}
                    sx={{ '.MuiTypography-root': { fontSize: '1.2rem' } }}
                  />
                </ListItem>
              )}
            </List>
          )}

          {/* <LocationOnIcon
        sx={{ fontSize: '1rem', color: theme.palette.customPrimaryShades[600], mt: 0.2 }}
        /> */}

          <Divider />

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
