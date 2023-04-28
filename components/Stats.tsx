import { Box, Grid, Paper, Typography } from "@mui/material";
import styles from "../styles/Dashboard.module.css";
import { Category, Expense } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import expensesToTotal from "../utils/expensesToTotal";

interface StatCardProps {
    text?: string;
    content: any;
}

function StatCard({ text, content }: StatCardProps) {
    return (
        <Grid sx={{ overflow: "hidden" }} item>
            <Paper className={styles.statCardPaper} sx={{ height: "fit-content !important" }}>
                <Box display="flex">
                    <Box sx={{ fontSize: "20px" }}>
                        {content}
                    </Box>
                    <Typography sx={{ marginLeft: "6px", marginTop: "10px", fontSize: "12px" }}>
                        {text}
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    )
}

interface StatsProps {
    categories?: Category[] | null;
    expensesMultipleCategories: MultiCategoryExpenses;
    preferred_currency: string;
}

export default function Stats({ preferred_currency, expensesMultipleCategories, categories }: StatsProps) {

    let totalThisMonth;
    let expense_count = 0;

    let workingExpenses: Expense[] = [];
    expensesMultipleCategories.categories.forEach(category => {

        const tmp = categories?.find(c => c.name === category.name);
        if (!tmp || tmp.default_currency !== preferred_currency)
            return;

        workingExpenses.push(...category.expenses);
        expense_count += category.expenses.length;
    });

    let total = expensesToTotal(workingExpenses, preferred_currency);

    totalThisMonth = (
        <Box fontSize="20px" display="flex">
            <Box>
                <b>{total.currency}</b>
            </Box>
            &nbsp;
            <Box><b>{total.price}</b></Box>
        </Box>
    );

    let expense_count_this_month = (
        <Box fontSize="16px" display="flex">
            <Box>
                {expense_count}
            </Box>
            &nbsp;
            <Box>expenses</Box>
        </Box>
    )

    return (
        <Box sx={{ overflowY: "auto" }} display="flex" flexDirection="column">
            <Box fontSize="16px">
                This month
            </Box>
            <Grid direction="column" container >
                {/* <StatCard content={expense_count_this_month} /> */}
                <StatCard content={totalThisMonth} />
            </Grid>
        </Box>
    )
}
