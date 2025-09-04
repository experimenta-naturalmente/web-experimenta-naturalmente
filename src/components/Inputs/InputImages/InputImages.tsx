import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { GradientRoundButton } from '@/components/UI/Buttons/RoundButton.style';

type Attachment = {
  file: File;
  base64: string;
};

export default function InputImages({ onChange }: { onChange?: (attachments: { file: File; base64: string }[]) => void }) {
  const theme = useTheme();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return; // Ignore files > 5MB

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
    // reset input value so same file can be selected again if needed
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
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 1, color: theme.palette.neutrals?.darkGrey || '#333' }}>
        Adicionar fotos (máx. 5MB por imagem):
      </Typography>
      <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" multiple type="file" onChange={handleImageUpload} ref={inputRef} />
      <GradientRoundButton sx={{ width: '100%', height: '2.5rem', fontWeight: 500, fontSize: '0.9rem' }} onClick={openFileDialog}>
        Selecionar Imagens
      </GradientRoundButton>

      {attachments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Imagens selecionadas ({attachments.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((attachment, index) => (
              <Box key={index} sx={{ position: 'relative', width: 80, height: 80, borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={attachment.base64} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }} onClick={() => removeImage(index)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', textAlign: 'center', fontSize: '0.6rem', padding: '0.1rem' }}>
                  {(attachment.file.size / 1024).toFixed(0)}KB
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};