import { Box, Stack, Typography } from '@mui/material';
import { DownloadButton } from './DownloadAppButton.style';
import Image from 'next/image';
export interface IProps {
  icon: string;
  title: string;
  subtitle: string;
  url: string;
}
export const DownloadAppButton = ({ icon, title, subtitle }: IProps) => {
  return (
    <DownloadButton>
      <Box position="relative" width={'30%'} height={'100%'}>
        <Image src={icon} alt="Download Icon" fill style={{ objectFit: 'contain' }} />
      </Box>
      <Stack width={'100%'} height={'100%'} justifyContent={'center'}>
        <Typography
          variant="button"
          textTransform={'none'}
          fontSize={'40%'}
          color="white"
          sx={{ lineHeight: 1.3 }}
        >
          {subtitle}
        </Typography>
        <Typography
          variant="body1"
          fontSize={'65%'}
          fontWeight={700}
          color="white"
          sx={{ lineHeight: 1.3 }}
        >
          {title}
        </Typography>
      </Stack>
    </DownloadButton>
  );
};
