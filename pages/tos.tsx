import Head from "next/head";
import userGet from "../gql/ssr/userGet";
import { Box } from "@mui/material";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import { InferGetServerSidePropsType } from "next";
import { User } from "../generated/graphql";
import CardBox from "../components/CardBox";

function TOSContent() {
    return (
        <Box>

        </Box>
    )
}

type TOSProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function TOS({ ssr }: TOSProps) {
    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
            <Head>
                <title>Plans - Exxpenses</title>
                <meta
                    name="description"
                    content="Exxpenses terms of service."
                    key="desc"
                />
            </Head>

            <Box>
                <Topbar user={ssr.userGet.user ? ssr.userGet.user as User : undefined} />
                <Box paddingY="40px" padding="10px" marginX="auto" maxWidth="990px" justifyContent="center" display="flex">
                    <TOSContent />
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req }: any) {
    const userData = await userGet(req);
    return {
        props: {
            ssr: {
                userGet: userData,
            }
        }
    }
}
