import { useMutation } from "@apollo/client";
import { Box, Button, Stack, Grid, Paper, Typography, Autocomplete, Modal } from "@mui/material";
import { useRouter } from "next/router";
import { Category, CategoryAddDocument, ExpenseAddDocument, User } from "../generated/graphql";
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
import MobileViewNavigationBar from "./MobileViewNavigationBar";
import Sidenav from "./Sidenav";
import Topbar from "./Topbar";
import NewsTab from "./NewsTab";

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
                    color: "var(--exxpenses-lighter-green)",
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
                <Box
                    width={"auto"}
                    height="fit-content"
                    display="flex"
                    flexDirection="column"
                    paddingY="2px"
                    border={"none"}
                    sx={{ borderRadius: "5px" }}
                >
                    <Box display="flex">
                        <Box sx={{ fontSize: "14px", color: "var(--exxpenses-lighter-green)" }} marginLeft="6px">
                            + New category
                        </Box>
                        <Button onClick={() => setShowAddCategory(false)} sx={{ width: "20px", height: "20px", marginLeft: "auto" }}>
                            <ClearIcon sx={{ width: "20px", height: "20px" }} />
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
                                            <Box width="75%" marginTop="12px">
                                                <InputField bg="var(--exxpenses-second-bg-color)" field={field} name="name" label="Name" />
                                                <ErrorMessage name="name" component="div" />
                                            </Box>
                                        )}
                                    </Field>
                                    <Box marginX="10px" />
                                    <Field name="default_curr">
                                        {({ field }: FieldProps) => (
                                            <Box width="25%" marginTop="10px">
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
            <Stats
                preferred_currency={preferred_currency!}
                expensesMultipleCategories={expensesMultipleCategories}
                categories={categories}
                isMobileView={true}
            />

            <MobileViewDashboardButtons default_currency={preferred_currency!} />

            <Box marginTop="15px">
                <Box style={{ fontSize: ".875rem", marginBottom: "10px" }}>
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
            <Box padding="10px" paddingTop="40px" justifyContent="center" display="flex" flexDirection="column">
                <MobileViewNavigationBar />
                <Box marginY='5px' />
                <CardBox>
                    <DashboardFullView {...props} />
                </CardBox>
            </Box>
        )
    else
        content = (
            <Box padding="20px" paddingY="40px" justifyContent="center" display="flex">
                <Sidenav firstname={props.user.firstname} lastname={props.user.lastname} />
                <CardBox width="540px">
                    <DashboardFullView {...props} />
                </CardBox>
                <Box marginX="10px" />
                <NewsTab user={props.user} />
            </Box>
        )

    return (
        <Box>
            <Topbar />
            {content}
        </Box>
    )
}
