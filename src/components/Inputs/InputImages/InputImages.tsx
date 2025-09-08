import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

type Attachment = {
  file: File;
  base64: string;
};

export default function InputImages({
  onChange,
}: {
  onChange?: (attachments: { file: File; base64: string }[]) => void;
}) {
  const theme = useTheme();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
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

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Imagem muito grande! O limite é 5MB.', 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setAttachments((prev) => {
          const next = [...prev, { file, base64 }];
          onChange?.(next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    if (event.target) event.target.value = '';
  };

  const removeImage = (index: number) => {
    setAttachments((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onChange?.(next);
      return next;
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#FFF9F1',
        p: 1.5,
        width: '100%',
        border: '1px solid #3A502C',
        gap: 1,
        borderRadius: '8px',
        flexWrap: 'wrap',
        minHeight: 56,
      }}
    >
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleImageUpload}
        ref={inputRef}
      />
      {attachments.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={openFileDialog}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <PhotoCameraIcon sx={{ color: 'rgb(165 163 157)' }} />
          </Box>
          <InputBase
            placeholder="Imagens da experiência"
            readOnly
            fullWidth
            sx={{
              background: 'transparent',
              '& input': { padding: 0 },
              fontSize: '1rem',
              color: 'rgb(165 163 157)',
              cursor: 'pointer',
            }}
          />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          {attachments.map((attachment, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                width: 48,
                height: 48,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #ddd',
                mr: 1,
              }}
            >
              <img
                src={attachment.base64}
                alt={`Preview ${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  zIndex: 2,
                }}
                onClick={() => removeImage(index)}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, fontSize: '1rem', color: '#3A502C', lineHeight: 1 }}
                >
                  ×
                </Typography>
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '0.6rem',
                  padding: '0.1rem',
                }}
              >
                {(attachment.file.size / 1024).toFixed(0)}KB
              </Box>
            </Box>
          ))}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={openFileDialog}
          >
            {attachments.length > 0 ? (
              <AddIcon sx={{ color: 'rgb(165 163 157)' }} />
            ) : (
              <PhotoCameraIcon sx={{ color: 'rgb(165 163 157)' }} />
            )}
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.disabled, fontSize: '1rem' }}
            >
              Adicionar mais imagens
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
