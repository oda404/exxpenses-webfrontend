import { useMutation } from "@apollo/client";
import { Box, Button, Stack, Grid, Paper, Typography, Autocomplete, Modal } from "@mui/material";
import { useRouter } from "next/router";
import { Category, CategoryAddDocument, ExpenseAddDocument } from "../generated/graphql";
import { useState } from "react";
import styles from "../styles/Dashboard.module.css";
import Tooltip from '@mui/material/Tooltip';
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import InputField from "./InputField";
import ClearIcon from '@mui/icons-material/Clear';
import useShowMobileView from "../utils/useShowMobileView";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryBox from "./CategoryBox";
import Stats from "./Stats";
import CardBox from "./CardBox";

interface AddNewCategoryCardProps {
    isMobileView: boolean;
}

function AddNewCategoryCard({ isMobileView }: AddNewCategoryCardProps) {

    const [categoryAdd] = useMutation(CategoryAddDocument);
    const router = useRouter();

    let content: any;
    if (isMobileView) {
        content = (
            <>

            </>

        )
    }
    else {
        content = (
            <>
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
            </>
        )
    }

    return (
        <Box
            width={isMobileView ? "auto" : "160px"}
            height="fit-content"
            display="flex"
            flexDirection="column"
            padding={isMobileView ? "6px" : "12px"}
            border={isMobileView ? "none" : "1px #444444 solid"}
            sx={{ borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" }}>
            {content}
        </Box>
    )
}

interface AddNewExpenseCardProps {
    categories?: Partial<Category>[] | null;
    default_category?: string | null;
    focusCategory: (category: string | undefined) => void;
    isMobileView?: boolean;
    width?: string;
}

function AddNewExpenseCard({ width, isMobileView, default_category, focusCategory, categories }: AddNewExpenseCardProps) {

    const [expenseAdd] = useMutation(ExpenseAddDocument);
    const router = useRouter();

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
            width={width !== undefined ? width : isMobileView ? "auto" : "160px"}
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
                        // actions.resetForm();
                        router.reload();
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

interface MobileViewAddNewExpenseCardProps {
    categories?: Partial<Category>[] | null;
    default_category?: string | null;
    close: () => void;
}

function MobileViewAddNewExpenseCard({ close, categories, default_category }: MobileViewAddNewExpenseCardProps) {
    const [expenseAdd] = useMutation(ExpenseAddDocument);
    const router = useRouter();

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
            width={"auto"}
            display="flex"
            flexDirection="column"
            border="1px #444444 solid"
            height="fit-content"
            padding="12px"
            key={default_category}
            sx={{
                background: "var(--exxpenses-main-bg-color)", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
            }}>
            <Box marginBottom="5px" display="flex">
                <Typography fontSize="17px" marginLeft="6px">
                    New {default_category}
                </Typography>
                <Tooltip title="Close">
                    <Button onClick={close} sx={{ width: "24px", height: "24px", marginLeft: "auto" }}>
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

interface MobileViewDashboardButtonsProps {
    default_currency: string;
}

function MobileViewDashboardButtons({ default_currency }: MobileViewDashboardButtonsProps) {

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryAdd] = useMutation(CategoryAddDocument);
    const router = useRouter();

    return (
        <Box>
            <Button
                sx={{
                    color: "var(--exxpenses-light-green)",
                    fontSize: "14px",
                    textTransform: "none",
                    paddingX: "6px",
                    paddingY: "2px",
                    borderRadius: "8px",
                    display: showAddCategory ? "none" : "initial",
                    "&:hover": {
                        background: "var(--exxpenses-main-button-hover-bg-color)"
                    },
                }}
                className={styles.categoryActionButton}
                onClick={() => setShowAddCategory(true)}
            >
                + New category
            </Button>
            <Box display={showAddCategory ? "initial" : "none"}>
                <Box marginTop="10px" />

                <Box
                    width={"auto"}
                    height="fit-content"
                    display="flex"
                    flexDirection="column"
                    padding={"6px"}
                    border={"none"}
                    sx={{ borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" }}
                >
                    <Box display="flex">
                        <Box sx={{ fontSize: "14px", color: "var(--exxpenses-light-green)" }} marginLeft="6px">
                            New category
                        </Box>
                        <Button onClick={() => setShowAddCategory(false)} sx={{ width: "22px", height: "22px", marginLeft: "auto" }}>
                            <ClearIcon sx={{ width: "22px", height: "22px" }} />
                        </Button>
                    </Box>

                    <Formik
                        initialValues={{ name: "", default_curr: default_currency }}
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
                                <Box display="flex">
                                    <Field name="name">
                                        {({ field, form }: FieldProps) => (
                                            <Box marginTop="12px">
                                                <InputField bg="var(--exxpenses-second-bg-color)" field={field} name="name" label="Name" />
                                                <ErrorMessage name="name" component="div" />
                                            </Box>
                                        )}
                                    </Field>
                                    <Box marginX="10px" />
                                    <Field name="default_curr">
                                        {({ field }: FieldProps) => (
                                            <Box marginTop="10px">
                                                <InputField bg="var(--exxpenses-second-bg-color)" field={field} name="default_curr" label="Currency" />
                                                <ErrorMessage name="default_curr" component="div" />
                                            </Box>
                                        )}
                                    </Field>
                                </Box>
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

            </Box>
        </Box>
    )
}

function findExpenses(expenses: MultiCategoryExpenses, name: string) {
    let cat = expenses.categories.find(c => c.name === name);
    return cat!.expenses;
}

interface MobileDashboardNewCategoryProps {
    isOpen: boolean;
    category?: string;
};

function DashboardMobileView({
    preferred_currency,
    expensesMultipleCategories,
    categories,
    since, until
}: DashboardCategoriesTabProps) {

    const [newCategory, setNewCategory] = useState<MobileDashboardNewCategoryProps>({ isOpen: false });

    const focusCategoryActual = (name: string) => {
        const tmp: MobileDashboardNewCategoryProps = {
            isOpen: true,
            category: name
        }

        setNewCategory(tmp);
    }

    return (
        <Box display="flex">
            <Modal
                // sx={{ position: "absolute !important", zIndex: "998", background: "rgba(0, 0, 0, 0.3)" }}
                open={newCategory.isOpen}
                onClose={() => {
                    const tmp: MobileDashboardNewCategoryProps = {
                        isOpen: false,
                    }

                    setNewCategory(tmp);
                }}
                sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center" }}
            >
                <Box>
                    <MobileViewAddNewExpenseCard
                        close={() => {
                            const tmp: MobileDashboardNewCategoryProps = {
                                isOpen: false,
                            }

                            setNewCategory(tmp);
                        }}
                        default_category={newCategory.category}
                        categories={categories}
                    />
                </Box>
            </Modal>
            <Box width="100%">
                <Stats
                    preferred_currency={preferred_currency!}
                    expensesMultipleCategories={expensesMultipleCategories}
                    categories={categories}
                    isMobileView={true}
                />

                <MobileViewDashboardButtons default_currency={preferred_currency!} />

                <Box marginTop="15px">
                    <Box style={{ fontSize: "16px", marginBottom: "10px" }}>
                        Categories
                    </Box>
                    <Grid container spacing={2}>
                        {categories.map((cat, idx) =>
                            <CategoryBox
                                category={cat}
                                expenses={findExpenses(expensesMultipleCategories, cat.name)}
                                preferred_currency={preferred_currency!}
                                isMobileView={true}
                                focusCategory={focusCategoryActual}
                                since={since}
                                until={until}
                                key={idx}
                            />
                        )}
                    </Grid>
                </Box>
            </Box>
        </Box >
    )
}

interface DashboardCategoriesTabProps {
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
    since: Date,
    until: Date,
    focusCategory: (cat: string | undefined) => void;
    focusedCategory: string | undefined;
    preferred_currency: string | null;
}

function DashboardFullView({ since, until, expensesMultipleCategories, preferred_currency, focusedCategory, focusCategory, categories }: DashboardCategoriesTabProps) {

    const [newCategory, setNewCategory] = useState<MobileDashboardNewCategoryProps>({ isOpen: false });

    const focusCategoryActual = (name: string) => {
        const tmp: MobileDashboardNewCategoryProps = {
            isOpen: true,
            category: name
        }

        setNewCategory(tmp);
    }

    return (
        <Box display="flex">
            <Modal
                // sx={{ position: "absolute !important", zIndex: "998", background: "rgba(0, 0, 0, 0.3)" }}
                open={newCategory.isOpen}
                onClose={() => {
                    const tmp: MobileDashboardNewCategoryProps = {
                        isOpen: false,
                    }

                    setNewCategory(tmp);
                }}
                sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center" }}
            >
                <Box>
                    <MobileViewAddNewExpenseCard
                        close={() => {
                            const tmp: MobileDashboardNewCategoryProps = {
                                isOpen: false,
                            }

                            setNewCategory(tmp);
                        }}
                        default_category={newCategory.category}
                        categories={categories}
                    />
                </Box>
            </Modal>
            <Box marginX="auto" maxWidth="650px">
                <Stats
                    preferred_currency={preferred_currency!}
                    expensesMultipleCategories={expensesMultipleCategories}
                    categories={categories}
                    isMobileView={true}
                />

                <MobileViewDashboardButtons default_currency={preferred_currency!} />

                <Box maxWidth="650px" marginTop="15px">
                    <Box style={{ fontSize: "16px", marginBottom: "10px" }}>
                        Categories
                    </Box>
                    <Grid container spacing={2}>
                        {categories.map((cat, idx) =>
                            <CategoryBox
                                category={cat}
                                expenses={findExpenses(expensesMultipleCategories, cat.name)}
                                preferred_currency={preferred_currency!}
                                isMobileView={true}
                                focusCategory={focusCategoryActual}
                                since={since}
                                until={until}
                                key={idx}
                            />
                        )}
                    </Grid>
                </Box>
            </Box>
        </Box >
    )
}

export default function DashboardCategoriesTab(props: DashboardCategoriesTabProps) {

    let content: any;

    const mobileView = useShowMobileView();

    // totalCostsKeepCurrency(props.totalCosts, props.categories);

    // XSS vulnerability ? i dont think so....
    if (mobileView)
        content = <DashboardMobileView {...props} />;
    else
        content = <DashboardFullView {...props} />;

    return (
        <Box>
            <Box justifyContent="center" display="flex">
                <CardBox width="fit-content">
                    {content}
                </CardBox>
            </Box>

        </Box>
    )
}
