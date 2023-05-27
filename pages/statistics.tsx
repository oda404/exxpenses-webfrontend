import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Cookies from "universal-cookie";
import { Category, User } from "../generated/graphql";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories from "../gql/ssr/expensesGetMultipleCategories";
import userGet from "../gql/ssr/userGet";
import useShowMobileView from "../utils/useShowMobileView";

import Footer from "../components/Footer";
import Topbar from "../components/Topbar";
import dayjs, { Dayjs } from "dayjs";
import expensesToTotal from "../utils/expensesToTotal";
import { get_working_expenses, get_categories_totals } from "../utils/statistics";
import Sidenav from "../components/Sidenav";
import StatisticsThisMonth from "../components/StatisticsGeneral";
import CardBox from "../components/CardBox";
import OrderedCategories from "../components/OrderedCategories";
import CategoriesPiechart from "../components/CategoriesPiechart";
import NewsTab from "../components/NewsTab";
import CategoryTotal from "../utils/CategoryTotal";
import MobileViewNavigationBar from "../components/MobileViewNavigationBar";

function FullViewSideTab({ user, categoryTotals }: { user: User, categoryTotals: CategoryTotal[] }) {
    return (
        <NewsTab user={user}>
            <CardBox>
                <Box fontSize='.875rem'>
                    <b>Piechart</b>
                    <Box fontSize=".75rem">
                        This month&#39;s category piechart
                    </Box>
                </Box>
                <CategoriesPiechart preferred_currency={user.preferred_currency!} categoryTotals={categoryTotals} />
            </CardBox>
        </NewsTab>
    )
}

function MobileViewPiechart({ user, categoryTotals }: { user: User, categoryTotals: CategoryTotal[] }) {
    return (
        <Box>
            <Box fontSize='22px'>
                Piechart
                <Box fontSize=".75rem">
                    This month&#39;s category piechart
                </Box>
            </Box>
            <CategoriesPiechart preferred_currency={user.preferred_currency!} categoryTotals={categoryTotals} />
        </Box>
    )
}

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Statistics({ ssr }: DashboardProps) {

    const user = ssr.userData.user! as User;
    const categories = ssr.categoriesData.categories as Category[];
    const showing_categories = ssr.showing_categories;
    const last_month_categories = ssr.last_month_categories;
    const showing_since = new Date(ssr.showing_since!);
    const showing_until = new Date(ssr.showing_until!);
    const compare_since = new Date(ssr.compare_since!);
    const compare_until = new Date(ssr.compare_until!);
    const custom_period = ssr.custom_period;

    const isMobileView = useShowMobileView();

    let working_expenses = get_working_expenses(showing_categories, categories, user);
    let total = expensesToTotal(working_expenses, user.preferred_currency as string);
    let categories_totals = get_categories_totals(showing_categories, categories, total, user);

    let lm_working_expenses = get_working_expenses(last_month_categories, categories, user);
    let lm_total = expensesToTotal(lm_working_expenses, user.preferred_currency as string);
    let lm_categories_totals = get_categories_totals(last_month_categories, categories, lm_total, user);

    let content: any;
    if (isMobileView) {
        content = (
            <Box minHeight="100vh" padding="10px" marginTop="28px">
                <MobileViewNavigationBar />
                <NewsTab user={user} banner_mode />
                <Box marginY='10px' />
                <CardBox>
                    <StatisticsThisMonth
                        user={user}
                        working_expenses={working_expenses}
                        total={total}
                        categoryTotals={categories_totals}
                        lm_total={lm_total}
                        lm_working_expenses={lm_working_expenses}
                        showing_since={new Date(showing_since)}
                        showing_until={new Date(showing_until)}
                        compare_since={new Date(compare_since)}
                        compare_until={new Date(compare_until)}
                        custom_period={custom_period}
                    />
                </CardBox>
                <Box marginY='10px' />
                <CardBox>
                    <MobileViewPiechart user={user} categoryTotals={categories_totals} />
                </CardBox>
                <Box marginY='10px' />
                <CardBox>
                    <OrderedCategories
                        total_price={total.price}
                        expensesMultipleCategories={showing_categories}
                        categoryTotals={categories_totals}
                        lm_category_totals={lm_categories_totals}
                        custom_period={custom_period}
                    />
                </CardBox>
            </Box>
        );
    }
    else {
        content = (
            <Box minHeight="100vh" display="flex" justifyContent="center" marginTop="40px">
                <Sidenav />
                <Box width="540px" display="flex" flexDirection="column" alignItems="center">
                    <CardBox width="540px">
                        <StatisticsThisMonth
                            user={user}
                            working_expenses={working_expenses}
                            total={total}
                            categoryTotals={categories_totals}
                            lm_total={lm_total}
                            lm_working_expenses={lm_working_expenses}
                            showing_since={showing_since}
                            showing_until={showing_until}
                            compare_since={compare_since}
                            compare_until={compare_until}
                            custom_period={custom_period}
                        />
                    </CardBox>
                    <Box marginY="5px" />
                    <CardBox width="540px">
                        <OrderedCategories
                            total_price={total.price}
                            expensesMultipleCategories={showing_categories}
                            categoryTotals={categories_totals}
                            lm_category_totals={lm_categories_totals}
                            custom_period={custom_period}
                        />
                    </CardBox>
                    <Box marginY="5px" />
                </Box>
                <Box marginX="10px" />
                <FullViewSideTab user={user} categoryTotals={categories_totals} />
            </Box>
        )
    }

    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minHeight="100vh">
            <Head>
                <title>Statistics | Exxpenses</title>
                <meta
                    name="description"
                    content="Statistics for your expenses."
                    key="desc"
                />
            </Head>

            <Box>
                <Topbar user={user} />
                {content}
                <Footer />
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req, query }: any) {

    const cookies = new Cookies(req.headers.cookie);

    let showing_since = Number.isNaN(query.showing_since) ? undefined : Number(query.showing_since);
    let showing_until = Number.isNaN(query.showing_until) ? undefined : Number(query.showing_until);
    let compare_since = Number.isNaN(query.compare_since) ? undefined : Number(query.compare_since);
    let compare_until = Number.isNaN(query.compare_until) ? undefined : Number(query.compare_until);

    const userData = await userGet(req);
    if (!userData.user) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            },
        }
    }

    /* If the user doesnt have any categories redirect to setup */
    const categoriesData = await categoriesGet(req);
    if (categoriesData.categories?.length === 0) {
        return {
            redirect: {
                permanent: false,
                destination: "/setup"
            }
        }
    }

    const user_offset = cookies.get("user_tz_offset");

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

    const showing_categories =
        await expensesGetMultipleCategories(req, categoriesData.categories!.map(c => c.name), since.toDate(), until.toDate());

    const last_month_categories =
        await expensesGetMultipleCategories(req, categoriesData.categories!.map(c => c.name), since_compare.toDate(), until_compare.toDate());

    return {
        props: {
            ssr: {
                userData: userData,
                categoriesData: categoriesData,
                showing_categories: showing_categories,
                last_month_categories: last_month_categories,
                showing_since: since.toJSON(),
                showing_until: until.toJSON(),
                compare_since: since_compare.toJSON(),
                compare_until: until_compare.toJSON(),
                custom_period: custom_period
            }
        }
    }
}
