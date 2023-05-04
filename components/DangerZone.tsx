import { useMutation } from "@apollo/client";
import { IconButton, Popover, Button, Box } from "@mui/material";
import { useState } from "react";
import { CategoryDeleteDocument } from "../generated/graphql";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function DangerZone({ name }: { name: string }) {

    const [categoryDelete] = useMutation(CategoryDeleteDocument);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box display="flex" justifyContent="space-between">
            <Box color="var(--exxpenses-main-error-color)" fontSize="18px">
                Danger zone
            </Box>
            <IconButton aria-describedby={id} onClick={handleClick} sx={{ margin: "0", padding: "0" }}>
                <DeleteOutlineIcon sx={{ fill: "var(--exxpenses-main-error-color)" }} />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                PaperProps={{ style: { background: "var(--exxpenses-main-bg-color)" } }}
                sx={{ margin: "2px" }}
            >
                <Box fontSize="16px" width="300px" borderRadius="6px" padding="10px">
                    <Box>
                        <b>Delete {name}?</b>
                    </Box>
                    <Box fontSize="14px">
                        Deleting a category will also delete all of it&#39;s exepenses forever.
                    </Box>
                    <Button
                        onClick={async () => {
                            await categoryDelete({
                                variables: {
                                    category_name: name
                                }
                            });

                            window.location.assign("/dashboard");
                        }}
                        fullWidth
                        className="emptyButton"
                        sx={{
                            background: "var(--exxpenses-main-border-color) !important",
                            width: "100% !important",
                            marginTop: "10px",
                            padding: "6px !important",
                            color: "var(--exxpenses-main-error-color) !important",
                            "&:hover": {
                                color: "var(--exxpenses-main-border-color) !important",
                                background: "var(--exxpenses-main-error-color) !important"
                            }
                        }}
                    >
                        <Box color="inherit">
                            Delete
                        </Box>
                    </Button>
                </Box>
            </Popover>
        </Box>
    )
}