import { Box, Link } from "@mui/material";


export default function Footer() {
    return (
        <Box
            paddingLeft="40px"
            justifyContent="center"
            display="flex"
            marginTop="auto"
            height="20px"
            paddingTop="200px"
            paddingBottom="40px"
            fontSize="14px"
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
