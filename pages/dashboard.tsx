import { InferGetServerSidePropsType } from "next";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import { Box } from "@mui/material";
import { Category, User } from "../generated/graphql";
import Footer from "../components/Footer";
import userGet from "../gql/ssr/userGet";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories, { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import getNowUserOffset from "../utils/getNowWithUserOffset";
import Cookies from "universal-cookie";
import Head from "next/head";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({ ssr }: DashboardProps) {

    const user = ssr.userGet.user as User;
    const categories = ssr.categoriesGet.categories as Category[];
    const expensesMultipleCategories = ssr.expensesGetMultipleCategoriesGet as MultiCategoryExpenses;

    return (
        <Box position="relative" minWidth="100%" minHeight="100vh">
            <Head>
                <title>Exxpenses - Track your day-to-day expenses</title>
                <meta
                    name="description"
                    content="Overview of your expenses."
                    key="desc"
                />
            </Head>

            <Box sx={{ minHeight: "100vh", background: "var(--exxpenses-main-bg-color)" }}>
                <DashboardCategoriesTab
                    preferred_currency={user.preferred_currency!}
                    expensesMultipleCategories={expensesMultipleCategories}
                    categories={categories}
                    since={new Date(ssr.since)}
                    until={new Date(ssr.until)}
                    user={user}
                />
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

