import { useMutation } from "@apollo/client";
import { Typography, Button, Stack, Box, Tooltip, Link } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { Category, ExpenseAddDocument } from "../generated/graphql";
import InputField from "./InputField";
import ClearIcon from '@mui/icons-material/Clear';
import DropdownInputField from "./DropdownInputField";
import { currencies } from "../utils/currency";
import { useState } from "react";

export interface AddNewExpenseCardProps {
    category: Category;
    close: () => void;
}

export default function AddNewExpenseCard({ close, category }: AddNewExpenseCardProps) {
    const [expenseAdd] = useMutation(ExpenseAddDocument);
    const router = useRouter();

    const date = new Date().toISOString().slice(0, 10);

    const [dirtyCurrency, setDirtyCurrency] = useState(false);
    let currency_input_changed = (e: string) => {
        setDirtyCurrency(e !== category.default_currency);
    }

    return (
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
                <Typography fontSize="17px">
                    New {category.name}
                </Typography>
                <Tooltip title="Close">
                    <Button onClick={close} sx={{ width: "24px", height: "24px", marginLeft: "auto" }}>
                        <ClearIcon />
                    </Button>
                </Tooltip>
            </Box>
            <Formik
                enableReinitialize
                initialValues={{ category: category.name, price: "", description: "", currency: category.default_currency, date: date, generic: "" }}
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

                    let description = undefined;
                    if (values.description.length > 0)
                        description = values.description;

                    let { data } = await expenseAdd({
                        variables: {
                            addData: {
                                category_name: values.category,
                                price: number_price,
                                description: description,
                                currency: values.currency,
                                date: values.date
                            }
                        }
                    });

                    if (data.expenseAdd.error) {
                        if (data.expenseAdd.error.field === null)
                            actions.setFieldError("generic", data.expenseAdd.error.name);
                        else
                            actions.setFieldError(data.expenseAdd.error.field, data.expenseAdd.error.name);
                    }
                    else {
                        router.reload();
                    }
                }}
            >
                {({ setFieldValue, isSubmitting, errors }) => (
                    <Form>
                        <Stack>
                            <Box>
                                <Box display="flex">
                                    <Field name="price">
                                        {({ field }: FieldProps) => (
                                            <InputField is_error={errors.price !== undefined} bg="var(--exxpenses-second-bg-color)" type="number" field={field} name="price" label="Price" />
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
                                    <ErrorMessage name="price" />
                                    <ErrorMessage name="currency" />
                                </Box>
                            </Box>

                            <Field name="description">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField is_error={errors.description !== undefined} bg="var(--exxpenses-second-bg-color)" field={field} name="description" label="Description" />
                                        <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="description" />
                                        </Box>
                                    </Box>
                                )}
                            </Field>

                            <Field name="date">
                                {({ field }: FieldProps) => (
                                    <Box marginTop="10px">
                                        <InputField is_error={errors.date !== undefined} bg="var(--exxpenses-second-bg-color)" field={field} type="date" name="date" label="Date" />
                                        <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="date" />
                                        </Box>
                                    </Box>
                                )}
                            </Field>
                        </Stack>
                        <Field name="date">
                            {() => (
                                <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                    <ErrorMessage name="generic" />
                                </Box>
                            )}
                        </Field>

                        <Box color="var(--exxpenses-warning-color)" display={dirtyCurrency ? "initial" : "none"}>
                            Expenses with different currencies will not be counted towards the total when using a free plan.
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
    )
}
