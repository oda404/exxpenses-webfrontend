import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Divider, Popover, Stack, Grid, Paper, Typography, Backdrop } from "@mui/material";
import { useRouter } from "next/router";
import { Category, CategoryDeleteDocument, ExpenseTotalCostMultiple, UserUpdatePreferredCurrencyDocument } from "../generated/graphql";
import { NewTabCallback } from "../utils/types";
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import InputField from "./InputField";
import { CategoryAddDocument } from "../generated/graphql";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

interface NumberBubbleProps {
    number: string;
}

function NumberBubble({ grayed_out, number }: NumberBubbleProps) {
    return (
        <Box
            width="40px"
            height="40px"
            sx={{ background: "var(--exxpenses-main-bg-color)", borderRadius: "25px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginBottom="10px"
            position="relative"
        >
            <Box fontSize="24px" color="#888888">
                {number}
            </Box>
        </Box>
    )
}

interface CategoryBoxProps {
    name: string;
    default_currency: string;
    newTab: NewTabCallback;
    key: number;
    totalCost?: ExpenseTotalCostMultiple;
    focusCategory: (category: string) => void;
}

function CategoryBox({ focusCategory, totalCost, name, newTab }: CategoryBoxProps) {

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
        <Grid item>
            <Paper className={styles.categoryBox}>
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
                        marginLeft="30px"
                        sx={{ backgroundColor: "var(--exxpenses-main-bg-color)" }}
                    >
                        <Tooltip title="New expense" placement="top" arrow>
                            <Button
                                className={stylesNew.categoryActionButton}
                                onClick={() => {
                                    focusCategory(name);
                                }}
                            >
                                <AddIcon sx={{ padding: "0", width: "22px", height: "22px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Details" arrow>
                            <Button
                                onClick={() => {
                                    newTab(name);
                                }}
                                className={stylesNew.categoryActionButton}
                            >
                                <ShowChartIcon sx={{ fill: "var(--exxpenses-light-green)", padding: "0", width: "22px", height: "22px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                            <Button
                                aria-describedby={id}
                                onClick={(e) => handleClick(e)}
                                className={stylesNew.categoryActionButton}
                            >
                                <DeleteIcon className={styles.categoryDeleteIcon} sx={{ padding: "0", width: "22px", height: "22px" }} />
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

interface ConfigurePreferredCurrencyCardProps {
    grayed_out: boolean;
    preferred_currency: string;
}

function ConfigurePreferredCurrencyCard({ preferred_currency, grayed_out }: ConfigurePreferredCurrencyCardProps) {

    const router = useRouter();
    const [updatePreferredCurrency] = useMutation(UserUpdatePreferredCurrencyDocument);

    return (
        <Box marginRight="30px" display="flex" flexDirection="column" alignItems="center">
            <NumberBubble number="1" />
            <Box position="relative" sx={{ padding: "14px", borderRadius: "4px" }} border="1px solid var(--exxpenses-main-border-color)" maxWidth="270px">
                <Box marginBottom="8px" fontSize="15px">
                    {grayed_out ?
                        <b>
                            Preferred currency
                        </b> :
                        <b>
                            Tell us your preferred currency
                        </b>
                    }
                </Box>
                <Box marginBottom="24px" fontSize="15px">
                    {grayed_out ?
                        <Box>
                            You can always change this setting in your user preference panel.
                        </Box> :
                        <Box>
                            This currency will be used as the default for every category you create.
                        </Box>
                    }
                </Box>

                <Formik
                    initialValues={{ currency: preferred_currency }}
                    onSubmit={async ({ currency }, actions) => {

                        if (!currency || currency.length === 0) {
                            actions.setFieldError("currency", "The category's default currency is required!");
                            return;
                        }

                        const { data } = await updatePreferredCurrency({ variables: { preferred_currency: currency } });
                        // FIXME: error handling

                        router.reload();
                    }}
                >
                    {({ isSubmitting, errors }) => (
                        <Form>
                            <Box>
                                <Field name="currency">
                                    {({ field, form }: FieldProps) => (
                                        <Box marginTop="12px">
                                            <InputField field={field} name="currency" label="Currency" />
                                            <ErrorMessage name="currency" component="div" />
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={styles.dashboardSubmitButton}
                            >
                                {grayed_out ?
                                    <CheckRoundedIcon /> :
                                    <Box>
                                        Set
                                    </Box>
                                }
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Backdrop
                    sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)" }}
                    open={grayed_out}
                />
            </Box>
        </Box>
    )
}

interface AddFirstCategoryCardProps {
    grayed_out: boolean;
    preferred_currency: string;
}

function AddFirstCategoryCard({ preferred_currency, grayed_out }: AddFirstCategoryCardProps) {

    const router = useRouter();
    const [categoryAdd] = useMutation(CategoryAddDocument);

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <NumberBubble number="2" />
            <Box position="relative" sx={{ padding: "14px", borderRadius: "4px" }} border="1px solid var(--exxpenses-main-border-color)" maxWidth="270px">
                <Box marginBottom="8px" fontSize="15px">
                    <b>
                        Create your first category
                    </b>
                </Box>
                <Box marginBottom="12px" fontSize="15px">
                    Kickstart your exxpenses account by creating your first expense category!
                </Box>

                <Formik
                    initialValues={{ name: "", default_curr: preferred_currency }}
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
                                            <InputField field={field} name="name" label="Name" />
                                            <ErrorMessage name="name" component="div" />
                                        </Box>
                                    )}
                                </Field>
                                <Box marginLeft="5px" marginRight="5px" />
                                <Field name="default_curr">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="10px">
                                            <InputField field={field} name="default_curr" label="Currency" />
                                            <ErrorMessage name="default_curr" component="div" />
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className={styles.dashboardSubmitButton}
                            >
                                Add
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Backdrop
                    sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)" }}
                    open={grayed_out}
                />
            </Box>
        </Box>
    )
}

interface DashboardCategoriesTabProps {
    categories: Category[];
    newTab: NewTabCallback;
    totalCosts?: ExpenseTotalCostMultiple[] | null;
    focusCategory: (cat: string) => void;
    preferred_currency: string | null;
}

export default function DashboardCategoriesTab({ preferred_currency, focusCategory, totalCosts, categories, newTab }: DashboardCategoriesTabProps) {

    let content: any;

    if (categories.length > 0) {
        content = (
            <>
                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                    Your categories
                </Typography>
                <Grid container spacing={3}>
                    {categories.map((cat, idx) =>
                        <CategoryBox
                            focusCategory={focusCategory}
                            key={idx}
                            newTab={newTab}
                            default_currency={cat.default_currency}
                            name={cat.name}
                            totalCost={totalCosts?.find(c => c.category_name === cat.name)}
                        />
                    )}
                </Grid>
            </>
        );
    }
    else {
        content = (
            <Box>
                <Box fontSize="18px" marginBottom="10px">
                    <b>Setup your Exxpenses account</b>
                </Box>
                <Box display="flex">
                    <ConfigurePreferredCurrencyCard
                        preferred_currency={preferred_currency ? preferred_currency : ""}
                        grayed_out={preferred_currency !== null}
                    />
                    <AddFirstCategoryCard
                        preferred_currency={preferred_currency ? preferred_currency : ""}
                        grayed_out={preferred_currency === null}
                    />
                </Box>
            </Box>
        )
    }

    return (
        <Box maxHeight="90%" height="90%" sx={{ overflowY: "auto" }} padding="10px" display="flex" flexDirection="column">

            <Box className={styles.categoriesBox}>
                {content}
            </Box>
        </Box >
    )
}
