import { ApolloQueryResult } from "@apollo/client";
import { UserGetQuery, UserGetDocument } from "../../generated/graphql";
import { ssr_apollo_client } from "../../utils/apollo-client";

export default async function userGet(req: any) {
    const { data: { userGet } }: ApolloQueryResult<UserGetQuery> = await ssr_apollo_client.query({
        query: UserGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return userGet;
}