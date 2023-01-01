import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Footer from "../../components/Footer";
import Topbar from "../../components/Topbar";
import { UserVerifyEmailDocument } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

type CategoryProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Verify({ ssr }: CategoryProps) {

    let content: any;
    if (ssr!.success) {
        content = (

            <Box paddingTop="40px" display="flex" flexDirection="column" alignItems="center">
                <Box>
                    <Box flexDirection="column" display="flex" alignItems="center">
                        <CheckRoundedIcon sx={{ fill: "var(--exxpenses-light-green)", width: "40px", height: "40px" }} />
                        <Box fontSize="18px">
                            <b>Your email has been successfully verified!</b>
                        </Box>
                    </Box>
                    <Box marginY="10px" />
                    <Link href="/dashboard">
                        Back to the dashboard
                    </Link>
                </Box>
            </Box>
        )
    }
    else {
        content = (
            <Box paddingTop="40px" display="flex" flexDirection="column" alignItems="center">
                <Box>
                    <Box flexDirection="column" display="flex" alignItems="center">
                        <HeartBrokenIcon sx={{ width: "40px", height: "40px" }} />
                        <Box marginTop="10px" width="500px" fontSize="18px">
                            There was a problem verifying your email. The link you followed may have expired. Please try sending another email.
                        </Box>
                        <Box marginTop="10px" width="500px" fontSize="18px">
                            If the problem persists, please contact support.
                        </Box>
                    </Box>
                    <Box marginY="10px" />
                    <Link href="/dashboard">
                        Back to the dashboard
                    </Link>
                </Box>
            </Box>
        )
    }

    return (
        <Box>
            <Topbar />
            {content}
            <Footer />
        </Box>
    )
}

export async function getServerSideProps({ req, params }: any) {

    const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (!uuidRegex.test(params.token)) {
        return {
            notFound: true,
            props: {

            }
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
                success: true
            }
        }
    }

}
