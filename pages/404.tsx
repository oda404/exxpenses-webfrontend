import { Box } from "@mui/material";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";


export default function FourOhFour() {
    return (
        <>
            <Navbar />
            <Box position="relative" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
                <Box>
                    4 of the 04 positions overlap
                </Box>
                <Footer />
            </Box>
        </>

    )
}
