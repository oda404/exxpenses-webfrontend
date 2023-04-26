import { Box } from "@mui/material";
import Footer from "../components/Footer";

export default function FourOhFour() {
    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)">
            <Box position="relative" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                <Box>
                    4 of the 04 positions overlap
                </Box>
            </Box>
            <Footer />
        </Box>

    )
}
