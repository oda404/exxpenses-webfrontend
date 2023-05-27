import { ApolloQueryResult } from "@apollo/client";
import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { CategoryGetDocument, CategoryGetQuery, Expense, User } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";
import userGet from "../../gql/ssr/userGet";
import expensesGet from "../../gql/ssr/expensesGet";
import Cookies from "universal-cookie";
import useShowMobileView from "../../utils/useShowMobileView";

import dynamic from "next/dynamic";
const FullViewCategory = dynamic(import("../../components/CategoryFullView"), { ssr: false });
const MobileViewCategory = dynamic(import("../../components/MobileViewCategory"), { ssr: false });

import Footer from "../../components/Footer";
import Head from "next/head";
import dayjs, { Dayjs } from "dayjs";

type CategoryProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Category({ ssr }: CategoryProps) {

    const { expensesGet, compare_expenses, categoryGet, userGet } = ssr;
    const category = categoryGet!.categories![0]!;
    const expenses = expensesGet!.expenses!;
    const user = userGet!.user! as User;
    const showing_since = ssr.showing_since!;
    const showing_until = ssr.showing_until!;
    const compare_since = ssr.compare_since!;
    const compare_until = ssr.compare_until!;
    const custom_period = ssr.custom_period!;

    const isMobileView = useShowMobileView();

    let content: any;
    if (isMobileView) {
        content = (
            <MobileViewCategory
                lastMonthExpenses={compare_expenses as Expense[]}
                category={category}
                expenses={expenses}
                user={user}
                showing_since={new Date(showing_since)}
                showing_until={new Date(showing_until)}
                compare_since={new Date(compare_since)}
                compare_until={new Date(compare_until)}
                custom_period={custom_period}
            />
        )
    }
    else {
        content = (
            <FullViewCategory
                lastMonthExpenses={compare_expenses as Expense[]}
                category={category}
                expenses={expenses}
                user={user}
                showing_since={new Date(showing_since)}
                showing_until={new Date(showing_until)}
                compare_since={new Date(compare_since)}
                compare_until={new Date(compare_until)}
                custom_period={custom_period}
            />
        )
    }

    return (
        <Box position="relative">
            <Head>
                <title>{`${category.name} | Exxpenses`}</title>
                <meta
                    name="description"
                    content={`Details about your ${category.name} expenses this month.`}
                    key="desc"
                />
            </Head>
            <Box sx={{ height: "100vh", background: "var(--exxpenses-main-bg-color)" }}>
                {content}
                <Footer />
            </Box>
        </Box >
    )
}

export async function getServerSideProps({ req, params, query }: any) {

    let showing_since = Number.isNaN(query.showing_since) ? undefined : Number(query.showing_since);
    let showing_until = Number.isNaN(query.showing_until) ? undefined : Number(query.showing_until);
    let compare_since = Number.isNaN(query.compare_since) ? undefined : Number(query.compare_since);
    let compare_until = Number.isNaN(query.compare_until) ? undefined : Number(query.compare_until);

    /* Redirect if not logged in */
    const userData = await userGet(req);
    if (!userData.user) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    const { data: { categoryGet } }: ApolloQueryResult<CategoryGetQuery> = await apolloClient.query({
        query: CategoryGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache",
        variables: {
            categoryName: params.name,
        }
    });

    if (categoryGet.categories === null) {
        return {
            notFound: true,
            props: {
                ssr: {

                }
            }
        }
    }

    let custom_period = false;
    let until: Dayjs;
    let since: Dayjs;
    if (showing_since && showing_until && userData.user.plan > 0) {
        until = dayjs(Number(showing_until));
        since = dayjs(Number(showing_since));
        custom_period = true;
    }
    else {
        until = dayjs();
        since = dayjs(until).startOf("month");
    }

    let until_compare: Dayjs;
    let since_compare: Dayjs;
    if (compare_since && compare_until && userData.user.plan > 0) {
        until_compare = dayjs(Number(compare_until));
        since_compare = dayjs(Number(compare_since));
        custom_period = true;
    }
    else {
        until_compare = dayjs(until).subtract(1, "month");
        since_compare = dayjs(since).subtract(1, "month");
    }

    const expensesData = await expensesGet(req, params.name, since.toDate(), until.toDate());

    const compare_expenses = await expensesGet(req, params.name, since_compare.toDate(), until_compare.toDate());

    return {
        props: {
            ssr: {
                userGet: userData,
                categoryGet: categoryGet,
                expensesGet: expensesData,
                compare_expenses: compare_expenses!.expenses!,
                showing_since: since.toJSON(),
                showing_until: until.toJSON(),
                compare_since: since_compare.toJSON(),
                compare_until: until_compare.toJSON(),
                custom_period: custom_period
            }
        }
    }
}

