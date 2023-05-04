import { Box, Button } from "@mui/material";
import { ReactNode, useState } from "react";
import { User, UserSendVerificationEmailDocument } from "../generated/graphql";
import CardBox from "./CardBox";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { CircularProgress } from "@mui/material";
import { useMutation } from "@apollo/client";

interface NewTabProps {
    user: User;
    children?: ReactNode;
    banner_mode?: boolean;
}

type EmailSendStatus = "notsent" | "sending" | "sent";

function EmailConfirmationTab({ banner_mode }: { banner_mode: boolean; }) {
    const [userSendVerificationEmail] = useMutation(UserSendVerificationEmailDocument);
    const [emailSent, setEmailSent] = useState<EmailSendStatus>("notsent");

    let text: string;
    if (emailSent == "sent") {
        text = "A verification email has been sent to your inbox.";
    }
    else {
        text = "Complete your account by verifying your email address.";
    }

    let button_content = null;
    if (emailSent == "notsent")
        button_content = "Confirm";
    else if (emailSent == "sending")
        button_content = <CircularProgress style={{ width: "18px", height: "18px" }} />
    else
        button_content = <CheckRoundedIcon />;

    return (
        <CardBox>
            <Box justifyContent="space-between" alignItems="center" display={banner_mode ? "flex" : "initial"}>
                <Box fontSize='.875rem'>
                    <b>{emailSent == "sent" ? "Verification email sent" : "Verify your email"}</b>
                    <Box fontSize=".75rem">
                        {text}
                    </Box>
                </Box>
                <Button
                    sx={{
                        width: !banner_mode ? "100% !important" : "fit-content !important",
                        height: !banner_mode ? "30px !important" : "100% !important",
                        marginTop: !banner_mode ? "10px" : "0"
                    }}
                    className="fullButton"
                    onClick={async () => {
                        setEmailSent("sending");
                        await userSendVerificationEmail();
                        setEmailSent("sent");
                    }}
                    disabled={emailSent != "notsent"}
                >
                    {button_content}
                </Button>
            </Box>
        </CardBox >
    );
}

export default function NewsTab({ user, children, banner_mode }: NewTabProps) {

    let cards: any[] = [];
    let key = 1;

    if (!user.verified_email)
        cards.push(<EmailConfirmationTab key={key++} banner_mode={Boolean(banner_mode)} />);

    if (Array.isArray(children)) {
        cards.push(...children.map(c => {
            return (
                <Box key={key++} marginTop="10px">
                    {c}
                </Box >
            )
        }));
    }
    else if (children !== undefined && children !== null) {
        cards.push(
            <Box key={key++} marginTop="10px">
                {children}
            </Box>
        );
    }

    if (cards.length === 0 && !banner_mode) {
        cards.push(
            <CardBox key={key++}>
                <Box fontSize='.875rem'>
                    <b>Nothing new</b>
                    <Box fontSize=".75rem">
                        You are up to date!
                    </Box>
                </Box>
            </CardBox>
        );
    }

    return (
        <Box borderRadius="8px" width={banner_mode ? "100%" : "260px"} marginTop={banner_mode ? "10px" : "0"} height="fit-content">
            {cards}
        </Box>
    )
}
