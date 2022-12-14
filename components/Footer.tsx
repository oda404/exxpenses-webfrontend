import { Box, Link } from "@mui/material";


export default function Footer() {
    return (
        <Box
            paddingLeft="40px"
            justifyContent="center"
            display="flex"
            height="20px"
            marginTop="100px"
            paddingTop="20px"
            paddingBottom="20px"
            fontSize="14px"
            sx={{ background: "var(--exxpenses-second-bg-color)" }}
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
