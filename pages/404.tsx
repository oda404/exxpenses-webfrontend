import { Box, Button, Link } from "@mui/material";
import Footer from "../components/Footer";
import BigLogo from "../components/BigLogo";
import Head from "next/head";

export default function FourOhFour() {
    return (
        <>
            <Head>
                <title>404 (Not Found) !!!11 - Exxpenses</title>
                <meta
                    name="description"
                    content="Exxpenses resource not found."
                    key="desc"
                />
            </Head>
            <Box bgcolor="var(--exxpenses-main-bg-color)">
                <Box flexDirection="column" position="relative" minHeight="100vh" display="flex" alignItems="center" marginTop="10%">
                    <Box>
                        <Link href="/">
                            <BigLogo width={120} height={40} />
                        </Link>
                        <Box fontFamily="'Work Sans', sans-serif" fontSize="54px">
                            404
                        </Box>
                        <Box fontFamily="'Work Sans', sans-serif" fontSize="24px">
                            The link you followed does not exit.
                        </Box>
                        <Button href="/" className="emptyButton" sx={{ marginTop: "10px", fontSize: "18px !important" }}>
                            Back to the main page.
                        </Button>

                    </Box>
                </Box>
                <Footer />
            </Box>
        </>
    )
}

