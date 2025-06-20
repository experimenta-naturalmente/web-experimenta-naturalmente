import { Button } from "@mui/material"
import { CustomNavigationButton } from "./NavigationButton.style";

export interface IProps {
    label: string;
}
export const NavigationButton = ({label}: IProps) => {
    return (
        <CustomNavigationButton>{label}</CustomNavigationButton>
    )
}