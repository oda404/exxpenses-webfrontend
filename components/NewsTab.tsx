import { Box, Button } from "@mui/material";
import { useState } from "react";
import { User, UserSendVerificationEmailDocument } from "../generated/graphql";
import CardBox from "./CardBox";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { CircularProgress } from "@mui/material";
import { useMutation } from "@apollo/client";

interface NewTabProps {
    user: User;
}

type EmailSendStatus = "notsent" | "sending" | "sent";

export default function NewsTab({ user }: NewTabProps) {

    const [userSendVerificationEmail] = useMutation(UserSendVerificationEmailDocument);
    const [emailSent, setEmailSent] = useState<EmailSendStatus>("notsent");
    let cards: any[] = [];

    if (!user.verified_email) {

        let text: string;
        if (emailSent == "sent") {
            text = "A verification email has been sent to your inbox.";
        }
        else {
            text = "Complete your Exxpenses account by verifying your email address.";
        }

        let button_content = null;
        if (emailSent == "notsent")
            button_content = "Confirm";
        else if (emailSent == "sending")
            button_content = <CircularProgress style={{ width: "18px", height: "18px" }} />
        else
            button_content = <CheckRoundedIcon />;

        let content = (
            <CardBox key={1}>
                <Box fontSize='.875rem'>
                    <b>{emailSent == "sent" ? "Verification email sent" : "Verify your email"}</b>
                    <Box fontSize=".75rem">
                        {text}
                    </Box>
                </Box>
                <Button
                    sx={{
                        width: "100% !important",
                        height: "30px !important"
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
            </CardBox >
        );

        cards.push(content);
    }

    if (cards.length === 0) {
        let content = (
            <CardBox key={1}>
                <Box fontSize='.875rem'>
                    <b>Nothing new</b>
                    <Box fontSize=".75rem">
                        You are up to date!
                    </Box>
                </Box>
            </CardBox>
        )

        cards.push(content);
    }

    return (
        <Box borderRadius="8px" width="260px" height="fit-content">
            {cards}
        </Box>
    )
}
