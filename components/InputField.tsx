import { useState } from "react";
import styles from "../styles/InputField.module.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Typography } from "@mui/material";

interface InputFieldProps {
    name?: string;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    field: any;
    is_error?: boolean;
    params?: any;
    handleChange?: any;
}

export default function InputField({ label, type, name, field, is_error, params, handleChange }: InputFieldProps) {

    const [isLabelShown, setLabel] = useState(true);
    const [passwordType, setPasswordType] = useState<"password" | "text">("password");

    let show = isLabelShown;

    field.onBlur = () => {
        setLabel(true);
    }

    if (field.value) {
        show = false;
    }

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
                marginBottom: "5px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: is_error ? "var(--exxpenses-main-error-color)" : "#666666",
                borderRadius: "6px",
                padding: "1px"
            }}
        >
            <Typography
                sx={{
                    color: show ? "#797272 !important" : "#c3b2b2 !important",
                    transform: show ? "none !important" : "translate(-5px, -90%) !important"
                }}
                className={styles.inputFieldLabel}
            >
                {label}
            </Typography>
            <input
                onFocus={() => setLabel(false)}
                onLostPointerCapture={() => setLabel(true)}
                onChange={handleChange}
                onBlur={() => setLabel(true)}
                type={type === "password" ? passwordType : type}
                name={name}
                {...field}
                {...params}
                className={styles.inputField}
                autoComplete="off"
            />
            {type === "password" ?
                <Button
                    sx={{ padding: "0px", margin: "0px", display: "inline-block", minHeight: "0", minWidth: "0", marginRight: "16px", marginTop: "5px" }}
                    onClick={() => {
                        setPasswordType(passwordType === "password" ? "text" : "password")
                    }}
                >
                    {passwordType === "password" ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Button> : null}
        </Box>
    );
}