import { useMutation } from "@apollo/client";
import { Button, IconButton, Box, Link, Modal } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { useState } from "react";
import { User, Expense, CategoryEditDocument, Category } from "../generated/graphql";
import expensesToTotal from "../utils/expensesToTotal";
import InputField from "./InputField";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import tabHeaderButtonStyles from "../styles/TabHeaderButton.module.css";
import CategoryStatistics from "./CategoryStatistics";
import Topbar from "./Topbar";
import FullViewCategoryExpensesTab from "./CategoryExpenses";
import NewsTab from "./NewsTab";
import CardBox from "./CardBox";
import DangerZone from "./DangerZone";
import DropdownInputField from "./DropdownInputField";
import { currencies } from "../utils/currency";
import ReplayIcon from '@mui/icons-material/Replay';
import AddNewExpenseCard from "./AddNewExpenseCard";

interface CategoryViewsProps {
    user: User;
    expenses: Expense[];
    lastMonthExpenses: Expense[];
    category: Category;
    showing_since: Date;
    showing_until: Date;
    compare_since: Date;
    compare_until: Date;
    custom_period: boolean;
}

export default function MobileViewCategory({ lastMonthExpenses, expenses, category, user, showing_since, showing_until, compare_since, compare_until, custom_period }: CategoryViewsProps) {

    const [categoryEdit] = useMutation(CategoryEditDocument);

    let now = new Date();
    let since = new Date(now.getFullYear(), now.getMonth(), 1);

    /* If unpaid, we only count the expenses with the default currency towards the total */
    let totalExpenses = expensesToTotal(expenses, category.default_currency);

    const [editCategory, setEditCategory] = useState(false);

    const [dirtyCurrency, setDirtyCurrency] = useState(false);
    let currency_input_changed = (e: string) => {
        setDirtyCurrency(e !== category.default_currency);
    }

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
                            <Box paddingTop="5px" alignItems="center" display="flex">
                                <Field name="name">
                                    {({ field }: FieldProps) => (
                                        <Box>
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
                                        <Box>
                                            <DropdownInputField
                                                bg="var(--exxpenses-second-bg-color)"
                                                field={field}
                                                is_error={errors.currency !== undefined}
                                                elements={currencies}
                                                oninput={currency_input_changed}
                                            />
                                            <ErrorMessage name="currency" component="div" />
                                        </Box>
                                    )}
                                </Field>
                                <Box marginLeft="auto" />
                                <Button
                                    sx={{ marginX: "10px" }}
                                    onClick={() => {
                                        setFieldValue("name", category.name);
                                        setFieldValue("currency", category.default_currency);
                                    }}
                                >
                                    <ReplayIcon />
                                </Button>
                                <Button
                                    sx={{
                                        marginRight: "5px"
                                    }}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <CheckRoundedIcon sx={{}} />
                                </Button>
                            </Box>
                            <Box fontSize="12px" color="var(--exxpenses-warning-color)" display={dirtyCurrency ? "block" : "none"}>
                                Changing the currency of a category will not change the curencies of existing expenses for that category. This is a feature that is going to be implemented in the future. Thank you for understanding!
                                {/* Learn more <Link sx={{ color: "var(--exxpenses-warning-color)" }} href="/plans">here</Link>. */}
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        )
    }
    else {
        categoryHeader = (
            <Box>
                <Box alignItems="center" display="flex">
                    <Box fontSize="20px">
                        <b>{category.name}</b>
                    </Box>
                    <Box fontSize="16px" marginTop="5px" marginLeft="8px">
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
                    <Button onClick={() => setNewCategoryOpen(true)} className="fullButton" sx={{ margin: "0 !important", marginLeft: "auto !important", width: "fit-content !important" }} >
                        + New expense
                    </Button>
                </Box>
                <Box fontSize="16px">
                    {totalExpenses.currency} {totalExpenses.price} this month
                </Box>
            </Box >
        )
    }

    const [newCategoryOpen, setNewCategoryOpen] = useState(false);

    return (
        <Box position="relative" minHeight="100vh">
            <Topbar user={user} />
            <Box padding="15px" paddingTop="40px">
                <Modal
                    open={newCategoryOpen}
                    onClose={() => {
                        setNewCategoryOpen(false);
                    }}
                    sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center", backdropFilter: "blur(5px)" }}
                >
                    <Box>
                        <AddNewExpenseCard
                            close={() => {
                                setNewCategoryOpen(false);
                            }}
                            category={category}
                        />
                    </Box>
                </Modal>

                <Box display="flex">
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
                        onClick={() => {
                            window.location.assign("/statistics");
                        }}
                    >
                        Statistics
                    </Button>
                </Box>
                <NewsTab user={user} banner_mode />
                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="10px"
                >
                    {categoryHeader}
                </Box >
                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="10px"
                >
                    <CategoryStatistics
                        user={user}
                        total={totalExpenses}
                        category={category}
                        showing_expenses={expenses}
                        compare_expenses={lastMonthExpenses}
                        showing_since={showing_since}
                        showing_until={showing_until}
                        compare_since={compare_since}
                        compare_until={compare_until}
                        custom_period={custom_period}
                    />
                </Box>

                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    padding="10px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="10px"
                >
                    <Box fontSize="18px">
                        Expenses
                    </Box>
                    <FullViewCategoryExpensesTab category={category} expenses={expenses} since={since} until={now} />
                </Box>

                <Box marginTop="10px" />
                <CardBox>
                    <DangerZone name={category.name} />
                </CardBox>
            </Box>
        </Box>
    )
}