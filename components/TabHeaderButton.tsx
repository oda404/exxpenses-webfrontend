import { Box, Button } from "@mui/material";
import styles from "../styles/TabHeaderButton.module.css";
import CloseIcon from '@mui/icons-material/Close';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import Link from "next/link";

interface TabHeaderButtonProps {
    name: string;
    setActive: (name: string) => void;
    active: boolean;
    href: string;
}

export default function TabHeaderButton({ href, active, name, setActive }: TabHeaderButtonProps) {
    return (
        <Link
            href={href}
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
        </Link>
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
