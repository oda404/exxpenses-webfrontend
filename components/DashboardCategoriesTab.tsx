import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Divider, Popover, Stack, Grid, Paper, Typography, Backdrop, Autocomplete } from "@mui/material";
import { useRouter } from "next/router";
import { Category, CategoryAddDocument, CategoryDeleteDocument, ExpenseAddDocument, ExpenseTotalCostMultiple, UserUpdatePreferredCurrencyDocument } from "../generated/graphql";
import { NewTabCallback } from "../utils/types";
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import InputField from "./InputField";
import ClearIcon from '@mui/icons-material/Clear';
import Stats from "./Stats";
import useMobileDetect from "../utils/useMobileDetect";
import useShowMobileView from "../utils/useShowMobileView";

interface AddNewCategoryCardProps {
    isMobileView: boolean;
}

function AddNewCategoryCard({ isMobileView }: AddNewCategoryCardProps) {

    const [categoryAdd] = useMutation(CategoryAddDocument);
    const router = useRouter();

    return (
        <Box width={isMobileView ? "auto" : "160px"} height="fit-content" display="flex" flexDirection="column" padding="12px" border="1px #444444 solid" sx={{ borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" }}>
            <Typography marginBottom="5px" marginLeft="6px">
                New category
            </Typography>
            <Formik
                initialValues={{ name: "", default_curr: "" }}
                onSubmit={async ({ name, default_curr }, actions) => {

                    if (!name || name.length === 0) {
                        actions.setFieldError("name", "The category name is required!")
                        return;
                    }
                    else if (name.length > 30) {
                        actions.setFieldError("name", "The category name can't be longer than 30 characters!");
                        return;
                    }

                    if (!default_curr || default_curr.length === 0) {
                        actions.setFieldError("default_curr", "The category's default currency is required!");
                        return;
                    }

                    const { data } = await categoryAdd({ variables: { addData: { name: name, default_currency: default_curr } } });
                    if (data.categoryAdd.error !== null) {
                        actions.setFieldError(data.categoryAdd.error.field, data.categoryAdd.error.name);
                        return;
                    }

                    router.reload();
                }}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <Stack>
                            <Field name="name">
                                {({ field, form }: FieldProps) => (
                                    <Box marginTop="12px">
                                        <InputField field={field} name="name" label="Name" />
                                        <ErrorMessage name="name" component="div" />
                                    </Box>
                                )}
                            </Field>

                            <Field name="default_curr">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField field={field} name="default_curr" label="Currency" />
                                        <ErrorMessage name="default_curr" component="div" />
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
        </Box>
    )
}

interface AddNewExpenseCardProps {
    categories?: Partial<Category>[] | null;
    default_category?: string | null;
    focusCategory: (category: string | undefined) => void;
    isMobileView?: boolean;
}

function AddNewExpenseCard({ isMobileView, default_category, focusCategory, categories }: AddNewExpenseCardProps) {

    const [expenseAdd] = useMutation(ExpenseAddDocument);

    const date = new Date().toISOString().slice(0, 10);

    let found = categories?.find(e => e.name === default_category);
    const currency = found === undefined ? "" : found.default_currency;

    let allCategories = categories?.map(c => {
        return c.name
    });

    if (allCategories === undefined)
        allCategories = [];

    return (
        <Box
            width={isMobileView ? "auto" : "160px"}
            display="flex"
            flexDirection="column"
            padding="12px"
            border="1px #444444 solid"
            key={default_category}
            sx={{
                animation: default_category !== undefined ? `${styles.blink} .5s linear` : "", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
            }}>
            <Box marginBottom="5px" display="flex">
                <Typography fontSize="17px" marginLeft="6px">
                    New expense
                </Typography>
                <Tooltip title="Clear">
                    <Button sx={{ width: "24px", height: "24px", marginLeft: "auto" }}>
                        <ClearIcon />
                    </Button>
                </Tooltip>
            </Box>
            <Formik
                enableReinitialize
                initialValues={{ category: default_category, price: "", description: "", currency: currency, date: date }}
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
                        actions.resetForm();
                    }
                }}
            >
                {({ setFieldValue, isSubmitting, errors }) => (
                    <Form>
                        <Stack>
                            <Field name="category">
                                {({ field }: FieldProps) => (
                                    <Box>
                                        <Autocomplete
                                            sx={{
                                                marginTop: "12px",
                                            }}
                                            id="combo-box-demo"
                                            options={allCategories as (string | undefined)[]}
                                            PaperComponent={({ children }) => (
                                                <Paper className={styles.categoryAutocompleteDropdown}>
                                                    {children}
                                                </Paper>
                                            )}
                                            value={default_category === "" ? null : default_category}
                                            defaultChecked={false}
                                            includeInputInList
                                            onChange={
                                                (e, value) => {
                                                    setFieldValue("category", value)

                                                    default_category = value;

                                                    let found = categories?.find(e => e.name === value);
                                                    setFieldValue("currency", found === undefined ? undefined : found.default_currency);

                                                    focusCategory(value as string | undefined);
                                                }
                                            }
                                            onInput={(e) => { setFieldValue("category", (e.target as any).value); default_category = (e.target as any).value; }}
                                            renderInput={(params) => <div ref={params.InputProps.ref}
                                            >
                                                <InputField name="category" label="Category" field={field} params={params.inputProps} />
                                            </div>}
                                        />
                                        <ErrorMessage name="category" component="div" />
                                    </Box>
                                )}
                            </Field>

                            <Field name="price">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField type="number" field={field} name="price" label="Price" />
                                        <ErrorMessage name="price" component="div" />
                                    </Box>
                                )}
                            </Field>

                            <Field name="description">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField field={field} name="description" label="Description" />
                                        <ErrorMessage name="description" component="div" />
                                    </Box>
                                )}
                            </Field>

                            <Field name="currency">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField field={field} name="currency" label="Currency" />
                                        <ErrorMessage name="currency" component="div" />
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
    name: string;
    default_currency: string;
    newTab: NewTabCallback;
    key: number;
    totalCost?: ExpenseTotalCostMultiple;
    focusCategory: (category: string) => void;
    isMobileView: boolean;
}

function CategoryBox({ isMobileView, focusCategory, totalCost, name, newTab }: CategoryBoxProps) {

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [categoryDelete] = useMutation(CategoryDeleteDocument);
    const router = useRouter();

    let monthly: any;
    if (totalCost?.total?.length > 0) {
        monthly = (
            <Box>
                {totalCost?.total[0].price} {totalCost?.total[0].currency}
            </Box>
        );
    }
    else {
        monthly = (
            <Box>
                Nothing
            </Box>
        );
    }

    return (
        <Grid item width={isMobileView ? "100%" : "auto"}>
            <Paper className={styles.categoryBox} sx={{ width: isMobileView ? "auto" : "150px" }}>
                <Box display="flex">
                    <Box>
                        <Box sx={{ overflowX: "hidden" }} display="flex">
                            <ClassIcon sx={{ width: "22px", height: "22px" }} />
                            <Box sx={{ textTransform: "none", marginLeft: "10px", fontSize: "14px" }}><b>{name}</b></Box>
                        </Box>

                        <Box
                            marginLeft="4px"
                            marginTop="4px"
                            maxHeight="70px"
                            fontSize="14px"
                        >
                            <Box>This month:</Box>
                        </Box>
                        <Box className={styles.categoryTotalCostBox}>
                            {monthly}
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        marginLeft="auto"
                        sx={{ backgroundColor: "var(--exxpenses-main-bg-color)" }}
                    >
                        <Tooltip title="New expense" placement="top" arrow>
                            <Button
                                className={stylesNew.categoryActionButton}
                                onClick={() => {
                                    focusCategory(name);
                                }}
                            >
                                <AddIcon sx={{ padding: "0", width: "20px", height: "20px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Details" arrow>
                            <Button
                                onClick={() => {
                                    newTab(name);
                                }}
                                className={stylesNew.categoryActionButton}
                            >
                                <ShowChartIcon sx={{ fill: "var(--exxpenses-light-green)", padding: "0", width: "20px", height: "20px" }} />
                            </Button>
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
                                        await categoryDelete({ variables: { category_name: name } });
                                        router.reload();
                                    }}
                                >
                                    Delete {name}
                                </Button>
                            </Box>
                        </Popover >
                    </Box>
                </Box>
            </Paper>
        </Grid >
    );
}

interface DashboardCategoriesTabProps {
    categories: Category[];
    newTab: NewTabCallback;
    totalCosts?: ExpenseTotalCostMultiple[] | null;
    focusCategory: (cat: string | undefined) => void;
    focusedCategory: string | undefined;
    preferred_currency: string | null;
}

function DashboardMobileView({ preferred_currency, focusedCategory, focusCategory, totalCosts, categories, newTab }: DashboardCategoriesTabProps) {
    return (
        <Grid container display="flex">
            <Grid width="100%" item>
                <Stats
                    totalCosts={totalCosts}
                    categories={categories}
                />

                <Box marginTop="20px">
                    <Typography style={{ fontSize: "18px", marginBottom: "10px" }}>
                        Your categories
                    </Typography>
                    <Grid container spacing={3}>
                        {categories.map((cat, idx) =>
                            <CategoryBox
                                isMobileView={true}
                                focusCategory={focusCategory}
                                key={idx}
                                newTab={newTab}
                                default_currency={cat.default_currency}
                                name={cat.name}
                                totalCost={totalCosts?.find(c => c.category_name === cat.name)}
                            />
                        )}
                    </Grid>
                </Box>
            </Grid>
            <Box width="100%" marginTop="30px">
                <Typography variant="h6">
                    Add a new entry
                </Typography>
            </Box>
            <Grid item width="100%" marginTop="15px">
                <Box display="flex" flexDirection="row">
                    <AddNewExpenseCard
                        default_category={focusedCategory}
                        focusCategory={focusCategory}
                        categories={categories}
                        isMobileView={true}

                    />
                    <Box mr="10px" ml="10px" />
                    <AddNewCategoryCard isMobileView={true} />
                </Box>
            </Grid>
        </Grid >
    )
}

function DashboardFullView({ preferred_currency, focusedCategory, focusCategory, totalCosts, categories, newTab }: DashboardCategoriesTabProps) {
    return (
        <Box display="flex">

            <Box marginTop="20px">
                <Box display="flex" flexDirection="column" width="fit-content" marginRight="40px">
                    <AddNewCategoryCard isMobileView={false} />
                    <Box mb="20px" />
                    <AddNewExpenseCard
                        default_category={focusedCategory}
                        focusCategory={focusCategory}
                        categories={categories}
                    />
                </Box>
            </Box>

            <Box width="100%">
                <Stats
                    totalCosts={totalCosts}
                    categories={categories}
                />

                <Box width="100%" marginTop="20px">
                    <Typography variant="h6" style={{ marginBottom: "10px" }}>
                        Your categories
                    </Typography>
                    <Grid width="100%" container spacing={3}>
                        {categories.map((cat, idx) =>
                            <CategoryBox
                                isMobileView={false}
                                focusCategory={focusCategory}
                                key={idx}
                                newTab={newTab}
                                default_currency={cat.default_currency}
                                name={cat.name}
                                totalCost={totalCosts?.find(c => c.category_name === cat.name)}
                            />
                        )}
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default function DashboardCategoriesTab(props: DashboardCategoriesTabProps) {

    let content: any;

    const mobileView = useShowMobileView();

    // XSS vulnerability ? i dont think so....
    if (mobileView)
        content = <DashboardMobileView {...props} />
    else
        content = <DashboardFullView {...props} />

    return (
        <Box sx={{ overflowY: "auto" }} padding="10px" display="flex" flexDirection="column">
            <Box className={styles.categoriesBox}>
                {content}
            </Box>
        </Box >
    )
}
