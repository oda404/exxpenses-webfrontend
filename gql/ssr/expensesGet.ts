import { ApolloQueryResult } from "@apollo/client";
import { ExpensesGetDocument, ExpensesGetQuery } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";

export default async function expensesGet(
    req: any,
    category: string,
    since?: Date,
    until?: Date
) {
    const { data: { expensesGet } }: ApolloQueryResult<ExpensesGetQuery> = await apolloClient.query({
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
