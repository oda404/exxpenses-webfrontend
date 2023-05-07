
import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache, NextLink, Operation } from "@apollo/client";

const api_uri = process.env.API_URI!;

/* This shits unable to send cookies by itself */
const beforeLink = new ApolloLink((op: Operation, forward: NextLink) => {
    op.setContext({
        headers: {
            cookie: op.getContext().cookie
        }
    });
    return forward(op);
})

const afterLink = new ApolloLink((op: Operation, forward: NextLink) => {
    return forward(op).map(response => {
        const context = op.getContext();

        (response as any).context = { headers: new Map<string, string>(context.response.headers) }
        return response
    });
})

const DEV_API_URI = "http://localhost:8888";
const PROD_API_URI = "https://api.exxpenses.com";
const API_URI = process.env.NODE_ENV === "production" ? PROD_API_URI : DEV_API_URI;

export const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
    ssrMode: typeof (window) === "undefined",
    cache: cache,
    link: from([beforeLink, afterLink, createHttpLink({
        uri: API_URI,
        credentials: "include"
    })]),

    /* Don't cache shit */
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore"
        },
        query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all"
        }
    }
});

export default apolloClient;
