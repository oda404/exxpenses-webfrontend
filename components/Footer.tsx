import { Box, Link } from "@mui/material";
import BigLogo from "./BigLogo";
import useShowMobileView from "../utils/useShowMobileView";

export default function Footer() {

    const isMobileView = useShowMobileView();

    return (
        <Box borderTop="1px solid var(--exxpenses-dark-green)" justifyContent="center" display="flex" padding="40px" bgcolor="var(--exxpenses-second-bg-color)">
            <Box justifyContent="space-between" maxWidth="990px" width="990px" display="flex" flexDirection={isMobileView ? "column" : "row"}>
                <Box maxWidth="430px">
                    <BigLogo />
                    <Box>
                        Exxpenses is creating a platform that helps users track, manage, and get more insight on their day-to-day expenses and incomes.
                    </Box>
                    <Box marginTop="10px">
                        Information found on Exxpenses is not financial advice, and should not be treated as such.
                    </Box>
                    <Box marginTop="10px">
                        For any questions or possible problems regarding Exxpenses you can contact us at: <b>exxpenses.team@gmail.com</b>
                    </Box>
                    <Box marginTop="40px">
                        &copy; Exxpenses - 2023
                    </Box>
                </Box>
                <Box justifyContent="space-between" marginTop="40px" display="flex">
                    <Box>
                        <Box fontSize="14px">
                            GENERAL
                        </Box>
                        <Box marginY="15px" />
                        <Link href="/privacy" sx={{ color: "white" }}>
                            Privacy Policy
                        </Link>
                        <Box marginY="10px" />
                        <Link href="/tos" sx={{ color: "white" }}>
                            Terms of service
                        </Link>
                        <Box marginY="10px" />
                        <Link href="/cookies" sx={{ color: "white" }}>
                            Cookie policy
                        </Link>
                        <Box marginY="10px" />
                        <Link href="/disclaimer" sx={{ color: "white" }}>
                            Disclaimer
                        </Link>
                        <Box marginY="10px" />
                        <Link href="/plans" sx={{ color: "white" }}>
                            Pricing plans
                        </Link>
                    </Box>
                    {/* <Box marginLeft="40px">
                        <Box fontSize="14px">
                            API
                        </Box>
                        <Box marginY="15px" />
                        <Link sx={{ color: "white" }}>
                            Tokens
                        </Link>
                        <Box marginY="10px" />
                        <Link sx={{ color: "white" }}>
                            Docs
                        </Link>
                    </Box>
                    <Box marginLeft="40px">
                        <Box fontSize="14px">
                            COMMUNITY
                        </Box>
                    </Box> */}
                </Box>
            </Box>
        </Box>
    )
}
