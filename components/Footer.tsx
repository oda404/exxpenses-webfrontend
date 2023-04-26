import { Box, Link } from "@mui/material";

export default function Footer() {
    return (
        <Box justifyContent="center" marginTop="80px" padding="30px" display="flex" bgcolor="var(--exxpenses-second-bg-color)">
            <Box>
                &copy; 2023 Exxpenses
            </Box>
            <Link href="/tos" marginLeft="10px" sx={{ textDecoration: "none" }}>
                Terms of service
            </Link>
            <Link href="/info" marginLeft="10px" sx={{ textDecoration: "none" }}>
                What is Exxpenses
            </Link>
        </Box>
    )
}
