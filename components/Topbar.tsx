import { Box, Button, IconButton, Link, Popover } from "@mui/material";
import useShowMobileView from "../utils/useShowMobileView";
import Image from 'next/image';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from "react";
import { User, UserLogoutDocument } from "../generated/graphql";
import LogoutIcon from '@mui/icons-material/Logout';
import { useMutation } from "@apollo/client";
import SettingsIcon from '@mui/icons-material/Settings';

export interface TopbarProps {
    user?: User;
}

function ProfileMenu({ user }: { user: User }) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [userLogout] = useMutation(UserLogoutDocument);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let plan_type: string;
    if (user.plan === 0)
        plan_type = "Free plan";
    else if (user.plan === 1)
        plan_type = "Premium plan";
    else if (user.plan === 2)
        plan_type = "Pro plan";
    else
        plan_type = "undefined";

    return (
        <>
            <IconButton aria-describedby={id} onClick={handleClick} sx={{ margin: "0", padding: "0" }}>
                <AccountCircleIcon sx={{ margin: "0" }} />
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
                <Box fontSize="16px" width="240px" borderRadius="6px" padding="10px">
                    <Box>
                        <b>{user.lastname} {user.firstname}</b>
                    </Box>
                    <Box>
                        <b>{user.email}</b>
                    </Box>
                    <Box marginTop="5px">
                        {plan_type} | <b>{user.preferred_currency}</b>
                    </Box>
                    <Button
                        href="/account"
                        fullWidth
                        sx={{ textTransform: "none", display: "flex", alignItems: "center", justifyContent: "start", marginTop: "20px" }}
                    >
                        <SettingsIcon sx={{ width: "18px", height: "18px" }} />
                        <Box marginLeft="10px">
                            Settings
                        </Box>
                    </Button>
                    <Button
                        onClick={async () => {
                            await userLogout();
                            window.location.reload()
                        }}
                        fullWidth
                        sx={{ textTransform: "none", display: "flex", alignItems: "center", justifyContent: "start", marginTop: "10px" }}
                    >
                        <LogoutIcon sx={{ width: "18px", height: "18px" }} />
                        <Box marginLeft="10px">
                            Sign out
                        </Box>
                    </Button>
                </Box>
            </Popover>
        </>
    )
}

export default function Topbar({ user }: TopbarProps) {

    const isMobileView = useShowMobileView();

    let content: any;
    if (user !== undefined) {
        content = (
            <ProfileMenu user={user} />
        )
    }
    else {
        content = (
            <Box display="flex">
                <Button
                    href="/login"
                    sx={{
                        height: "34px !important",
                        color: "var(--exxpenses-main-color) !important",

                    }}
                    className="emptyButton"
                >
                    Sign in
                </Button>
                <Box marginX="5px" />
                <Button href="/register" sx={{
                    "&:hover": {
                        color: "var(--exxpenses-unimportant-color) !important"
                    }, width: "fit-content !important", border: "1px solid var(--exxpenses-main-bg-color)", bgcolor: "var(--exxpenses-second-bg-color) !important"
                }} className="fullButton">
                    Create an account
                </Button>
            </Box>
        )
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            padding="8px"
            alignItems="center"
            paddingX={isMobileView ? "10px" : "40px"}
            width="100%"
            bgcolor="var(--exxpenses-second-bg-color)"
        >
            <Box alignItems="center" justifyContent="space-between" display="flex" maxWidth="990px" width="990px">
                <Box>
                    <Link href="/">
                        <Image src="/exxpenses.svg" alt="Exxpenses" width={130} height={32} />
                    </Link>
                </Box>
                {content}
            </Box>
        </Box >
    )
}
