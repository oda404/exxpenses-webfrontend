import { Box, Grid, Paper, Typography } from "@mui/material";
import styles from "../styles/Dashboard.module.css";
import { Category, Expense } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import expensesToTotal from "../utils/expensesToTotal";

interface StatCardProps {
    text: string;
    content: any;
}

function StatCard({ text, content }: StatCardProps) {
    return (
        <Grid sx={{ overflow: "hidden" }} item>
            <Paper className={styles.statCardPaper} sx={{ height: "fit-content !important" }}>
                <Box display="flex">
                    <Box sx={{ fontSize: "20px" }}>
                        <b>{content}</b>
                    </Box>
                    <Typography sx={{ marginLeft: "6px", marginTop: "10px", fontSize: "12px" }}>
                        <b>{text}</b>
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

    let workingExpenses: Expense[] = [];
    expensesMultipleCategories.categories.forEach(category => {

        const tmp = categories?.find(c => c.name === category.name);
        if (!tmp || tmp.default_currency !== preferred_currency)
            return;

        workingExpenses.push(...category.expenses);
    });

    let total = expensesToTotal(workingExpenses, preferred_currency);

    totalThisMonth = (
        <Box>
            <Box display="flex">
                <Box>
                    <b>{total.currency}</b>
                </Box>
                &nbsp;
                <Box><b>{total.price}</b></Box>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ overflowY: "auto" }} display="flex" flexDirection="column">
            <Grid container spacing={3}>
                <StatCard text="This month" content={totalThisMonth} />
            </Grid>
        </Box>
    )
}
