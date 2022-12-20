import { ApolloQueryResult, useMutation } from "@apollo/client";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Category as CategoryStruct, CategoryEditDocument, CategoryGetDocument, CategoryGetQuery, Expense, ExpenseAddDocument, User } from "../../generated/graphql";
import apolloClient from "../../utils/apollo-client";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Footer from "../../components/Footer";
import Navbar from "../../components/navbar";
import tabHeaderButtonStyles from "../../styles/TabHeaderButton.module.css";
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import { useState } from "react";
import styles from "../../styles/Category.module.css"
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import InputField from "../../components/InputField";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import expensesToTotal from "../../utils/expensesToTotal";
import userGet from "../../gql/ssr/userGet";
import expensesGet from "../../gql/ssr/expensesGet";
import Cookies from "universal-cookie";
import getNowUserOffset from "../../utils/getNowWithUserOffset";
import useShowMobileView from "../../utils/useShowMobileView";
import CategoryTabExpense from "../../components/CategoryTabExpense";
import dynamic from "next/dynamic";
import FullViewCategory from "../../components/CategoryFullView";
import MobileViewCategory from "../../components/MobileViewCategory";

/* What in the living fuck ?!:)dwdA!@W! */


type CategoryProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Category({ ssr }: CategoryProps) {

    const { expensesGet, lastMonthExpensesGet, categoryGet, userGet } = ssr;
    const category = categoryGet?.categories![0]!;
    const expenses = expensesGet.expenses!;
    const lastMonthExpenses = lastMonthExpensesGet.expenses!;
    const user = userGet.user;

    const isMobileView = useShowMobileView();

    if (isMobileView) {
        return <MobileViewCategory lastMonthExpenses={lastMonthExpenses} category={category} expenses={expenses} user={user} />
    }
    else {
        return <FullViewCategory lastMonthExpenses={lastMonthExpenses} category={category} expenses={expenses} user={user} />
    }
}

export async function getServerSideProps({ req, params }: any) {

    const cookies = new Cookies(req.headers.cookie);

    /* Redirect if not logged in */
    const userData = await userGet(req);
    if (!userData.user) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    const { data: { categoryGet } }: ApolloQueryResult<CategoryGetQuery> = await apolloClient.query({
        query: CategoryGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache",
        variables: {
            categoryName: params.name,
        }
    });

    if (categoryGet.categories === null) {
        return {
            notFound: true,
            props: {
                ssr: {

                }
            }
        }
    }

    const user_tz_offset = cookies.get("user_tz_offset");
    const now = getNowUserOffset(user_tz_offset);
    const since = new Date(now.getUTCFullYear(), now.getMonth(), 1);

    const expensesData = await expensesGet(req, params.name, since, now);

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(since);
    lastMonthEnd.setDate(lastMonthEnd.getDate());

    const lastMonthExpensesData = await expensesGet(req, params.name, lastMonthStart, lastMonthEnd)

    return {
        props: {
            ssr: {
                userGet: userData,
                categoryGet: categoryGet,
                expensesGet: expensesData,
                lastMonthExpensesGet: lastMonthExpensesData
            }
        }
    }
}

