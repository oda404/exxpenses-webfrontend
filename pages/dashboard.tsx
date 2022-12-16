import { ApolloQueryResult } from "@apollo/client";
import { InferGetServerSidePropsType } from "next";
import Navbar from "../components/navbar";
import { CategoriesGetDocument, CategoriesGetQuery, ExpensesGetDocument, ExpensesGetQuery, ExpensesTotalCostGetMultipleDocument, ExpensesTotalCostGetMultipleQuery, UserGetDocument, UserGetQuery } from "../generated/graphql";
import apolloClient from "../utils/apollo-client";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import TabHeaderButton, { CategoryHeaderButton } from "../components/TabHeaderButton";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import { Box, Divider } from "@mui/material";
import { Category } from "../generated/graphql";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";

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
                    totalCosts={ssr.expensesTotalCost.costs}
                    categories={ssr.categoriesGet.categories as Category[]}
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
            <Navbar username={user.lastname} />
            {content}
            <Footer />
        </Box>
    );
}

export async function getServerSideProps({ req }: any) {
    const user_resp: ApolloQueryResult<UserGetQuery> = await apolloClient.query({
        query: UserGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    if (user_resp.data.userGet.user === undefined || user_resp.data.userGet.user === null) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            },
            props: {}
        }
    }

    const category_resp: ApolloQueryResult<CategoriesGetQuery> = await apolloClient.query({
        query: CategoriesGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    if (category_resp.data.categoriesGet?.categories?.length === 0) {
        return {
            redirect: {
                permanent: false,
                destination: "/setup"
            }
        }
    }

    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses_total_cost_resp: ApolloQueryResult<ExpensesTotalCostGetMultipleQuery
    > = await apolloClient.query({
        query: ExpensesTotalCostGetMultipleDocument,
        variables: {
            getData: {
                category_names: category_resp.data.categoriesGet?.categories?.map(c => c.name),
                since: since,
                until: now
            }
        },
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return {
        props: {
            ssr: {
                userGet: user_resp.data.userGet,
                categoriesGet: category_resp.data.categoriesGet,
                expensesTotalCost: expenses_total_cost_resp.data.expensesTotalCostGetMultiple
            }
        }
    }
}

