import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import userGet from "../gql/ssr/userGet";

type AccountProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Account({ }: AccountProps) {
    return (
        <Box>
            penis
        </Box>
    )
}

export async function getServerSideProps({ req, params }: any) {

    const userData = await userGet(req);

    return {
        props: {
            ssr: {

            }
        }
    }
}
