import { ApolloQueryResult, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import { InferGetServerSidePropsType } from "next";
import InputField from "../components/InputField";
import Navbar from "../components/navbar";
import { CategoriesGetDocument, CategoriesGetQuery, ExpensesTotalCostGetMultipleDocument, ExpensesTotalCostGetMultipleQuery, UserGetDocument, UserGetQuery } from "../generated/graphql";
import apolloClient from "../utils/apollo-client";
import { CategoryAddDocument, ExpenseAddDocument } from "../generated/graphql";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import TabHeaderButton, { CategoryHeaderButton } from "../components/TabHeaderButton";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import CategoryTab from "../components/CategoryTab";
import { Box, Stack, Button, Divider, Autocomplete, Paper, Typography, Tooltip } from "@mui/material";
import styles from "../styles/Dashboard.module.css"
import { Category } from "../generated/graphql";
import { useRouter } from "next/router";
import Stats from "../components/Stats";
import useShowMobileView from "../utils/useShowMobileView";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({ ssr }: DashboardProps) {

    const [tabs, setTabs] = useState<string[]>([]);

    const [dashboardActiveTab, setDashboardActiveTab] = useState<string | null>("Overview");
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

        setDashboardTab("Overview")
        tabs.splice(tabIdx, 1);
        setTabs((t) => [...tabs]);
    }

    const [focusedCategory, setFocusedCategory] = useState<string | undefined>("");

    let activeTab: any;
    if (categoryActiveTab === null) {
        switch (dashboardActiveTab) {
            case "Overview":
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

    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)">
            <Navbar username={user.lastname} />

            <Box marginTop="60px" display="flex" flexDirection="row" sx={{ paddingX: isMobileView ? "10px" : "40px" }}>

                <Box display="flex" flexDirection="column" height="100%" width="100%">
                    <Box display="flex">
                        <TabHeaderButton active={dashboardActiveTab === "Overview"} name="Overview" setActive={setDashboardTab} />
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

