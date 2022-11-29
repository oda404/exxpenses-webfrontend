import { ApolloQueryResult, useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import { InferGetServerSidePropsType } from "next";
import InputField from "../components/InputField";
import Navbar from "../components/navbar";
import { CategoriesGetDocument, CategoriesGetQuery, ExpensesTotalCostGetMultipleDocument, ExpensesTotalCostGetMultipleQuery, UserGetDocument, UserGetQuery } from "../generated/graphql";
import apolloClient from "../utils/apollo-client";
import { CategoryAddDocument, ExpenseAddDocument } from "../generated/graphql";
import "../styles/Dashboard.module.css"
import { useState } from "react";
import TabHeaderButton, { CategoryHeaderButton } from "../components/TabHeaderButton";
import DashboardCategoriesTab from "../components/DashboardCategoriesTab";
import CategoryTab from "../components/CategoryTab";
import { Box, Stack, Button, Divider, Autocomplete, Paper, Typography, Tooltip } from "@mui/material";
import styles from "../styles/Dashboard.module.css"
import { Category } from "../generated/graphql";
import { useRouter } from "next/router";
import Stats from "../components/Stats";
import ClearIcon from '@mui/icons-material/Clear';

function AddNewCategoryCard() {

    const [categoryAdd] = useMutation(CategoryAddDocument);
    const router = useRouter();

    return (
        <Box width="200px" display="flex" flexDirection="column" padding="12px" border="1px #444444 solid" sx={{ borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" }}>
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
                                        <InputField field={field} name="default_curr" label="Default currency" />
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
}

function AddNewExpenseCard({ default_category, focusCategory, categories }: AddNewExpenseCardProps) {

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
            width="200px"
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
                                        <InputField field={field} name="description" label="Description (optional)" />
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

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Dashboard({ ssr }: DashboardProps) {

    const [tabs, setTabs] = useState<string[]>([]);

    const [dashboardActiveTab, setDashboardActiveTab] = useState<string | null>("Overview");
    const [categoryActiveTab, setCategoryActiveTab] = useState<string | null>(null);

    const setDashboardTab = (name: string | null) => {
        setCategoryActiveTab(null);
        setDashboardActiveTab(name);
    }

    const setCategoryTab = (name: string) => {
        setDashboardTab(null);
        setCategoryActiveTab(name);
    }

    const n = (tabname: string) => {
        for (let i = 0; i < tabs.length; ++i) {
            if (tabs[i] === tabname) {
                setCategoryTab(tabname);
                return;
            }
        }
        setTabs([...tabs, tabname])
        setCategoryTab(tabname)
    }

    const d = (tabname: string) => {
        const tabIdx = tabs.findIndex(t => t === tabname);
        if (tabIdx === -1)
            return;

        setDashboardTab("Overview")
        tabs.splice(tabIdx, 1);
        setTabs((t) => [...tabs]);
    }

    const [focusedCategory, setFocusedCategory] = useState<string | undefined>("");

    let activeTab: any;
    if (categoryActiveTab === null) {
        switch (dashboardActiveTab) {
            case "Overview":
                activeTab = (
                    <Box>
                        <Stats totalCosts={ssr.expensesTotalCost.costs} categories={ssr.categoriesGet.categories as Category[]} />
                        <DashboardCategoriesTab focusCategory={setFocusedCategory} totalCosts={ssr.expensesTotalCost.costs} categories={ssr.categoriesGet.categories as Category[]} newTab={n} />
                    </Box>
                );
                break;
            default:
                activeTab = null;
        }
    }
    else {
        activeTab = <CategoryTab name={categoryActiveTab} default_currency={ssr.categoriesGet.categories?.find(c => c.name === categoryActiveTab)!.default_currency!} />;
    }

    const user = ssr.userGet.user!;

    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)">
            <Navbar username={user.name} />

            <Box marginTop="30px" display="flex" flexDirection="row" sx={{ paddingX: "40px" }}>
                <Box display="flex" flexDirection="column" width="fit-content">
                    <Typography variant="h5">
                        Add a new entry
                    </Typography>
                    <Divider sx={{ width: "100%", background: "#444444", marginBottom: "12px", marginTop: "4px", color: "white" }} />
                    <AddNewCategoryCard />
                    <Box mb="20px" />
                    <AddNewExpenseCard
                        default_category={focusedCategory}
                        focusCategory={setFocusedCategory}
                        categories={ssr.categoriesGet.categories}
                    />
                </Box>
                <Box display="flex" flexDirection="column" width="100%" marginLeft="40px">
                    <Box display="flex">
                        <TabHeaderButton active={dashboardActiveTab === "Overview"} name="Overview" setActive={setDashboardTab} />
                        <TabHeaderButton active={dashboardActiveTab === "Statistics"} name="Statistics" setActive={setDashboardTab} />
                        <Box ml="auto" />
                        {tabs.map((m, idx) =>
                            <Box display="flex" key={idx}>
                                <Divider orientation="vertical" sx={{ background: "var(--exxpenses-main-border-color)" }} />
                                <CategoryHeaderButton active={categoryActiveTab === m} name={m} setActive={setCategoryTab} remove={d} />
                            </Box>
                        )}
                    </Box>
                    <Divider sx={{ width: "100%", backgroundColor: "var(--exxpenses-main-border-color)" }} />
                    {activeTab}
                </Box>
            </Box>
        </Box>
    );
}

export async function getServerSideProps({ req }: any) {
    const user_resp: ApolloQueryResult<UserGetQuery> = await apolloClient.query({
        query: UserGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    if (user_resp.data.userGet.user === undefined || user_resp.data.userGet.user === null) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            },
            props: {}
        }
    }

    const category_resp: ApolloQueryResult<CategoriesGetQuery> = await apolloClient.query({
        query: CategoriesGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses_total_cost_resp: ApolloQueryResult<ExpensesTotalCostGetMultipleQuery
    > = await apolloClient.query({
        query: ExpensesTotalCostGetMultipleDocument,
        variables: {
            getData: {
                category_names: category_resp.data.categoriesGet?.categories?.map(c => c.name),
                since: since,
            }
        },
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    return {
        props: {
            ssr: {
                userGet: user_resp.data.userGet,
                categoriesGet: category_resp.data.categoriesGet,
                expensesTotalCost: expenses_total_cost_resp.data.expensesTotalCostGetMultiple
            }
        }
    }
}

