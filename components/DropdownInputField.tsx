import { Box, FormControl, InputBase, MenuItem, Select, styled } from "@mui/material";
import styles from "../styles/InputField.module.css";
// import { useState } from "react";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        height: "12px",
        padding: "8px 16px",
        color: "var(--exxpenses-main-color)",
        fontSize: 14,
    },
}));

export interface DropdownElement {
    name: string;
    value: string;
}

export interface DropdownInputFieldProps {
    initial_value?: string;
    elements: DropdownElement[];
    is_error?: boolean;
    field: any;
    params?: any;
    bg?: string;
    oninput?: (e: any) => void;
    hide_label?: boolean;
}

export default function DropdownInputField({ hide_label, oninput, bg, field, params, initial_value, elements, is_error }: DropdownInputFieldProps) {

    // const [labelShown, setLabelShown] = useState(true);
    const labelShown = false;
    const setLabelShown = (b: boolean) => {

    }

    let shown = field.value !== "" ? false : labelShown;
    if (oninput !== undefined)
        oninput(field.value);

    return (
        <FormControl fullWidth>
            {
                !hide_label ?
                    <Box
                        className={styles.inputFieldLabel}
                        sx={{
                            color: shown ? "#797272 !important" : "#949997 !important",
                            transform: shown ? "none !important" : "translate(-5px, -80%) !important",
                            background: bg ? bg : "var(--exxpenses-main-bg-color)",
                            marginTop: shown ? "8px" : "8px",
                            marginLeft: "14px !important"
                        }}
                    >
                        Currency
                    </Box> :
                    null
            }

            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={field.value}
                fullWidth
                {...field}
                {...params}
                input={<BootstrapInput />}
                sx={{
                    border: is_error ? '1px solid var(--exxpenses-main-error-color)' : '1px solid #444444',
                    borderRadius: "6px"
                }}
                onFocusCapture={() => { setLabelShown(false) }}
                onBlur={() => { setLabelShown(true) }}
                // onChange={oninput}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            bgcolor: "var(--exxpenses-main-bg-color)",
                            color: "var(--exxpenses-main-color)",
                            border: '1px solid #444444',
                            maxHeight: "300px",
                            '& .MuiMenuItem-root': {
                                fontSize: "14px",
                                bgcolor: "var(--exxpenses-main-bg-color)",
                                "&:hover": {
                                    bgcolor: "var(--exxpenses-main-button-hover-bg-color)"
                                },
                                "&:focus": {
                                    bgcolor: "var(--exxpenses-main-button-hover-bg-color)"
                                },
                            },
                        }
                    }
                }}
            >
                {elements.map((e, idx) => (
                    <MenuItem key={idx} value={e.value}>{e.name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
