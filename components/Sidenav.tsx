import { useMutation } from "@apollo/client";
import { Box, Button, Link, Stack } from "@mui/material";
import router, { useRouter } from "next/router";
import { useState } from "react";
import { UserLogoutDocument } from "../generated/graphql";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from "../styles/Navbar.module.css"

interface DrawerLinkProps {
    icon: any;
    name: string;
    href: string;
    active?: boolean;
}

function DrawerLink({ active, name, href, icon }: DrawerLinkProps) {
    return (
        <Box>
            <Link
                href={href}
                sx={{
                    display: "flex",
                    borderRadius: "12px",
                    padding: "8px",
                    paddingX: "12px",
                    background: active ? "var(--exxpenses-main-button-hover-bg-color)" : '',
                    textDecoration: "none",
                    width: "100%",
                    "&:hover": {
                        background: active ? "var(--exxpenses-main-button-hover-bg-color)" : "var(--exxpenses-second-bg-color)",
                        textDecoration: "none",
                        cursor: "pointer"
                    },
                    alignItems: "none"
                }}
            >
                {icon}
                <Box marginX="5px" />
                <Box sx={{ textTransform: "none", fontSize: "13px" }} className={styles.drawerButtonText}>
                    {name}
                </Box>
            </Link>
        </Box>
    )
}


function SidebarUserBox({ username }: { username: string; }) {

    const [expanded, setExpanded] = useState(false);
    const [userLogout] = useMutation(UserLogoutDocument);

    let expandedContent = (
        <Stack marginTop="10px" spacing="4px" alignItems="center" width="100%" padding="4px" display="flex" flexDirection="column">
            <Link
                href="/preferences"
                sx={{
                    textDecoration: "none",
                    color: "var(--exxpenses-main-color)",
                    width: "100%",
                    fontSize: "14px",
                    textAlign: "center",
                    borderRadius: "4px",
                    "&:hover": {
                        textDecoration: "none",
                        background: "var(--exxpenses-main-button-hover-bg-color)"
                    }
                }}
            >
                Preferences
            </Link>
            <Box sx={{ height: "1px", width: "100%", background: "var(--exxpenses-main-border-color)" }} />
            <Button
                sx={{
                    fontSize: "14px",
                    textTransform: "none",
                    padding: "0",
                    display: "inline-block",
                    margin: "0",
                    color: "var(--exxpenses-main-color)",
                    width: "100%",
                    "&:hover": {
                        background: "var(--exxpenses-main-button-hover-bg-color)"
                    }
                }}
                onClick={async () => {
                    await userLogout();
                    window.location.reload()
                }}
            >
                Log out
            </Button>
        </Stack>
    );

    return (
        <Box
            sx={{ background: "var(--exxpenses-second-bg-color)", borderRadius: "8px" }}
            width="174px"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Button
                fullWidth
                sx={{
                    display: "flex",
                    borderRadius: "12px",
                    padding: "8px",
                    textDecoration: "none",
                    background: expanded ? "var(--exxpenses-main-button-hover-bg-color)" : "none",
                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                    "&:hover": {
                        background: expanded ? "none" : "var(--exxpenses-main-button-hover-bg-color)",
                        textDecoration: "none",
                        cursor: "pointer"
                    },
                }}
                onClick={() => { setExpanded(!expanded) }}
            >
                <AccountCircleIcon sx={{ width: "20px", height: "20px", marginRight: "8px" }} />
                <Box fontSize="14px">{username}</Box>
            </Button>
            {expanded ? expandedContent : null}
        </Box >
    )
}

interface SidenavProps {
    username: string;
}

export default function Sidenav({ username }: SidenavProps) {

    const router = useRouter();

    return (
        <Box borderRadius="8px" margin="20px" width="180px" height="fit-content">
            <Stack width="150px" spacing={1}>
                <SidebarUserBox username={username} />
                <Box marginTop="10px" />
                <DrawerLink active={router.pathname === "/dashboard"} name="Dashboard" href="/dashboard" icon={<DashboardIcon sx={{ width: "20px", height: "20px" }} />} />
                <DrawerLink active={router.pathname === "/statistics"} name="Statistics" href="/statistics" icon={<ShowChartIcon sx={{ width: "20px", height: "20px" }} />} />
            </Stack>
        </Box>
    )
}
