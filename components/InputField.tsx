import { useState } from "react";
import styles from "../styles/InputField.module.css"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface InputFieldProps {
    name?: string;
    label: string;
    type?: React.HTMLInputTypeAttribute;
    field: any;
    is_error?: boolean;
    params?: any;
    handleChange?: any;
    bg?: string;
}

export default function InputField({ bg, label, type, name, field, is_error, params, handleChange }: InputFieldProps) {

    const [focused, setFocused] = useState(false);
    const [isLabelShown, setLabel] = useState(true);
    const [passwordType, setPasswordType] = useState<"password" | "text">("password");

    let show = isLabelShown;

    field.onBlur = () => {
        setLabel(true);
    }

    if (field.value) {
        show = false;
    }

    let borderColor: string = "#444444";
    if (is_error)
        borderColor = "var(--exxpenses-main-error-color)";
    else if (focused)
        borderColor = "var(--exxpenses-dark-green)"

    return (
        <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
                marginBottom: "5px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: borderColor,
                borderRadius: "6px",
                padding: "1px"
            }}
        >
            <Box
                sx={{
                    color: show ? "#797272 !important" : "#c3b2b2 !important",
                    transform: show ? "none !important" : "translate(-5px, -80%) !important",
                    background: bg ? bg : "var(--exxpenses-main-bg-color)"
                }}
                className={styles.inputFieldLabel}
            >
                {label}
            </Box>
            <input
                onFocus={() => setLabel(false)}
                onLostPointerCapture={() => setLabel(true)}
                onChange={handleChange}
                onBlur={() => setLabel(true)}
                type={type === "password" ? passwordType : type}
                name={name}
                {...field}
                {...params}
                onFocusCapture={() => { setFocused(true); }}
                onBlurCapture={() => { setFocused(false); }}
                className={styles.inputField}
                autoComplete="off"
                style={{ height: "18px", fontSize: "14px", background: bg ? bg : "var(--exxpenses-main-bg-color)" }}
            />
            {type === "password" ?
                <Button
                    sx={{ padding: "0px", margin: "0px", display: "inline-block", minHeight: "0", minWidth: "0", marginRight: "16px", marginTop: "5px" }}
                    onClick={() => {
                        setPasswordType(passwordType === "password" ? "text" : "password")
                    }}
                >
                    {passwordType === "text" ? <VisibilityIcon sx={{ width: "22px", height: "22px", }} /> : <VisibilityOffIcon sx={{ width: "22px", height: "22px", fill: "#777777" }} />}
                </Button> : null}
        </Box>
    );
}