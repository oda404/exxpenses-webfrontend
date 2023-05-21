import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Cookies from "universal-cookie";
import { Category, User } from "../generated/graphql";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories from "../gql/ssr/expensesGetMultipleCategories";
import userGet from "../gql/ssr/userGet";
import useShowMobileView from "../utils/useShowMobileView";

import dynamic from "next/dynamic";
import Footer from "../components/Footer";
import Topbar from "../components/Topbar";
import dayjs, { Dayjs } from "dayjs";
const FullViewStatisticsTab = dynamic(import("../components/FullViewStatisticsTab"), { ssr: false });
const MobileViewStatisticsTab = dynamic(import("../components/MobileViewStatisticsTab"), { ssr: false });

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Statistics({ ssr }: DashboardProps) {

    const user = ssr.userData.user! as User;
    const categories = ssr.categoriesData.categories as Category[];
    const expensesMultipleCategories = ssr.expensesMultipleCategoriesData;
    const last_month_categories = ssr.last_month_categories;

    const isMobileView = useShowMobileView();

    let content: any;
    if (isMobileView)
        content = <MobileViewStatisticsTab
            user={user}
            categories={categories}
            expensesMultipleCategories={expensesMultipleCategories}
            last_month_categories={last_month_categories}
            showing_since={new Date(ssr.showing_since!)}
            showing_until={new Date(ssr.showing_until!)}
            compare_since={new Date(ssr.compare_since!)}
            compare_until={new Date(ssr.compare_until!)}
            custom_period={ssr.custom_period}
        />
    else
        content = <FullViewStatisticsTab
            showing_since={new Date(ssr.showing_since!)}
            showing_until={new Date(ssr.showing_until!)}
            compare_since={new Date(ssr.compare_since!)}
            compare_until={new Date(ssr.compare_until!)}
            custom_period={ssr.custom_period}
            user={user}
            categories={categories}
            expensesMultipleCategories={expensesMultipleCategories}
            last_month_categories={last_month_categories}
        />

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
    if (showing_since && showing_until /* && userData.user.plan > 0 */) {
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
    if (compare_since && compare_until /* && userData.user.plan > 0 */) {
        until_compare = dayjs(Number(compare_until));
        since_compare = dayjs(Number(compare_since));
        custom_period = true;
    }
    else {
        until_compare = dayjs(until).subtract(1, "month");
        since_compare = dayjs(since).subtract(1, "month");
    }

    const expensesGetMultipleCategoriesData =
        await expensesGetMultipleCategories(req, categoriesData.categories!.map(c => c.name), since.toDate(), until.toDate());

    const last_month_categories =
        await expensesGetMultipleCategories(req, categoriesData.categories!.map(c => c.name), since_compare.toDate(), until_compare.toDate());

    return {
        props: {
            ssr: {
                userData: userData,
                categoriesData: categoriesData,
                expensesMultipleCategoriesData: expensesGetMultipleCategoriesData,
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
