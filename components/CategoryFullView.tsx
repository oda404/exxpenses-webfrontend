import { useMutation } from "@apollo/client";
import { Button, IconButton, Box, Modal, Link } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { useState } from "react";
import { Category, CategoryEditDocument, Expense, User } from "../generated/graphql";
import expensesToDailyTotals from "../utils/expensesToDaily";
import expensesToTotal from "../utils/expensesToTotal";
import FullViewCategoryExpensesTab from "./CategoryExpenses";
import InputField from "./InputField";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CategoryStatistics from "./CategoryStatistics";
import CardBox from "./CardBox";
import Sidenav from "./Sidenav";
import Topbar from "./Topbar";
import NewsTab from "./NewsTab";
import AddNewExpenseCard from "./AddNewExpenseCard";
import DangerZone from "./DangerZone";
import DropdownInputField from "./DropdownInputField";
import { currencies } from "../utils/currency";
import ReplayIcon from '@mui/icons-material/Replay';

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
                            <Box color="var(--exxpenses-warning-color)" display={dirtyCurrency ? "initial" : "none"}>
                                Changing the currency of a category will not change the curencies of existing expenses for that category, when using a free plan.
                                Learn more <Link sx={{ color: "var(--exxpenses-warning-color)" }} href="/plans">here</Link>.
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
                    <Box>
                        {totalExpenses.currency} {totalExpenses.price} this month
                    </Box>
                </Box>
            </Box>
        )
    }

    let dailyTotals = expensesToDailyTotals(expenses, category.default_currency);
    return (
        <Box minHeight="100vh">
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

            <Topbar user={user} />
            <Box paddingY="40px" marginX="auto" display="flex" justifyContent="center">
                <Sidenav look_at_category={category.name} />
                <Box width="540px" >
                    <CardBox>
                        {categoryHeader}
                    </CardBox>

                    <Box marginY="10px" />

                    <CardBox>
                        <CategoryStatistics lastMonthExpenses={lastMonthExpenses} category={category} dailyTotals={dailyTotals} totalExpenses={totalExpenses} />
                    </CardBox>

                    <Box marginY="10px" />

                    <CardBox>
                        <Box fontSize="18px">
                            Expenses
                        </Box>
                        <FullViewCategoryExpensesTab category={category} expenses={expenses} since={since} until={now} />
                    </CardBox>
                    <Box marginY="10px" />

                    <CardBox>
                        <DangerZone name={category.name} />
                    </CardBox>
                </Box>
                <Box marginX="10px" />
                <NewsTab user={user} />
            </Box>
        </Box >
    )
}
