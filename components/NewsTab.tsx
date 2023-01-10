import { Box, Button } from "@mui/material";
import { useState } from "react";
import { User, UserSendVerificationEmailDocument } from "../generated/graphql";
import CardBox from "./CardBox";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useMutation } from "@apollo/client";

interface NewTabProps {
    user: User;
}

export default function NewsTab({ user }: NewTabProps) {

    const [userSendVerificationEmail] = useMutation(UserSendVerificationEmailDocument);
    const [emailSent, setEmailSent] = useState(false);
    let cards: any[] = [];

    if (!user.verified_email) {

        let text: string;
        if (emailSent) {
            text = "A verification email has been sent to your inbox.";
        }
        else {
            text = "Complete your Exxpenses account by verifying your email address.";
        }

        let content = (
            <CardBox>
                <Box fontSize='.875rem'>
                    <b>{emailSent ? "Verification email sent" : "Verify your email"}</b>
                    <Box fontSize=".75rem">
                        {text}
                    </Box>
                </Box>
                <Button
                    sx={{
                        height: "30px !important",
                        padding: "3px !important",
                        marginTop: "10px"
                    }}
                    className="standardButton"
                    onClick={async () => {
                        await userSendVerificationEmail();
                        setEmailSent(true);
                    }}
                    disabled={emailSent}
                >
                    {emailSent ? <CheckRoundedIcon /> : "Confirm"}
                </Button>
            </CardBox>
        );

        cards.push(content);
    }

    if (cards.length === 0) {
        let content = (
            <CardBox>
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
        <Box borderRadius="8px" border="1px solid var(--exxpenses-main-border-color)" width="260px" height="fit-content">
            {cards}
        </Box>
    )
}
