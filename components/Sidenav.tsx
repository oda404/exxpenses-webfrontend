import { Box, Link, Stack } from "@mui/material";
import { useRouter } from "next/router";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import styles from "../styles/Navbar.module.css"
import ClassIcon from '@mui/icons-material/Class';

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
                    borderRadius: "8px",
                    padding: "8px",
                    paddingX: "12px",
                    background: active ? "var(--exxpenses-second-bg-color)" : '',
                    textDecoration: "none",
                    width: "auto",
                    "&:hover": {
                        background: active ? "var(--exxpenses-second-bg-color)" : "var(--exxpenses-main-button-hover-bg-color)",
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

interface SidenavProps {
    look_at_category?: string;
}

export default function Sidenav({ look_at_category }: SidenavProps) {

    const router = useRouter();

    return (
        <Box borderRadius="8px" marginX="20px" width="170px" height="fit-content">
            <Stack spacing={1}>
                <DrawerLink active={router.pathname === "/dashboard"} name="Dashboard" href="/dashboard" icon={<DashboardIcon sx={{ width: "20px", height: "20px" }} />} />
                <DrawerLink active={router.pathname === "/statistics"} name="Statistics" href="/statistics" icon={<ShowChartIcon sx={{ width: "20px", height: "20px" }} />} />
                {look_at_category ? <DrawerLink active={true} name={look_at_category} href={`/category/${look_at_category}`} icon={<ClassIcon sx={{ width: "20px", height: "20px" }} />} /> : null}
            </Stack>
        </Box>
    )
}
