import { Box, Button } from "@mui/material";
import styles from "../styles/TabHeaderButton.module.css";
import CloseIcon from '@mui/icons-material/Close';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';

interface TabHeaderButtonProps {
    name: string;
    setActive: (name: string) => void;
    active: boolean;
}

export default function TabHeaderButton({ active, name, setActive }: TabHeaderButtonProps) {
    return (
        <Button
            className={styles.tabHeaderButton}
            onClick={() => setActive(name)}
            sx={{
                background: active ? "var(--exxpenses-second-bg-color)" : "none",
                "&:hover": {
                    background: active ? "var(--exxpenses-second-bg-color)" : "var(--exxpenses-second-bg-color)"
                },
                paddingX: "10px",
                marginRight: "10px"
            }}
        >
            {name}
        </Button>
    )
}

interface CategoryHeaderButtonProps {
    name: string;
    active: boolean;
    setActive: (name: string) => void;
    remove: (name: string) => void;
};

export function CategoryHeaderButton({ active, name, setActive, remove }: CategoryHeaderButtonProps) {
    return (
        <Box
            sx={{
                background: active ? "var(--exxpenses-second-bg-color)" : "none",
                paddingX: "10px",
                "&:hover": {
                    background: active ? "var(--exxpenses-second-bg-color)" : "var(--exxpenses-second-bg-color)"
                }
            }}
            className={styles.categoryHeaderButtonContainer}
        >
            <Button
                onClick={() => {
                    setActive(name);
                }}
                className={styles.tabHeaderButton}
            >
                {name}
            </Button>
            <Button
                onClick={() => remove(name)}
                className={styles.tabHeaderClose}
            >
                <CloseIcon sx={{ padding: "0", margin: "0", height: "16px", width: "16px" }} />
            </Button>
        </Box >
    )
}
