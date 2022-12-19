import { useMutation } from "@apollo/client";
import { Button, IconButton, Divider, Box } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { useState } from "react";
import { Category, CategoryEditDocument, Expense, User } from "../generated/graphql";
import expensesToDailyTotals, { dailyTotalsKeepCurrency, DailyExpenses } from "../utils/expensesToDaily";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import Footer from "./Footer";
import FullBarExpenseChart from "./FullBarExpenseChart";
import FullViewCategoryExpensesTab from "./FullViewCategoryExpensesTab";
import InputField from "./InputField";
import Navbar from "./navbar";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { ContentCutOutlined } from "@mui/icons-material";

function FullViewStatistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content" borderBottom="1px solid var(--exxpenses-main-border-color)" marginTop="20px">
            <Box>
                {title}
            </Box>
            <Box>
                <b>{content}</b>
            </Box>
        </Box>
    )
}

interface StatisticsTabProps {
    totalExpenses: TotalExpense[];
    dailyTotals: DailyExpenses[];
    since: Date;
    until: Date;
}

function StatisticTab({ since, until, totalExpenses, dailyTotals }: StatisticsTabProps) {

    let mostExpensiveDay: DailyExpenses | undefined = undefined;
    for (let i = 0; i < dailyTotals.length; ++i) {
        if (mostExpensiveDay === undefined || dailyTotals[i].expenses[0].price > mostExpensiveDay.expenses[0].price)
            mostExpensiveDay = dailyTotals[i];
    }

    let content: any;
    if (totalExpenses.length === 0) {
        content = (
            <>
                <Box marginBottom="15px">
                    Statistics
                </Box>
                <FullBarExpenseChart dailyTotals={dailyTotals} since={since} until={until} />
                <Divider sx={{ marginTop: "10px", width: "100%", backgroundColor: "var(--exxpenses-main-border-color)", height: "1px" }} />

                <Box>
                    <FullViewStatistic title="Total spent" content="0" />
                    <Box marginX="10px" />
                    <FullViewStatistic title=" Most expensive day" content="N/A" />
                    <Box marginX="10px" />
                    <FullViewStatistic title="Average per day" content="0" />
                    <Box marginX="10px" />
                    <FullViewStatistic title="Compared to last month" content="-100%" />
                </Box>
            </>
        )
    }
    else {
        content = (
            <>
                <Box marginBottom="15px">
                    Statistics
                </Box>
                <FullBarExpenseChart dailyTotals={dailyTotals} since={since} until={until} />
                <Divider sx={{ marginTop: "10px", width: "100%", backgroundColor: "var(--exxpenses-main-border-color)", height: "1px" }} />

                <Box>
                    <FullViewStatistic title="Total spent" content={`${totalExpenses[0].currency} ${totalExpenses[0].price}`} />
                    <Box marginX="10px" />
                    <FullViewStatistic title=" Most expensive day" content={`${mostExpensiveDay.expenses[0].currency} ${mostExpensiveDay.expenses[0].price} on ${new Date(mostExpensiveDay.date).toISOString().slice(0, 10)}`} />
                    <Box marginX="10px" />
                    <FullViewStatistic title="Average per day" content={"Penis"} />
                    <Box marginX="10px" />
                    <FullViewStatistic title="Compared to last month" content={"Penis"} />
                </Box>
            </>
        )
    }


    return (
        <>
            {content}
        </>
    )
}

interface CategoryFullViewProps {
    user: User;
    expenses: Expense[];
    category: Category;
}

export default function FullViewCategory({ user, category, expenses }: CategoryFullViewProps) {

    const [categoryEdit] = useMutation(CategoryEditDocument);

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
                            <Box display="flex">
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
                <Box fontSize="18px">
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

    let dailyTotals = expensesToDailyTotals(expenses);
    dailyTotals = dailyTotalsKeepCurrency(dailyTotals, category.default_currency);

    return (
        <Box position="relative" minHeight="100vh">
            <Navbar username={user.lastname} />

            <Box paddingX="160px" paddingY="80px">
                <Box
                    sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                    paddingX="20px"
                    paddingY="16px"
                    display="flex"
                    flexDirection="column"
                    borderRadius="8px"
                    height="fit-content"
                    marginTop="15px"
                >
                    {categoryHeader}
                    <Box fontSize="22px">
                        {totalExpenses.length > 0 ?
                            <Box>
                                <b>{totalExpenses[0].currency} {totalExpenses[0].price}</b>
                            </Box> :
                            (null)
                        }
                    </Box>

                    <Box fontSize="16px">
                        Showing {since.getDate()}.{since.getMonth() + 1}.{since.getFullYear()} - {now.getDate()}.{now.getMonth() + 1}.{now.getFullYear()} (This month)
                    </Box>
                </Box>

                <Box display="flex">

                    <Box
                        sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                        paddingX="20px"
                        paddingY="16px"
                        display="flex"
                        flexDirection="column"
                        borderRadius="8px"
                        marginTop="15px"
                        width="100%"
                    >
                        <StatisticTab since={since} until={now} dailyTotals={dailyTotals} totalExpenses={totalExpenses} />


                    </Box>
                    <Box marginX="10px" />
                    <Box
                        sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
                        paddingX="20px"
                        paddingY="16px"
                        display="flex"
                        flexDirection="column"
                        borderRadius="8px"
                        height="fit-content"
                        marginTop="15px"
                        width="100%"
                    >
                        <Box marginBottom="10px">
                            Expenses
                        </Box>
                        <FullViewCategoryExpensesTab category={category} expenses={expenses} since={since} until={now} />
                    </Box>
                </Box>

            </Box>

            <Footer />
        </Box >
    )
}
