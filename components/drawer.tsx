

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
import { cache } from "../utils/apollo-client";

interface CustomDrawerProps {
    isOpen: boolean;
    setState: Dispatch<SetStateAction<boolean>>
    username?: string;
}

export default function CustomDrawer({ isOpen, setState, username }: CustomDrawerProps) {

    const [userLogout] = useMutation(UserLogoutDocument);

    let userInfo: React.ReactNode;
    if (username === undefined) {
        userInfo = (
            <>
                <AccountCircleIcon sx={{ width: "24px", height: "24px", marginBottom: "5px" }} />

                <Box display="flex">
                    <Link className={styles.drawerLink} href="/register">
                        Create an account
                    </Link>
                    <Box>&nbsp; or &nbsp;</Box>
                    <Link className={styles.drawerLink} href="/login">
                        Log in
                    </Link>
                </Box>
            </>
        );
    }
    else {
        userInfo = (
            <>
                <AccountCircleIcon sx={{ width: "24px", height: "24px", marginBottom: "6px" }} />
                <Box>You are signed in as {username}.</Box>
                <Button
                    onClick={async () => {
                        await userLogout();
                        window.location.assign("/");
                        window.location.reload();
                    }}
                    variant="text"
                    className={styles.drawerLogoutButton}
                >
                    Log out
                </Button>
            </>
        );
    }

    return (
        <>
            <Drawer
                open={isOpen}
                onClose={() => setState(false)}
                anchor="left"
            >
                <Box className={styles.drawerContent}>

                    <Box display="flex" alignItems="center">
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
                                ":hover": {
                                    background: "var(--exxpenses-main-button-hover-bg-color)"
                                }
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
                            <Box fontSize="18px" className={styles.drawerButtonText}>Exxpenses</Box>
                        </Button>
                    </Box>

                    <Box marginTop="30px">
                        <Button
                            className={styles.drawerButton}
                            onClick={() => {
                                window.location.assign("/");
                                window.location.reload();
                            }}
                        >
                            <DashboardIcon className={styles.drawerButtonIcon} />
                            <Box sx={{ textTransform: "none" }} className={styles.drawerButtonText}>Dashboard</Box>
                        </Button>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        marginTop=" auto"
                        id="drawer-footer"
                    >
                        {userInfo}
                        <Divider sx={{ width: "100%", marginY: "8px", background: "#444444" }} />
                        <Box>Exxpenses &copy; 2022</Box>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}
