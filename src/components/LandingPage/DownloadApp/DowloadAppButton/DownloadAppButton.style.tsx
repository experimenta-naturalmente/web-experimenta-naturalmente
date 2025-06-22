import { Box, styled } from "@mui/material";

export const DownloadButton = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "10rem",
  height: "3rem",
  backgroundColor: 'black',
  borderRadius: "0.8rem",
  alignItems: "center",
  justifyContent: "flex-start",
  cursor: "pointer",
  padding: "0.8rem",
  gap: "0.5rem",
}));