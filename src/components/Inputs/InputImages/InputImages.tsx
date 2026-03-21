import React, { useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type Attachment = {
  file: File;
  base64: string;
};

export default function InputImages({
  onChange,
}: {
  onChange?: (attachments: { file: File; base64: string }[]) => void;
}) {
  const MAX_IMAGES = 6;
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const MAX_DIMENSION = 1600;
  const TARGET_BASE64_SIZE = 180 * 1024;

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

  const base64SizeInBytes = (base64: string) => {
    const data = base64.split(',')[1] ?? '';
    return Math.ceil((data.length * 3) / 4);
  };

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const compressImageToBase64 = async (file: File) => {
    const sourceDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const image = await loadImage(sourceDataUrl);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
    const targetWidth = Math.max(1, Math.round(image.width * scale));
    const targetHeight = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Não foi possível processar a imagem');
    }

    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    let quality = 0.85;
    let output = canvas.toDataURL('image/jpeg', quality);

    while (base64SizeInBytes(output) > TARGET_BASE64_SIZE && quality > 0.45) {
      quality -= 0.1;
      output = canvas.toDataURL('image/jpeg', quality);
    }

    return output;
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let nextAttachments = [...attachments];

    for (const file of Array.from(files)) {
      if (nextAttachments.length >= MAX_IMAGES) {
        showToast(`Limite de ${MAX_IMAGES} imagens por experiência.`, 'warning');
        break;
      }

      if (file.size > MAX_FILE_BYTES) {
        showToast('Imagem muito grande. O limite por arquivo é 5MB.', 'warning');
        continue;
      }

      try {
        const base64 = await compressImageToBase64(file);
        nextAttachments = [...nextAttachments, { file, base64 }];
      } catch {
        showToast('Falha ao processar uma imagem. Tente outra.', 'error');
      }
    }

    setAttachments(nextAttachments);
    onChange?.(nextAttachments);

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
              <Image
                src={attachment.base64}
                alt={`Preview ${index}`}
                width={48}
                height={48}
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

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
