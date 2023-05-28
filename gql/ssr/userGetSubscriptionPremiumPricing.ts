import { ApolloQueryResult } from "@apollo/client";
import { UserGetPremiumSubscriptionPricingQuery, UserGetDocument, UserGetPremiumSubscriptionPricingDocument } from "../../generated/graphql";
import { ssr_apollo_client } from "../../utils/apollo-client";


export default async function user_get_premium_subscription_pricing(req: any) {
    const { data: { userGetPremiumSubscriptionPricing } }: ApolloQueryResult<UserGetPremiumSubscriptionPricingQuery> = await ssr_apollo_client.query({
        query: UserGetPremiumSubscriptionPricingDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return userGetPremiumSubscriptionPricing;
}
