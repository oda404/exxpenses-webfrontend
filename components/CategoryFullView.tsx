import { useMutation } from "@apollo/client";
import { Button, IconButton, Box, Stack, Tooltip, Typography, Modal } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { useState } from "react";
import { Category, CategoryEditDocument, Expense, ExpenseAddDocument, User } from "../generated/graphql";
import expensesToDailyTotals from "../utils/expensesToDaily";
import expensesToTotal from "../utils/expensesToTotal";
import Footer from "./Footer";
import FullViewCategoryExpensesTab from "./FullViewCategoryExpensesTab";
import InputField from "./InputField";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useRouter } from "next/router";
import ClearIcon from '@mui/icons-material/Clear';
import CategoryStatistics from "./CategoryStatistics";
import CardBox from "./CardBox";
import Sidenav from "./Sidenav";
import Topbar from "./Topbar";
import NewsTab from "./NewsTab";

interface MobileViewAddNewExpenseCardProps {
    category: Category;
    close: () => void;
}

function MobileViewAddNewExpenseCard({ close, category }: MobileViewAddNewExpenseCardProps) {
    const [expenseAdd] = useMutation(ExpenseAddDocument);
    const router = useRouter();

    const date = new Date().toISOString().slice(0, 10);

    return (
        <Box
            width={"auto"}
            display="flex"
            flexDirection="column"
            border="1px #444444 solid"
            height="fit-content"
            padding="12px"
            sx={{
                background: "var(--exxpenses-main-bg-color)", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
            }}>
            <Box marginBottom="5px" display="flex">
                <Typography fontSize="17px" marginLeft="6px">
                    New {category.name}
                </Typography>
                <Tooltip title="Close">
                    <Button onClick={close} sx={{ width: "24px", height: "24px", marginLeft: "auto" }}>
                        <ClearIcon />
                    </Button>
                </Tooltip>
            </Box>
            <Formik
                enableReinitialize
                initialValues={{ category: category.name, price: "", description: "", currency: category.default_currency, date: date }}
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
                        <Stack>
                            <Box width="250px" display="flex">
                                <Field name="price">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="10px">
                                            <InputField type="number" field={field} name="price" label="Price" />
                                            <ErrorMessage name="price" component="div" />
                                        </Box>
                                    )}
                                </Field>
                                <Box marginLeft="5px" marginRight="5px" />
                                <Field name="currency">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="10px">
                                            <InputField field={field} name="currency" label="Currency" />
                                            <ErrorMessage name="currency" component="div" />
                                        </Box>
                                    )}
                                </Field>
                            </Box>


                            <Field name="description">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField field={field} name="description" label="Description" />
                                        <ErrorMessage name="description" component="div" />
                                    </Box>
                                )}
                            </Field>

                            <Field name="date">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField field={field} type="date" name="date" label="Date" />
                                        <ErrorMessage name="date" component="div" />
                                    </Box>
                                )}
                            </Field>
                        </Stack>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            fullWidth={true}
                            className="standardButton"
                            sx={{ marginTop: "10px" }}
                        >
                            Add
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box >
    )
}

interface CategoryFullViewProps {
    user: User;
    expenses: Expense[];
    lastMonthExpenses: Expense[];
    category: Category;
}

export default function FullViewCategory({ lastMonthExpenses, user, category, expenses }: CategoryFullViewProps) {

    const [categoryEdit] = useMutation(CategoryEditDocument);

    const [newCategoryOpen, setNewCategoryOpen] = useState(false);

    let now = new Date();
    let since = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalExpenses = expensesToTotal(expenses, category.default_currency);

    const [editCategory, setEditCategory] = useState(false);

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
                            <Box alignItems="center" display="flex">
                                <Field name="name">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="10px">
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
                                        marginLeft: "20px",
                                        width: "fit-content",
                                        height: "fit-content",
                                        borderRadius: "25px"
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
                <Box fontSize="18px">
                    <b>{category.name}</b>
                </Box>
                <Box fontSize="12px" marginTop="10px" marginLeft="8px">
                    {category.default_currency}
                </Box>
                <IconButton
                    sx={{
                        marginLeft: "20px"
                    }}
                    onClick={() => {
                        setEditCategory(true);
                    }}
                >
                    <ModeEditIcon sx={{ width: "18px", height: "18px" }} />
                </IconButton>
                <Button onClick={() => setNewCategoryOpen(true)} className="standardButton" sx={{ marginLeft: "auto" }} >
                    + New expense
                </Button>
            </Box>
        )
    }

    let dailyTotals = expensesToDailyTotals(expenses, category.default_currency);
    return (
        <Box minHeight="100vh">
            <Modal
                // sx={{ position: "absolute !important", zIndex: "998", background: "rgba(0, 0, 0, 0.3)" }
                open={newCategoryOpen}
                onClose={() => {
                    setNewCategoryOpen(false);
                }}
                sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center" }}
            >
                <Box>
                    <MobileViewAddNewExpenseCard
                        close={() => {
                            setNewCategoryOpen(false);
                        }}
                        category={category}
                    />
                </Box>
            </Modal>

            <Topbar />
            <Box paddingY="40px" marginX="auto" display="flex" justifyContent="center">
                <Sidenav firstname={user.firstname} lastname={user.lastname} />
                <Box width="540px" >
                    <CardBox>
                        {categoryHeader}
                        <Box fontSize="22px">
                            <Box>
                                <b>{totalExpenses.currency} {totalExpenses.price}</b>
                            </Box>
                        </Box>

                        <Box display="flex">
                            <Box fontSize="16px">
                                Showing {since.getDate()}.{since.getMonth() + 1}.{since.getFullYear()} - {now.getDate()}.{now.getMonth() + 1}.{now.getFullYear()} (This month)
                            </Box>
                            <Box marginLeft="auto">

                            </Box>
                        </Box>
                    </CardBox>

                    <Box marginY="10px" />

                    <CardBox>
                        <CategoryStatistics lastMonthExpenses={lastMonthExpenses} category={category} since={since} until={now} dailyTotals={dailyTotals} totalExpenses={totalExpenses} />
                    </CardBox>

                    <Box marginY="10px" />

                    <CardBox>
                        <Box marginBottom="10px">
                            Expenses
                        </Box>
                        <FullViewCategoryExpensesTab category={category} expenses={expenses} since={since} until={now} />
                    </CardBox>

                </Box>
                <Box marginX="10px" />
                <NewsTab user={user} />
            </Box>
        </Box >
    )
}
