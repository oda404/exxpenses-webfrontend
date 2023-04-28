import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Cookies from "universal-cookie";
import { Category, User } from "../generated/graphql";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories from "../gql/ssr/expensesGetMultipleCategories";
import userGet from "../gql/ssr/userGet";
import getNowUserOffset from "../utils/getNowWithUserOffset";
import useShowMobileView from "../utils/useShowMobileView";

import dynamic from "next/dynamic";
const FullViewStatisticsTab = dynamic(import("../components/FullViewStatisticsTab"), { ssr: false });
const MobileViewStatisticsTab = dynamic(import("../components/MobileViewStatisticsTab"), { ssr: false });
const Topbar = dynamic(import("../components/Topbar"));
const Footer = dynamic(import("../components/Footer"));

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Statistics({ ssr }: DashboardProps) {

    const user = ssr.userData.user! as User;
    const categories = ssr.categoriesData.categories as Category[];
    const expensesMultipleCategories = ssr.expensesMultipleCategoriesData;
    const last_month_categories = ssr.last_month_categories;

    const isMobileView = useShowMobileView();

    let content: any;
    if (isMobileView)
        content = <MobileViewStatisticsTab user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} last_month_categories={last_month_categories} />
    else
        content = <FullViewStatisticsTab user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} last_month_categories={last_month_categories} />

    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minHeight="100vh">
            <Head>
                <title>Statistics - Exxpenses</title>
                <meta
                    name="description"
                    content="Monthly statistics."
                    key="desc"
                />
            </Head>

            <Box sx={{ height: "100vh" }}>
                <Topbar user={user} />
                {content}
            </Box>
            <Footer />
        </Box>
    )
}

export async function getServerSideProps({ req }: any) {

    const cookies = new Cookies(req.headers.cookie);

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
    const now = getNowUserOffset(user_offset);
    const since = new Date(now.getFullYear(), now.getMonth(), 1);

    const expensesGetMultipleCategoriesData =
        await expensesGetMultipleCategories(req, categoriesData.categories!.map(c => c.name), since, now);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(since);

    const last_month_categories =
        await expensesGetMultipleCategories(req, categoriesData.categories!.map(c => c.name), lastMonthStart, lastMonthEnd);

    return {
        props: {
            ssr: {
                userData: userData,
                categoriesData: categoriesData,
                expensesMultipleCategoriesData: expensesGetMultipleCategoriesData,
                last_month_categories: last_month_categories
            }
        }
    }
}
