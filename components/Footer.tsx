import { Box, Link } from "@mui/material";

export default function Footer() {
    return (
        <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            height="80px"
            bottom="-200px"
            fontSize="14px"
            sx={{ background: "var(--exxpenses-second-bg-color)" }}
            position="absolute"
            width="100%"
        >
            <Box>
                &copy; 2022 Exxpenses
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
