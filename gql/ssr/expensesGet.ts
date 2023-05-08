import { ApolloQueryResult } from "@apollo/client";
import { ExpensesGetDocument, ExpensesGetQuery } from "../../generated/graphql";
import { ssr_apollo_client } from "../../utils/apollo-client";

export default async function expensesGet(
    req: any,
    category: string,
    since?: Date,
    until?: Date
) {
    const { data: { expensesGet } }: ApolloQueryResult<ExpensesGetQuery> = await ssr_apollo_client.query({
        query: ExpensesGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache",
        variables: {
            getData: {
                category_name: category,
                since: since,
                until: until
            }
        }
    });

    return expensesGet;
}