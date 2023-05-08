import { ApolloQueryResult } from "@apollo/client";
import { CategoriesGetQuery, CategoriesGetDocument } from "../../generated/graphql";
import { ssr_apollo_client } from "../../utils/apollo-client";

export default async function categoriesGet(req: any) {
    const { data: { categoriesGet } }: ApolloQueryResult<CategoriesGetQuery> = await ssr_apollo_client.query({
        query: CategoriesGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return categoriesGet;
}