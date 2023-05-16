import { Box, Button, Link } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Footer from "../../components/Footer";
import { UserVerifyEmailDocument } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Head from "next/head";
import useShowMobileView from "../../utils/useShowMobileView";
import BigLogo from "../../components/BigLogo";

type CategoryProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Verify({ ssr }: CategoryProps) {

    const isMobileView = useShowMobileView();

    let content: any;
    if (ssr!.success) {
        content = (
            <Box height="58vh" display="flex" marginTop={isMobileView ? "20px" : "0px"} alignItems={isMobileView ? "unset" : "center"} justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="50px"
                    width="100%"
                    borderRadius="8px"
                >
                    <Box display="flex" flexDirection="column">
                        <Box marginBottom="10px" marginTop="20px" flexDirection="column" display="flex" alignItems="center">
                            <Link href="/">
                                <BigLogo width={120} height={40} />
                            </Link>
                            <Box marginTop="0px" />
                            <CheckRoundedIcon sx={{ fill: "var(--exxpenses-light-green)", width: "40px", height: "40px" }} />
                            <Box marginTop="10px" fontSize="18px">
                                <b>Your email has been successfully verified!</b>
                            </Box>
                        </Box>
                        <Link sx={{ color: "var(--exxpenses-main-color)", textDecoration: "none" }} href="/dashboard">
                            Back to the dashboard
                        </Link>
                    </Box>
                </Box>
            </Box>
        )
    }
    else {
        content = (
            <Box height="66vh" display="flex" marginTop={isMobileView ? "20px" : "0px"} alignItems={isMobileView ? "unset" : "center"} justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="50px"
                    width="100%"
                    borderRadius="8px"
                >
                    <Box display="flex" flexDirection="column">
                        <Box marginBottom="10px" flexDirection="column" display="flex" alignItems="center">
                            <Link href="/">
                                <BigLogo width={120} height={40} />
                            </Link>
                            <HeartBrokenIcon sx={{ fill: "var(--exxpenses-main-error-color)", width: "40px", height: "40px" }} />
                            <Box marginTop="10px" width="500px" fontSize="18px">
                                <b>There was a problem verifying your email. The link you followed may have expired. Please try sending another verification email.</b>
                            </Box>
                            <Box marginTop="5px" width="500px" fontSize="18px">
                                If the problem persists, please contact support.
                            </Box>
                        </Box>
                        <Button className="emptyButton" sx={{ width: "fit-content !important", color: "var(--exxpenses-main-color)", textDecoration: "none" }} href="/dashboard">
                            Back to the dashboard
                        </Button>
                    </Box>
                </Box>
            </Box >
        )
    }

    return (
        <Box>
            <Head>
                <title>Verify your email - Exxpenses</title>
                <meta
                    name="description"
                    content="Email confirmation"
                    key="desc"
                />
            </Head>
            <Box sx={{ minHeight: "100vh", background: "var(--exxpenses-main-bg-color)" }}>
                <Box sx={{ height: "100vh" }}>
                    {content}
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req, params }: any) {

    const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (!uuidRegex.test(params.token)) {
        return {
            notFound: true,
            props: {}
        }
    }

    const { data: { userVerifyEmail } } = await apolloClient.mutate({
        mutation: UserVerifyEmailDocument,
        fetchPolicy: "no-cache",
        variables: {
            token: params.token,
        }
    });

    return {
        props: {
            ssr: {
                success: userVerifyEmail
            }
        }
    }
}
