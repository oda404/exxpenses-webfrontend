import { InferGetServerSidePropsType } from "next";
import Navbar from "../components/navbar";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import TabHeaderButton from "../components/TabHeaderButton";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import { Box, Divider } from "@mui/material";
import { Category, User } from "../generated/graphql";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";
import userGet from "../gql/ssr/userGet";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories, { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import getNowUserOffset from "../utils/getNowWithUserOffset";
import Cookies from "universal-cookie";
import Head from "next/head";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({ ssr }: DashboardProps) {

    const [dashboardActiveTab, setDashboardActiveTab] = useState<string | null>("Home");
    const [focusedCategory, setFocusedCategory] = useState<string | undefined>("");

    const isMobileView = useShowMobileView();

    const setDashboardTab = (name: string | null) => {
        setDashboardActiveTab(name);
    }

    const user = ssr.userGet.user as User;
    const categories = ssr.categoriesGet.categories as Category[];
    const expensesMultipleCategories = ssr.expensesGetMultipleCategoriesGet as MultiCategoryExpenses;

    let content =
        <DashboardCategoriesTab
            preferred_currency={user.preferred_currency!}
            focusCategory={setFocusedCategory}
            focusedCategory={focusedCategory}
            expensesMultipleCategories={expensesMultipleCategories}
            categories={categories}
            since={ssr.since}
            until={ssr.until}
        />

    return (
        <Box position="relative" minHeight="100vh">
            <Head>
                <title>Dashboard | Exxpenses</title>
                <meta
                    name="description"
                    content="Overview of your expenses."
                    key="desc"
                />
            </Head>

            <Navbar username={user.lastname} />
            <Box>
                {content}
            </Box>
            <Footer />
        </Box>
    );
}

export async function getServerSideProps({ req }: any) {

    const cookies = new Cookies(req.headers.cookie);

    /* Redirect if not logged in */
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
    if (userData.user.preferred_currency === undefined || categoriesData.categories?.length === 0) {
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

    return {
        props: {
            ssr: {
                userGet: userData,
                categoriesGet: categoriesData,
                expensesGetMultipleCategoriesGet: expensesGetMultipleCategoriesData,
                until: now.toDateString(),
                since: since.toDateString()
            }
        }
    }
}

