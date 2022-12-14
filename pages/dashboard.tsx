import { ApolloQueryResult } from "@apollo/client";
import { InferGetServerSidePropsType } from "next";
import Navbar from "../components/navbar";
import { CategoriesGetDocument, CategoriesGetQuery, ExpensesTotalCostGetMultipleDocument, ExpensesTotalCostGetMultipleQuery, UserGetDocument, UserGetQuery } from "../generated/graphql";
import apolloClient from "../utils/apollo-client";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import TabHeaderButton, { CategoryHeaderButton } from "../components/TabHeaderButton";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import CategoryTab from "../components/CategoryTab";
import { Box, Divider } from "@mui/material";
import { Category } from "../generated/graphql";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({ ssr }: DashboardProps) {

    const [tabs, setTabs] = useState<string[]>([]);

    const [dashboardActiveTab, setDashboardActiveTab] = useState<string | null>("Home");
    const [categoryActiveTab, setCategoryActiveTab] = useState<string | null>(null);

    const isMobileView = useShowMobileView();

    const setDashboardTab = (name: string | null) => {
        setCategoryActiveTab(null);
        setDashboardActiveTab(name);
    }

    const setCategoryTab = (name: string) => {
        setDashboardTab(null);
        setCategoryActiveTab(name);
    }

    const n = (tabname: string) => {
        for (let i = 0; i < tabs.length; ++i) {
            if (tabs[i] === tabname) {
                setCategoryTab(tabname);
                return;
            }
        }
        setTabs([...tabs, tabname])
        setCategoryTab(tabname)
    }

    const d = (tabname: string) => {
        const tabIdx = tabs.findIndex(t => t === tabname);
        if (tabIdx === -1)
            return;

        setDashboardTab("Home")
        tabs.splice(tabIdx, 1);
        setTabs((t) => [...tabs]);
    }

    const [focusedCategory, setFocusedCategory] = useState<string | undefined>("");

    let activeTab: any;
    if (categoryActiveTab === null) {
        switch (dashboardActiveTab) {
            case "Home":
                activeTab = (
                    <DashboardCategoriesTab
                        preferred_currency={ssr?.userGet.user?.preferred_currency}
                        focusCategory={setFocusedCategory}
                        focusedCategory={focusedCategory}
                        totalCosts={ssr.expensesTotalCost.costs}
                        categories={ssr.categoriesGet.categories as Category[]}
                        newTab={n}
                    />
                );
                break;
            default:
                activeTab = null;
        }
    }
    else {
        activeTab = <CategoryTab name={categoryActiveTab} default_currency={ssr.categoriesGet.categories?.find((c: any) => c.name === categoryActiveTab)!.default_currency!} />;
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
                    {tabs.map((m, idx) =>
                        <Box display="flex" key={idx}>
                            <CategoryHeaderButton active={categoryActiveTab === m} name={m} setActive={setCategoryTab} remove={d} />
                        </Box>
                    )}
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
                        {tabs.map((m, idx) =>
                            <Box display="flex" key={idx}>
                                <Divider orientation="vertical" sx={{ background: "var(--exxpenses-main-border-color)" }} />
                                <CategoryHeaderButton active={categoryActiveTab === m} name={m} setActive={setCategoryTab} remove={d} />
                            </Box>
                        )}
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

