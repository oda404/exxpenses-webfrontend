import { ApolloQueryResult } from "@apollo/client";
import { CategoriesGetQuery, CategoriesGetDocument } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";

export default async function categoriesGet(req: any) {
    const { data: { categoriesGet } }: ApolloQueryResult<CategoriesGetQuery> = await apolloClient.query({
        query: CategoriesGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return categoriesGet;
}
