import { Box, Stack, Typography } from "@mui/material";
import { Expense } from "../generated/graphql";
import CategoryTabExpense from "./CategoryTabExpense";

interface FullViewCategoryExpensesTabProps {
    expenses: Expense[];
    category: Category;
    since: Date;
    until: Date;
}

export default function FullViewCategoryExpensesTab({ category, expenses, since, until }: FullViewCategoryExpensesTabProps) {
    let content: any;

    if (expenses.length === 0) {
        content = (
            <Box>
                No expenses yet...
            </Box>
        )
    }
    else {

        var dates = [];
        for (let d = new Date(since); d <= until; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }
        dates.reverse();

        content = (
            <Stack spacing={1}>
                {dates.map((d: Date, idx: number) => {

                    let datestr = d.toDateString();

                    let found = expenses.findIndex((e: any) => new Date(e.date).toDateString() == datestr);
                    if (found === -1)
                        return;

                    return (
                        <Box key={idx}>
                            <Typography sx={{ fontSize: "14px", color: "#9f9f9f" }}>{d.getDate()}.{d.getMonth() + 1}.{d.getFullYear()}</Typography>
                            {expenses.map((e: any, idx2: number) => {
                                if (new Date(e.date).toDateString() == datestr)
                                    return <CategoryTabExpense key={idx2} category_name={category.name} category_currency={category.default_currency} expense={{ id: e.id, price: e.price, currency: e.currency, date: e.date, description: e.description }} />

                                return <Box key={idx2}></Box>
                            })}
                        </Box>
                    );
                })}
            </Stack>
        );
    }

    return content;
}
