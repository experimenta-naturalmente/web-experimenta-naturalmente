import Image, { StaticImageData } from 'next/image';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';

interface InputProps {
  icon?: StaticImageData;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}

export default function Input({ icon, placeholder, type = 'text', onChange }: InputProps) {
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
      }}
    >
      {icon && (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
          <Image src={icon} alt="icon" width={20} height={20} />
        </Box>
      )}
      <InputBase
        placeholder={placeholder}
        type={type}
        fullWidth
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': placeholder }}
        sx={{
          background: 'transparent',
          '& input': { padding: 0 },
          fontSize: '1rem',
          color: 'rgb(165 163 157)'
        }}
      />
    </Box>
  );
}
