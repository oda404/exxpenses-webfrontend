import { Box, Link, Button, Stack } from "@mui/material";
import { useRouter } from "next/router";

interface DrawerLinkProps {
    name: string;
    href: string;
    active?: boolean;
}

function DrawerLink({ active, name, href }: DrawerLinkProps) {
    return (
        <Box>
            <Button
                onClick={() => {
                    window.location.assign(href);
                }}
                sx={{
                    display: "flex",
                    borderRadius: "12px",
                    padding: "8px",
                    paddingX: "12px",
                    background: active ? "var(--exxpenses-second-bg-color)" : '',
                    textDecoration: "none",
                    width: "100%",
                    "&:hover": {
                        background: active ? "var(--exxpenses-second-bg-color)" : "var(--exxpenses-main-button-hover-bg-color)",
                        textDecoration: "none",
                        cursor: "pointer"
                    },
                    alignItems: "none"
                }}
            >
                <Box sx={{ textTransform: "none", fontSize: "13px" }}>
                    {name}
                </Box>
            </Button>
        </Box>
    )
}

export default function MobileViewNavigationBar() {

    const router = useRouter();

    return (
        <Box display="flex">
            <Stack direction="row" spacing={1}>
                <DrawerLink active={router.pathname === "/dashboard"} name="Dashboard" href="/dashboard" />
                <DrawerLink active={router.pathname === "/statistics"} name="Statistics" href="/statistics" />
            </Stack>
        </Box>
    )
}
