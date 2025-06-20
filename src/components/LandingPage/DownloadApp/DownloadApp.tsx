import Box from "@mui/material/Box"
import AppMockSVG from "../../../assets/Cellphone.svg"
import ShadowSVG from "../../../assets/Shadow.svg"
import { Stack } from "@mui/material"

export const DownloadApp = () => {
    return(
        <Box display={'flex'} width={'100%'} height={'70rem'}>
            <Stack alignItems={'center'} width={'30%'} height={'50%'}>
                <AppMockSVG/>
                <Box display={'flex'} sx={{paddingLeft: '1.5rem'}}>
                    <ShadowSVG/>
                </Box>
            </Stack>
        </Box>
    )
}