
import React, { useState } from "react";
import CustomDrawer from "./drawer"
import { NextRouter, useRouter } from "next/router";
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

interface SidebarProps {
    isMobileView: boolean;
    username: string;
    router: NextRouter;
}

function Sidebar({ username, router, isMobileView }: SidebarProps) {
    return (
        <Box display={isMobileView ? "none" : "initial"} borderRadius="8px" margin="20px" marginTop="120px" left="0" top="0" width="200px" height="fit-content" position="absolute">
            <Stack width="150px" spacing={1}>
                <SidebarUserBox username={username} />
                <Box marginTop="10px" />
                <DrawerLink active={router.pathname === "/dashboard"} name="Dashboard" href="/dashboard" icon={<DashboardIcon sx={{ width: "20px", height: "20px" }} />} />
                <DrawerLink active={router.pathname === "/statistics"} name="Statistics" href="/statistics" icon={<ShowChartIcon sx={{ width: "20px", height: "20px" }} />} />
            </Stack>
        </Box>
    )
}

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
            <Sidebar username={username} router={router} isMobileView={isMobileView} />
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
