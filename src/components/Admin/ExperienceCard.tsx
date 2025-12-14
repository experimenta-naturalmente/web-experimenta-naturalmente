import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Experience } from '@/utils/service';

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export const ExperienceCard = ({ experience, onEdit, onDelete }: ExperienceCardProps) => {
  const theme = useTheme();

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
      }}
    >
      <CardContent>
        <Stack spacing={1}>
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

          {experience.description && (
            <Typography
              variant="body2"
              color={theme.palette.neutrals.mediumGrey}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {experience.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
            {experience.email && (
              <Chip
                label={experience.email}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: theme.palette.customPrimaryShades[100],
                  color: theme.palette.customPrimaryShades[700],
                }}
              />
            )}
            {experience.phone && (
              <Chip
                label={experience.phone}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  backgroundColor: theme.palette.customPrimaryShades[100],
                  color: theme.palette.customPrimaryShades[700],
                }}
              />
            )}
          </Stack>

          {experience.tags && experience.tags.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
              {experience.tags.slice(0, 3).map((tag, idx) => {
                const tagLabel = typeof tag === 'string' ? tag : tag?.name || 'Tag';
                return (
                  <Chip
                    key={idx}
                    label={tagLabel}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      backgroundColor: theme.palette.neutrals.lightGrey,
                    }}
                  />
                );
              })}
              {experience.tags.length > 3 && (
                <Chip
                  label={`+${experience.tags.length - 3}`}
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

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
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
