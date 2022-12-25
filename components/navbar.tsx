
import React, { useState } from "react";
import CustomDrawer from "./drawer"
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import styles from "../styles/Navbar.module.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import useShowMobileView from "../utils/useShowMobileView";
import { Stack } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UserLogoutDocument } from "../generated/graphql";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';

interface UserDropdownButtonProps {
    title: string;
    href: string;
}

function UserDropdownButton({ title, href }: UserDropdownButtonProps) {
    return (
        <Link
            fontSize="14px"
            href={href}
            sx={{
                textDecoration: "none",
                color: "white",
                width: "100%",
                textAlign: "center",
                "&:hover": {
                    textDecoration: "none",
                    background: "var(--exxpenses-dark-green)"
                }
            }}
        >
            {title}
        </Link>
    )
}

interface ContainerProps {
    children: React.ReactNode;
    withBorder?: boolean;
    href: string;
}

function NavbarButton(props: ContainerProps) {
    return (
        <Link
            className={styles.navLink}
            href={props.href}
        >
            {props.children}
        </Link>
    )
}

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

interface NavbarProps {
    username?: string;
}

export default function Navbar({ username }: NavbarProps) {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();

    const [userLogout] = useMutation(UserLogoutDocument);
    const isMobileView = useShowMobileView();
    const [showDropdown, setShowDropdown] = useState(false);

    let buttonContent: React.ReactNode;

    if (username !== undefined) {
        /* If we are logged in */
        buttonContent = (
            <Box>
                <Button
                    sx={{ textDecoration: "none !important", alignItems: "center", justifyContent: "center" }}
                    className={styles.signInButton}
                    onClick={() => {
                        setShowDropdown(!showDropdown)
                    }}
                >
                    <AccountCircleIcon sx={{ width: "22px", height: "22px", marginRight: "8px" }} />
                    <Box fontSize="14px">{username}</Box>
                </Button>
                <Box
                    width="160px"
                    marginLeft="-100px"
                    borderRadius="8px"
                    marginTop="10px"
                    sx={{ background: "var(--exxpenses-second-bg-color)", position: "absolute" }}
                    border="1px solid var(--exxpenses-main-border-color)"
                    display={showDropdown ? "flex" : "none"}
                    flexDirection="column"
                    alignItems="center"
                    paddingY="6px"
                >
                    <Box paddingX="4px" marginBottom="6px" fontSize="14px" textAlign="center">
                        Signed in as <b>{username}</b>
                    </Box>
                    <Divider sx={{ height: "1px", width: "100%", marginBottom: "6px", background: "var(--exxpenses-main-border-color)" }} />
                    <UserDropdownButton title="Preferences" href="/preferences" />
                    <Box marginBottom="6px" />
                    <Divider sx={{ height: "1px", width: "100%", marginBottom: "6px", background: "var(--exxpenses-main-border-color)" }} />
                    <Button
                        sx={{
                            color: "white",
                            fontSize: "14px",
                            textTransform: "none",
                            width: "100%",
                            padding: "0",
                            "&:hover": {
                                background: "var(--exxpenses-dark-green)"
                            }
                        }}
                        onClick={async () => {
                            await userLogout();
                            window.location.reload()
                        }}
                    >
                        Log out
                    </Button>
                </Box>
            </Box>

        );
    }
    else if (router.pathname == "/register") {
        /* If we are on the register page */
        buttonContent = (
            <>
                <li>
                    <Box >
                        Already have an account?
                    </Box>
                </li>
                <li className={styles.navitem}>
                    <NavbarButton href="/login">
                        Sign in
                    </NavbarButton>
                </li>
            </>
        );
    }
    else if (router.pathname == "/login") {
        /* If we are on the login page */
        buttonContent = (
            <li className={styles.navitem}>
                <Box sx={{ marginRight: "10px" }}>
                    New to Exxpenses?
                </Box>
                <NavbarButton href="/register">
                    Sign up
                </NavbarButton>
            </li>
        );
    }
    else {
        /* If we are not logged in and just browsing the website */
        buttonContent = (
            <Link className={styles.signInButton} href="/login">
                <AccountCircleIcon sx={{ marginRight: "5px" }} />
                <Box marginLeft="5px">
                    Sign in
                </Box>
            </Link>

        );
    }

    return (
        <Box sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <CustomDrawer username={username} isOpen={drawerOpen} setState={setDrawerOpen} />
            <Box display={isMobileView ? "none" : "initial"} borderRadius="8px" margin="20px" marginTop="120px" left="0" top="0" width="200px" height="fit-content" position="absolute">
                <Stack width="150px" spacing={1}>
                    <Box width="174px">
                        <Button
                            fullWidth
                            sx={{
                                display: "flex",
                                borderRadius: "12px",
                                padding: "8px",
                                background: "var(--exxpenses-second-bg-color)",
                                textDecoration: "none",
                                "&:hover": {
                                    background: "var(--exxpenses-main-button-hover-bg-color)",
                                    textDecoration: "none",
                                    cursor: "pointer"
                                },
                            }}
                        >
                            <AccountCircleIcon sx={{ width: "20px", height: "20px", marginRight: "8px" }} />
                            <Box fontSize="14px">{username}</Box>
                        </Button>
                    </Box>
                    <Box marginTop="10px" />

                    <DrawerLink active={router.pathname === "/dashboard"} name="Dashboard" href="/dashboard" icon={<DashboardIcon sx={{ width: "20px", height: "20px" }} />} />
                    <DrawerLink active={router.pathname === "/statistics"} name="Statistics" href="/statistics" icon={<ShowChartIcon sx={{ width: "20px", height: "20px" }} />} />
                </Stack>

            </Box>
            <Box display={!isMobileView ? "none" : "flex"} className={styles.navbar} >
                <Button
                    className={styles.drawerButton}
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon className={styles.drawerButtonIcon} />
                </Button>
                <ul className={styles.navlist}>
                    {buttonContent}
                </ul>
            </Box>
        </Box>
    );
}
