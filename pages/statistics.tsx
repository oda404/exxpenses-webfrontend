import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Cookies from "universal-cookie";
import Footer from "../components/Footer";
import StatisticsTab from "../components/StatisticsTab";
import { Category, User } from "../generated/graphql";
import categoriesGet from "../gql/ssr/categoriesGet";
import expensesGetMultipleCategories from "../gql/ssr/expensesGetMultipleCategories";
import userGet from "../gql/ssr/userGet";
import getNowUserOffset from "../utils/getNowWithUserOffset";

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Statistics({ ssr }: DashboardProps) {

    const user = ssr.userData.user! as User;
    const categories = ssr.categoriesData.categories as Category[];
    const expensesMultipleCategories = ssr.expensesMultipleCategoriesData;

    return (
        <Box position="relative" minHeight="100vh">
            <Head>
                <title>Exxpenses - Track your day-to-day expenses</title>
                <meta
                    name="description"
                    content="Statistics for your expenses."
                    key="desc"
                />
            </Head>

            <Box sx={{ height: "100vh", background: "var(--exxpenses-main-bg-color)" }}>
                <StatisticsTab user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />
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

    return {
        props: {
            ssr: {
                userData: userData,
                categoriesData: categoriesData,
                expensesMultipleCategoriesData: expensesGetMultipleCategoriesData,
            }
        }
    }
}
