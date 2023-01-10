import { useMutation } from "@apollo/client";
import { Grid, Paper, Button, Popover, Divider, Tooltip, Box, Link, IconButton, Modal, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { CategoryDeleteDocument, Expense, Category, ExpenseAddDocument } from "../generated/graphql";
import expensesToDaily, { DailyExpenses } from "../utils/expensesToDaily";
import MinifiedExpenseChart from "./MinifiedExpenseChart";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import expensesToTotal from "../utils/expensesToTotal";
import WarningIcon from '@mui/icons-material/Warning';
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import InputField from "./InputField";
import ClearIcon from '@mui/icons-material/Clear';

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
            key={category.name}
            sx={{
                background: "var(--exxpenses-main-bg-color)", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
            }}>
            <Box marginBottom="5px" display="flex">
                <Typography fontSize="17px" marginLeft="6px">
                    New {category.name} expense
                </Typography>
                <Tooltip title="Close">
                    <Button onClick={close} sx={{ width: "24px", height: "24px", marginLeft: "auto" }}>
                        <ClearIcon />
                    </Button>
                </Tooltip>
            </Box>
            <Formik
                enableReinitialize
                initialValues={{ category: category.name, price: "", description: "", currency: category?.default_currency, date: date }}
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
                                        <Box width="160px" marginTop="10px">
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
                            className={styles.dashboardSubmitButton}
                        >
                            Add
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box >
    )
}

interface CategoryBoxProps {
    category: Category;
    expenses: Expense[];
    since: Date;
    until: Date;
    preferred_currency: string;
    key: number;
    isMobileView: boolean;
}

export default function CategoryBox({ since, until, preferred_currency, category, expenses, isMobileView }: CategoryBoxProps) {

    let dailyExpenses: DailyExpenses[] = [];
    dailyExpenses = expensesToDaily(expenses, category.default_currency);

    let total = expensesToTotal(expenses, category.default_currency);
    let monthly: any;

    monthly = (
        <Box>
            {total.currency} {total.price}
        </Box>
    );

    let warningIcon: any = null;
    if (preferred_currency !== category.default_currency) {
        warningIcon = (
            <IconButton onClick={() => { window.location.assign("/free-account") }} sx={{ padding: "0", marginLeft: "10px" }}>
                <Tooltip title="This category is not counted towards the total. Click to learn more.">
                    <WarningIcon
                        sx={{ width: "20px", height: "20px", fill: "var(--exxpenses-warning-color)" }}
                    />
                </Tooltip>
            </IconButton>
        )
    }

    const [isOpen, setOpen] = useState(false);

    return (
        <Grid item maxWidth="100%" width={isMobileView ? "100%" : "auto"}>
            <Modal
                open={isOpen}
                onClose={() => { setOpen(false) }}
                sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center", backdropFilter: "blur(5px)" }}
            >
                <Box>
                    <MobileViewAddNewExpenseCard
                        close={() => { setOpen(false) }}
                        category={category}
                    />
                </Box>
            </Modal>

            <Link href={`/category/${category.name}`} sx={{ textDecoration: "none", "&:hover": { textDecoration: "none" } }}>
                <Paper className={styles.categoryBox}>
                    <Box display="flex" height="74px">
                        <Box minWidth="fit-content">
                            <Box alignItems="center" sx={{ overflowX: "hidden" }} display="flex">
                                <ClassIcon
                                    sx={{ width: "20px", height: "20px" }}
                                />
                                <Box sx={{ textTransform: "none", marginLeft: "8px", fontSize: ".875rem" }}><b>{category.name}</b></Box>
                                {warningIcon}
                            </Box>

                            <Box className={styles.categoryTotalCostBox} fontSize=".75rem !important">
                                {monthly}
                            </Box>
                        </Box>

                        <Box sx={{ "&:hover": { cursor: "pointer" } }} marginLeft="auto" width="70%">
                            <MinifiedExpenseChart since={since} until={until} dailyTotals={dailyExpenses} />
                        </Box>

                        <Box>
                            <Tooltip title="New expense" placement="top" arrow>
                                <Button
                                    className={stylesNew.categoryActionButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setOpen(true);
                                    }}
                                >
                                    <AddIcon sx={{ padding: "0", width: "20px", height: "20px" }} />
                                </Button>
                            </Tooltip>
                        </Box>

                        {/* <Box
                        display="flex"
                        flexDirection="column"
                        sx={{ backgroundColor: "var(--exxpenses-main-bg-color)" }}
                    >
                        <Tooltip title="New expense" placement="top" arrow>
                            <Button
                                className={stylesNew.categoryActionButton}
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                <AddIcon sx={{ padding: "0", width: "20px", height: "20px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Details" arrow>
                            <Link
                                href={`/category/${category.name}`}
                                className={stylesNew.categoryActionButton}
                            >
                                <ShowChartIcon sx={{ fill: "var(--exxpenses-light-green)", padding: "0", width: "20px", height: "20px" }} />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                            <Button
                                aria-describedby={id}
                                onClick={(e) => handleClick(e)}
                                className={stylesNew.categoryActionButton}
                            >
                                <DeleteIcon className={styles.categoryDeleteIcon} sx={{ padding: "0", width: "20px", height: "20px" }} />
                            </Button>
                        </Tooltip>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center"
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: "center"
                            }}
                            PaperProps={{ style: { background: "none" } }}
                        >
                            <Box
                                sx={{ background: "var(--exxpenses-main-bg-color)", width: "260px", borderRadius: "10px" }}
                                padding="10px"
                                display="flex"
                                flexDirection="column"
                                border="1px var(--exxpenses-main-border-color) solid"
                                textAlign="center"
                            >
                                <Box>
                                    <b>Are you sure?</b>
                                </Box>
                                <Divider sx={{ width: "100%", background: "var(--exxpenses-main-border-color)", marginY: "5px" }} />
                                Deleting this category will also delete all of it&apos;s expenses forever!
                                <Button
                                    className={styles.categoryDeleteConfirmButton}
                                    onClick={async () => {
                                        await categoryDelete({ variables: { category_name: category.name } });
                                        router.reload();
                                    }}
                                >
                                    Delete {category.name}
                                </Button>
                            </Box>
                        </Popover >
                    </Box> */}
                    </Box>
                </Paper>
            </Link>
        </Grid >
    );
}
