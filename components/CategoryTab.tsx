import { useMutation, useQuery } from "@apollo/client";
import { Field, Form, Formik, FieldProps } from "formik";
import { useRouter } from "next/router";
import { BiEdit, BiTrash } from "react-icons/bi";
import { ExpenseDeleteDocument, ExpenseEditDocument, ExpensesGetDocument } from "../generated/graphql";
import InputField from "./InputField";
import { IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import styles from "../styles/CategoryTab.module.css"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface ExpenseEditProps {
    category_name: string;
    id: string;
    init_price: number;
    init_currency: string;
    init_date: Date;
}

interface CategoryTabExpenseProps {
    category_name: string;
    expense: {
        id: string,
        price: number,
        currency: string,
        date: Date
    }
}

function CategoryTabExpense({ category_name, expense: { id, price, currency, date } }: CategoryTabExpenseProps) {

    const [expenseDelete] = useMutation(ExpenseDeleteDocument);
    const router = useRouter();
    const dateobj = new Date(date);

    return (
        <Box
            padding="6px"
            borderRadius="6px"
            display="flex"
            width="fit-content"
            marginLeft="5px"
        >
            <Box marginRight="10px">
                <RemoveCircleIcon />
            </Box>
            <Box>
                <b>{price}&nbsp;{currency}</b>
            </Box>
        </Box>
    )
}

interface CategoryTabProps {
    name: string;
    default_currency: string;
}

export default function CategoryTab({ name, default_currency }: CategoryTabProps) {

    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data, loading } = useQuery(ExpensesGetDocument, {
        variables: {
            getData: {
                category_name: name,
                since: since
            }
        }
    });

    if (loading)
        return null;

    let content: JSX.Element;
    if (data?.expensesGet.expenses === null || data?.expensesGet.expenses.length === 0) {
        content = (
            <Box>
                No expenses yet...
            </Box>
        )
    }
    else {

        var dates = [];
        for (let d = since; d <= now; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        dates.reverse();

        content = (
            <Stack spacing={1}>
                {dates.map((d: Date, idx: number) => {

                    let datestr = d.toDateString();

                    let found = data.expensesGet.expenses.findIndex((e: any) => new Date(e.date).toDateString() == datestr);
                    if (found === -1)
                        return;

                    return (
                        <Box key={idx}>
                            <Typography sx={{ color: "#9f9f9f" }}>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</Typography>
                            {data.expensesGet.expenses.map((e: any, idx2: number) => {
                                if (new Date(e.date).toDateString() == datestr)
                                    return <CategoryTabExpense key={idx2} category_name={name} expense={{ id: e.id, price: e.price, currency: e.currency, date: e.date }} />

                                return <Box key={idx2}></Box>
                            })}
                        </Box>
                    );
                })}
            </Stack>
        );
    }

    return (
        <Box p="14px">
            <Box display="flex">
                <Typography variant="h4" marginBottom="10px">{name}</Typography>
                <Box marginTop="15px" marginLeft="10px">{default_currency}</Box>
                <Button
                    sx={{ padding: "0px", margin: "0px", display: "inline-block", minHeight: "0", minWidth: "0" }}
                >
                    <ModeEditIcon sx={{ marginTop: "8px", marginLeft: "20px" }} />
                </Button>
            </Box>

            <Box sx={{ maxHeight: "80%", overflowY: "auto" }}>
                {content}
            </Box>
        </Box >
    )
}
