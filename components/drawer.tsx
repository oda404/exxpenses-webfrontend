
import { Dispatch, SetStateAction } from "react";
import { UserLogoutDocument } from "../generated/graphql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import styles from "../styles/Drawer.module.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Link from "@mui/material/Link"
import Drawer from "@mui/material/Drawer"
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

interface DrawerLinkProps {
    icon: any;
    name: string;
    href: string;
}

function DrawerLink({ name, href, icon }: DrawerLinkProps) {
    return (
        <Box>
            <Button
                className={styles.drawerButton}
                onClick={() => {
                    window.location.assign(href);
                    window.location.reload();
                }}
            >
                {icon}
                <Box marginX="5px" />
                <Box sx={{ textTransform: "none", fontSize: "13px" }} className={styles.drawerButtonText}>
                    {name}
                </Box>
            </Button>
        </Box>
    )
}

interface CustomDrawerProps {
    isOpen: boolean;
    setState: Dispatch<SetStateAction<boolean>>
    username?: string;
}

export default function CustomDrawer({ isOpen, setState, username }: CustomDrawerProps) {

    return (
        <Drawer
            open={isOpen}
            onClose={() => setState(false)}
            anchor="left"
        >
            <Box className={styles.drawerContent}>

                <Box marginBottom="20px" display="flex" alignItems="center">
                    <Button
                        onClick={() => setState(false)}
                        sx={{
                            padding: "6px",
                            margin: "0px",
                            display: "inline-block",
                            width: "36px",
                            height: "36px",
                            minHeight: "0",
                            minWidth: "0",
                            borderRadius: "25px",
                        }}
                    >
                        <MenuIcon className={styles.drawerButtonIcon} />
                    </Button>
                    <Button
                        onClick={() => {
                            window.location.assign("/");
                            window.location.reload();
                        }}
                    >
                        <Box fontSize="16px" className={styles.drawerButtonText}>Exxpenses</Box>
                    </Button>
                </Box>

                <DrawerLink name="Dashboard" href="/dashboard" icon={<DashboardIcon sx={{ width: "10px", height: "10px" }} className={styles.drawerButtonIcon} />} />

                <Box
                    display="flex"
                    flexDirection="column"
                    marginTop=" auto"
                    id="drawer-footer"
                    fontSize="12px"
                >
                    <Box>&copy; 2022 Exxpenses</Box>
                </Box>
            </Box>
        </Drawer>
    );
}
