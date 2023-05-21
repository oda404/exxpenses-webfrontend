import { useMutation } from "@apollo/client";
import { Box, Button, Grid, Link, Modal, Stack, Tooltip, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Category, CategoryAddDocument, User } from "../generated/graphql";
import { useState } from "react";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import InputField from "./InputField";
import ClearIcon from '@mui/icons-material/Clear';
import useShowMobileView from "../utils/useShowMobileView";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryBox from "./CategoryBox";
import Stats from "./Stats";
import CardBox from "./CardBox";
import MobileViewNavigationBar from "./MobileViewNavigationBar";
import Sidenav from "./Sidenav";
import Topbar from "./Topbar";
import NewsTab from "./NewsTab";
import DropdownInputField from "./DropdownInputField";
import { currencies } from "../utils/currency";
import Footer from "./Footer";

interface MobileViewDashboardButtonsProps {
    default_currency: string;
}

function AddNewCategoryButton({ default_currency }: MobileViewDashboardButtonsProps) {

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryAdd] = useMutation(CategoryAddDocument);
    const router = useRouter();

    const [dirtyCurrency, setDirtyCurrency] = useState(false);
    let currency_input_changed = (e: string) => {
        setDirtyCurrency(e !== default_currency);
    }

    return (
        <Box marginTop="10px">
            <Button
                sx={{
                    width: "100% !important"
                }}
                className="fullButton"
                onClick={() => setShowAddCategory(true)}
            >
                + New category
            </Button>
            <Modal
                open={showAddCategory}
                onClose={() => { setShowAddCategory(false) }}
                sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center", backdropFilter: "blur(5px)" }}
            >
                <Box
                    width="360px"
                    display="flex"
                    flexDirection="column"
                    height="fit-content"
                    padding="12px"
                    sx={{
                        background: "var(--exxpenses-second-bg-color)", borderRadius: "5px", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
                    }}>
                    <Box marginBottom="15px" display="flex">
                        <Typography fontSize="16px">
                            New category
                        </Typography>
                        <Tooltip title="Close">
                            <Button onClick={() => setShowAddCategory(false)} sx={{ width: "24px", height: "24px", marginLeft: "auto" }}>
                                <ClearIcon />
                            </Button>
                        </Tooltip>
                    </Box>
                    <Formik
                        enableReinitialize
                        initialValues={{ name: "", currency: default_currency, generic: "" }}
                        onSubmit={async ({ name, currency, generic }, actions) => {
                            if (!name || name.length === 0) {
                                actions.setFieldError("name", "The category name is required!")
                                return;
                            }
                            else if (name.length > 30) {
                                actions.setFieldError("name", "The category name can't be longer than 30 characters!");
                                return;
                            }

                            if (!currency || currency.length === 0) {
                                actions.setFieldError("currency", "The category's default currency is required!");
                                return;
                            }

                            const { data } = await categoryAdd({ variables: { addData: { name: name, default_currency: currency } } });
                            if (data.categoryAdd.error !== null) {
                                if (data.categoryAdd.error.field === null) {
                                    actions.setFieldError("generic", data.categoryAdd.error.name);
                                }
                                else {
                                    actions.setFieldError(data.categoryAdd.error.field, data.categoryAdd.error.name);
                                }
                                return;
                            }

                            router.reload();
                        }}
                    >
                        {({ setFieldValue, isSubmitting, errors }) => (
                            <Form>
                                <Stack>
                                    <Box display="flex">
                                        <Field name="name">
                                            {({ field }: FieldProps) => (
                                                <InputField is_error={errors.name !== undefined} bg="var(--exxpenses-second-bg-color)" field={field} name="name" label="Name" />
                                            )}
                                        </Field>
                                        <Box marginLeft="5px" marginRight="5px" />
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
                                                </Box>
                                            )}
                                        </Field>
                                    </Box>
                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                        <ErrorMessage name="name" />
                                        <ErrorMessage name="currency" />
                                    </Box>
                                </Stack>
                                <Field name="generic">
                                    {() => (
                                        <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="generic" />
                                        </Box>
                                    )}
                                </Field>
                                <Box color="var(--exxpenses-warning-color)" display={dirtyCurrency ? "initial" : "none"}>
                                    Categories with different currencies will not count towards the total when using a free plan.
                                    Learn more <Link sx={{ color: "var(--exxpenses-warning-color)" }} href="/plans">here</Link>.
                                </Box>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="fullButton"
                                    sx={{ width: "100% !important", marginTop: "10px" }}
                                >
                                    Add
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Box >
            </Modal>
        </Box>
    )
}

function findExpenses(expenses: MultiCategoryExpenses, name: string) {
    let cat = expenses.categories.find(c => c.name === name);
    return cat!.expenses;
}

interface DashboardCategoriesTabProps {
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
    since: Date,
    until: Date,
    preferred_currency: string | null;
    user: User;
}
function DashboardFullView({ since, until, expensesMultipleCategories, preferred_currency, categories }: DashboardCategoriesTabProps) {

    return (
        <Box>
            <CardBox>
                <Box justifyContent="space-between" display="flex">
                    <Stats
                        preferred_currency={preferred_currency!}
                        expensesMultipleCategories={expensesMultipleCategories}
                        categories={categories}
                    />
                </Box>
            </CardBox>
            <Box marginTop="15px">
                <CardBox>
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
                                since={since}
                                until={until}
                                key={idx}
                            />
                        )}
                    </Grid>
                    <AddNewCategoryButton default_currency={preferred_currency!} />
                </CardBox>
            </Box>
        </Box>
    )
}

export default function DashboardCategoriesTab(props: DashboardCategoriesTabProps) {

    let content: any;

    const mobileView = useShowMobileView();

    // XSS vulnerability ? i dont think so....
    if (mobileView)
        content = (
            <Box minHeight="100vh" padding="10px" paddingTop="40px" display="flex" flexDirection="column">
                <MobileViewNavigationBar />
                <NewsTab user={props.user} banner_mode />
                <Box marginY='5px' />
                <DashboardFullView {...props} />
            </Box>
        )
    else
        content = (
            <Box minHeight="100vh" padding="20px" paddingY="40px" justifyContent="center" display="flex">
                <Sidenav />
                <Box width="540px">
                    <DashboardFullView {...props} />
                </Box>
                <Box marginX="10px" />
                <NewsTab user={props.user} />
            </Box>
        )

    return (
        <Box>
            <Topbar user={props.user} />
            {content}
            <Footer />
        </Box>
    )
}
