import { Stack, Typography } from "@mui/material"
import { Start } from "./Login/Start";
import { DownloadApp } from "./DownloadApp/DownloadApp";

export const LandingPage = () => {
  return (
    <Stack height={'fit-content'} width={'100%'}>
        <Start/>
        <DownloadApp/>
    </Stack>
  );
}