import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

type Tag = { id: number | string; name: string };

export default function InputTags({
  availableTags = [],
  initialSelectedTags = [],
  onChange,
}: {
  availableTags?: Tag[];
  initialSelectedTags?: string[];
  onChange?: (selected: string[]) => void;
}) {
  const theme = useTheme();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  console.log('Rendering InputTags with availableTags: ', availableTags);

  // Atualizar selectedTags quando initialSelectedTags mudar
  useEffect(() => {
    setSelectedTags(initialSelectedTags);
  }, [initialSelectedTags]);

  useEffect(() => {
    console.log('Selected tags changed: ', selectedTags);
    onChange?.(selectedTags);
  }, [selectedTags, onChange]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((tag) => tag !== tagName) : [...prev, tagName],
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="body2"
        sx={{ mb: 1, color: theme.palette.neutrals?.darkGrey || theme.palette.text.primary }}
      >
        Selecione as tags:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {availableTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            onClick={() => handleTagToggle(tag.name)}
            color={selectedTags.includes(tag.name) ? 'primary' : 'default'}
            variant={selectedTags.includes(tag.name) ? 'filled' : 'outlined'}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: selectedTags.includes(tag.name)
                  ? theme.palette.primary.main
                  : theme.palette.grey[200],
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
