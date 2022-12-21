import { InferGetServerSidePropsType } from "next";
import Navbar from "../components/navbar";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import TabHeaderButton from "../components/TabHeaderButton";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import { Box, Divider } from "@mui/material";
import { Category } from "../generated/graphql";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";
import userGet from "../gql/ssr/userGet";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories from "../gql/ssr/expensesGetMultipleCategories";
import getNowUserOffset from "../utils/getNowWithUserOffset";
import Cookies from "universal-cookie";
import Head from "next/head";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({ ssr }: DashboardProps) {

    const [dashboardActiveTab, setDashboardActiveTab] = useState<string | null>("Home");

    const isMobileView = useShowMobileView();

    const setDashboardTab = (name: string | null) => {
        setDashboardActiveTab(name);
    }

    const [focusedCategory, setFocusedCategory] = useState<string | undefined>("");

    let activeTab: any;
    switch (dashboardActiveTab) {
        case "Home":
            activeTab = (
                <DashboardCategoriesTab
                    preferred_currency={ssr?.userGet.user?.preferred_currency}
                    focusCategory={setFocusedCategory}
                    focusedCategory={focusedCategory}
                    expensesMultipleCategories={ssr.expensesGetMultipleCategoriesGet}
                    categories={ssr.categoriesGet.categories as Category[]}
                    since={ssr.since}
                    until={ssr.until}
                />
            );
            break;
        default:
            activeTab = null;
    }

    const user = ssr.userGet.user!;

    let content: any;
    if (isMobileView) {
        content = (
            <Box padding="10px">
                <Box marginTop="25px" display="flex">
                    <TabHeaderButton active={dashboardActiveTab === "Home"} name="Home" setActive={setDashboardTab} />
                    <TabHeaderButton active={dashboardActiveTab === "Statistics"} name="Statistics" setActive={setDashboardTab} />
                    <Box ml="auto" />
                </Box>
                {activeTab}
            </Box>
        )
    }
    else {
        content = (
            <Box marginTop="60px" display="flex" flexDirection="row" sx={{ paddingX: isMobileView ? "10px" : "40px" }}>
                <Box display="flex" flexDirection="column" height="100%" width="100%">
                    <Box display="flex">
                        <TabHeaderButton active={dashboardActiveTab === "Home"} name="Home" setActive={setDashboardTab} />
                        <TabHeaderButton active={dashboardActiveTab === "Statistics"} name="Statistics" setActive={setDashboardTab} />
                        <Box ml="auto" />
                    </Box>
                    <Divider sx={{ width: "100%", backgroundColor: "var(--exxpenses-main-border-color)" }} />
                    {activeTab}
                </Box>
            </Box>
        );
    }

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
            {content}
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

