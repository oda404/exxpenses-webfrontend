import { ApolloQueryResult } from "@apollo/client";
import { UserGetSubscriptionInfoDocument, UserGetSubscriptionInfoQuery } from "../../generated/graphql";
import { ssr_apollo_client } from "../../utils/apollo-client";

export default async function userGetSubscriptionInfo(req: any) {
    const { data: { userGetSubscriptionInfo } }: ApolloQueryResult<UserGetSubscriptionInfoQuery> = await ssr_apollo_client.query({
        query: UserGetSubscriptionInfoDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return userGetSubscriptionInfo;
}