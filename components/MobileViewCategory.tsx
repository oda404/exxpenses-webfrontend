import { useMutation } from "@apollo/client";
import { Button, IconButton, Stack, Typography, Box, Divider } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { useState } from "react";
import { User, Expense, CategoryEditDocument, Category, ExpenseAddDocument } from "../generated/graphql";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import CategoryTabExpense from "./CategoryTabExpense";
import Footer from "./Footer";
import InputField from "./InputField";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Navbar from "./navbar";
import dynamic from "next/dynamic";
import styles from "../styles/Category.module.css"
import tabHeaderButtonStyles from "../styles/TabHeaderButton.module.css";
import { useRouter } from "next/router";
import Decimal from "decimal.js";
import addFloats from "../utils/addFloats";
import daysBetweenDates from "../utils/daysBetweenDates";
import expensesToDailyTotals, { DailyExpenses } from "../utils/expensesToDaily";
import StatisticTab from "./StatisticsTab";

interface AddNewExpenseCardProps {
    default_category: string;
    default_currency: string;
    isMobileView?: boolean;
    width?: string;
}

function AddNewExpenseCard({ width, isMobileView, default_category, default_currency }: AddNewExpenseCardProps) {

    const [expenseAdd] = useMutation(ExpenseAddDocument);
    const router = useRouter();

    const date = new Date().toISOString().slice(0, 10);

    return (
        <Box
            width={"auto"}
            display="flex"
            flexDirection="column"
            key={default_category}
            sx={{
                animation: default_category !== undefined ? `${styles.blink} .5s linear` : "", borderRadius: "5px"
            }}>
            <Box marginBottom="5px" display="flex">
                <Typography fontSize="17px" marginLeft="6px">
                    Add a new expense to {default_category}
                </Typography>
            </Box>
            <Formik
                enableReinitialize
                initialValues={{ category: default_category, price: "", description: "", currency: default_currency, date: date }}
                onSubmit={async (values, actions) => {

                    if (!values.category || values.category.length === 0) {
                        actions.setFieldError("category", "The category name is required!")
                        return;
                    }

                    if (!values.price) {
                        actions.setFieldError("price", "The price is required!")
                        return;
                    }

                    let number_price = Number(values.price);
                    if (number_price <= 0) {
                        actions.setFieldError("price", "Price needs to be bigger than 0!");
                        return;
                    }

                    if (!values.currency || values.currency.length === 0) {
                        actions.setFieldError("currency", "The currency name is required!")
                        return;
                    }

                    if (!values.date || values.date.length === 0) {
                        actions.setFieldError("date", "The date is required!")
                        return;
                    }

                    let { data } = await expenseAdd({
                        variables: {
                            addData: {
                                category_name: values.category,
                                price: number_price,
                                description: values.description,
                                currency: values.currency,
                                date: values.date
                            }
                        }
                    });

                    if (data.expenseAdd.error) {
                        const field = data.expenseAdd.error.field === "category_name" ? "category" : data.expenseAdd.error.field;
                        actions.setFieldError(field, data.expenseAdd.error.name)
                    }
                    else {
                        // actions.resetForm();
                        router.reload();
                    }
                }}
            >
                {({ setFieldValue, isSubmitting, errors }) => (
                    <Form>

                        <Box display="flex">
                            <Field name="price">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField is_error={errors.price !== undefined} bg="var(--exxpenses-second-bg-color)" type="number" field={field} name="price" label="Price" />
                                        <ErrorMessage name="price" component="div" />
                                    </Box>
                                )}
                            </Field>
                            <Box marginX="5px" />
                            <Field name="currency">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField is_error={errors.currency !== undefined} bg="var(--exxpenses-second-bg-color)" field={field} name="currency" label="Currency" />
                                        <ErrorMessage name="currency" component="div" />
                                    </Box>
                                )}
                            </Field>
                            <Box marginX="5px" />
                            <Field name="date">
                                {({ field }: FieldProps) => (
                                    <Box width="145px" marginTop="10px">
                                        <InputField is_error={errors.date !== undefined} bg="var(--exxpenses-second-bg-color)" field={field} type="date" name="date" label="Date" />
                                        <ErrorMessage name="date" component="div" />
                                    </Box>
                                )}
                            </Field>
                        </Box>

                        <Field name="description">
                            {({ field }: FieldProps) => (
                                <Box marginTop="10px">
                                    <InputField bg="var(--exxpenses-second-bg-color)" field={field} name="description" label="Description" />
                                    <ErrorMessage name="description" component="div" />
                                </Box>
                            )}
                        </Field>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            fullWidth={true}
                            className={styles.dashboardSubmitButton}
                        >
                            Add
                        </Button>
                    </Form >
                )
                }
            </Formik >
        </Box >
    )
}

interface CategoryViewsProps {
    user: User;
    expenses: Expense[];
    lastMonthExpenses: Expense[];
    category: Category;
}

export default function MobileViewCategory({ lastMonthExpenses, user, expenses, category }: CategoryViewsProps) {

    const [categoryEdit] = useMutation(CategoryEditDocument);

    let now = new Date();
    let since = new Date(now.getFullYear(), now.getMonth(), 1);

    /* If unpaid, we only count the expenses with the default currency towards the total */
    let totalExpenses = expensesToTotal(expenses, category.default_currency);
    let dailyTotals = expensesToDailyTotals(expenses, category.default_currency);

    const [showNewExpenseAdd, setSShowNewExpenseAdd] = useState(false);
    const [editCategory, setEditCategory] = useState(false);

    let content: any;

    let categoryHeader: any;
    if (editCategory) {
        categoryHeader = (
            <Box width="auto" display="flex">

                <Formik
                    enableReinitialize
                    initialValues={{ name: category.name, currency: category.default_currency }}
                    onSubmit={async ({ name, currency }, actions) => {

                        if (!name || name.length === 0) {
                            actions.setFieldError("name", "The category name is required!")
                            return;
                        }
                        else if (name.length > 30) {
                            actions.setFieldError("name", "The category name can't be longer than 30 characters!");
                            return;
                        }

                        if (!currency || currency.length === 0) {
                            actions.setFieldError("currency", "The currency name is required!")
                            return;
                        }

                        if (name === category.name && currency === category.default_currency) {
                            setEditCategory(false);
                            return;
                        }

                        let { data } = await categoryEdit({
                            variables: {
                                editData: {
                                    id: category.id,
                                    name: name,
                                    default_currency: currency
                                }
                            }
                        });

                        window.location.assign(`/category/${name}`);
                    }}
                >
                    {({ setFieldValue, isSubmitting, errors }) => (
                        <Form style={{ width: "100%" }}>
                            <Box display="flex">
                                <Field name="name">
                                    {({ field }: FieldProps) => (
                                        <Box width="120px" marginTop="10px">
                                            <InputField
                                                is_error={errors.name !== undefined}
                                                bg="var(--exxpenses-second-bg-color)"
                                                field={field}
                                                name="name"
                                                label="Name"
                                            />
                                            <ErrorMessage name="price" component="div" />
                                        </Box>
                                    )}
                                </Field>
                                <Box marginX="5px" />
                                <Field name="currency">
                                    {({ field }: FieldProps) => (
                                        <Box width="90px" marginTop="10px">
                                            <InputField is_error={errors.currency !== undefined} bg="var(--exxpenses-second-bg-color)" field={field} name="currency" label="Currency" />
                                            <ErrorMessage name="currency" component="div" />
                                        </Box>
                                    )}
                                </Field>
                                <Button
                                    sx={{
                                        marginLeft: "auto"
                                    }}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <CheckRoundedIcon sx={{ width: "20px", height: "20px" }} />
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        )
    }
    else {
        categoryHeader = (
            <Box display="flex">
                <Box fontSize="20px">
                    <b>{category.name}</b>
                </Box>
                <Box fontSize="12px" marginTop="10px" marginLeft="8px">
                    {category.default_currency}
                </Box>
                <IconButton
                    sx={{
                        marginLeft: "auto"
                    }}
                    onClick={() => {
                        setEditCategory(true);
                    }}
                >
                    <ModeEditIcon sx={{ width: "20px", height: "20px" }} />
                </IconButton>
            </Box>
        )
    }

    if (expenses.length === 0) {
        content = (
            <Box marginX="auto">
                No expenses yet...
            </Box>
        )
    }
    else {

        var dates = [];
        for (let d = new Date(since); d <= now; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        dates.reverse();

        content = (
            <Stack spacing={1}>
                {dates.map((d: Date, idx: number) => {

                    let datestr = d.toDateString();

                    let found = expenses.findIndex((e: any) => new Date(e.date).toDateString() == datestr);
                    if (found === -1)
                        return;

                    return (
                        <Box key={idx}>
                            <Typography sx={{ fontSize: "14px", color: "#9f9f9f" }}>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</Typography>
                            {expenses.map((e: any, idx2: number) => {
                                if (new Date(e.date).toDateString() == datestr)
                                    return <CategoryTabExpense key={idx2} category_name={category.name} category_currency={category.default_currency} expense={{ id: e.id, price: e.price, currency: e.currency, date: e.date, description: e.description }} />

                                return <Box key={idx2}></Box>
                            })}
                        </Box>
                    );
                })}
            </Stack>
        );
    }

    return (
        <Box position="relative" minHeight="100vh">
            <Navbar username={user.lastname} />

            <Box padding="15px">
                <Box marginTop="25px" display="flex">
                    <Button
                        className={tabHeaderButtonStyles.tabHeaderButton}
                        sx={{
                            background: "var(--exxpenses-second-bg-color)",

                            "&:hover": {
                                background: "var( --exxpenses-main-button-hover-bg-color)",
                                textDecoration: "none"
                            },
                            paddingX: "10px",
                            textDecoration: "none",
                            width: "100%"
                        }}
                        onClick={() => {
                            window.location.assign("/dashboard");
                        }}
                    >
                        Dashboard
                    </Button>
                    <Box marginX="5px" />
                    <Button
                        className={tabHeaderButtonStyles.tabHeaderButton}
                        sx={{
                            background: "var(--exxpenses-second-bg-color)",

                            "&:hover": {
                                background: "var( --exxpenses-main-button-hover-bg-color)",
                                textDecoration: "none"
                            },
                            paddingX: "10px",
                            textDecoration: "none",
                            width: "100%"
                        }}
                        onClick={() => setSShowNewExpenseAdd(!showNewExpenseAdd)}
                    >
                        {showNewExpenseAdd ? "Close" : "+ New expense"}
                    </Button>
                </Box>
                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    flexDirection="column"
                    borderRadius="8px"
                    height={showNewExpenseAdd ? "fit-content !important" : "0 !important"}
                    marginTop="15px"
                    display={showNewExpenseAdd ? "flex" : "none"}
                >
                    <AddNewExpenseCard default_category={category.name} default_currency={category.default_currency} />
                </Box>
                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="15px"
                >
                    {categoryHeader}

                    <Box fontSize="18px">
                        {totalExpenses.currency} {totalExpenses.price}
                    </Box>

                    <Box fontSize="16px">
                        Showing {since.getDate()}.{since.getMonth() + 1}.{since.getFullYear()} - {now.getDate()}.{now.getMonth() + 1}.{now.getFullYear()} (This month)
                    </Box>
                </Box >

                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="15px"
                >
                    <StatisticTab lastMonthExpenses={lastMonthExpenses} category={category} since={since} until={now} dailyTotals={dailyTotals} totalExpenses={totalExpenses} />
                </Box>

                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="15px"
                >
                    <Box marginBottom="10px">
                        Expenses
                    </Box>
                    {content}

                    <AccessibleForwardIcon sx={{ marginTop: "20px", marginLeft: "auto", marginRight: "auto" }} />
                </Box>
            </Box>

            <Footer />
        </Box >

    )
}