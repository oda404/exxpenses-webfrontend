
import React, { useState } from "react";
import CustomDrawer from "./drawer"
import { BiUserCircle } from "react-icons/bi"
import { useRouter } from "next/router";
import Divider from "@mui/material/Divider"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import styles from "../styles/Navbar.module.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

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

interface NavbarProps {
    username?: string;
}

export default function Navbar({ username }: NavbarProps) {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const router = useRouter();

    let buttonContent: React.ReactNode;

    if (username !== undefined) {
        /* If we are logged in */
        buttonContent = (
            <Link className={styles.signInButton} href="/login">
                <AccountCircleIcon sx={{ marginRight: "8px" }} />
                <Box>{username}</Box>
            </Link>
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
        <>
            <CustomDrawer username={username} isOpen={drawerOpen} setState={setDrawerOpen} />
            <Box className={styles.navbar} >
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
        </>
    );
}
