import { ApolloQueryResult } from "@apollo/client";
import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { CategoryGetDocument, CategoryGetQuery, User } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";
import userGet from "../../gql/ssr/userGet";
import expensesGet from "../../gql/ssr/expensesGet";
import Cookies from "universal-cookie";
import getNowUserOffset from "../../utils/getNowWithUserOffset";
import useShowMobileView from "../../utils/useShowMobileView";

import dynamic from "next/dynamic";
const FullViewCategory = dynamic(import("../../components/CategoryFullView"), { ssr: false });
const MobileViewCategory = dynamic(import("../../components/MobileViewCategory"), { ssr: false });

import Footer from "../../components/Footer";
import Head from "next/head";

type CategoryProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Category({ ssr }: CategoryProps) {

    const { expensesGet, lastMonthExpensesGet, categoryGet, userGet } = ssr;
    const category = categoryGet!.categories![0]!;
    const expenses = expensesGet!.expenses!;
    const lastMonthExpenses = lastMonthExpensesGet!.expenses!;
    const user = userGet!.user! as User;

    const isMobileView = useShowMobileView();

    let content: any;
    if (isMobileView) {
        content = <MobileViewCategory lastMonthExpenses={lastMonthExpenses} category={category} expenses={expenses} user={user} />
    }
    else {
        content = <FullViewCategory lastMonthExpenses={lastMonthExpenses} category={category} expenses={expenses} user={user} />
    }

    return (
        <Box position="relative">
            <Head>
                <title>{`${category.name} - Exxpenses`}</title>
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

export async function getServerSideProps({ req, params }: any) {

    const cookies = new Cookies(req.headers.cookie);

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

    const user_tz_offset = cookies.get("user_tz_offset");
    const now = getNowUserOffset(user_tz_offset);
    const since = new Date(now.getUTCFullYear(), now.getMonth(), 1);

    const expensesData = await expensesGet(req, params.name, since, now);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(since);
    // lastMonthEnd.setDate(lastMonthEnd.getDate());

    const lastMonthExpensesData = await expensesGet(req, params.name, lastMonthStart, lastMonthEnd);

    return {
        props: {
            ssr: {
                userGet: userData,
                categoryGet: categoryGet,
                expensesGet: expensesData,
                lastMonthExpensesGet: lastMonthExpensesData
            }
        }
    }
}

