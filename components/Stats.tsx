import { Box, Grid, Paper, Typography } from "@mui/material";
import styles from "../styles/Dashboard.module.css";
import { Category, CategoryDeleteDocument, Expense, ExpenseTotalCostMultiple } from "../generated/graphql";
import { Decimal } from "decimal.js";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import expensesToTotal from "../utils/expensesToTotal";

interface StatCardProps {
    text: string;
    content: any;
    isMobileView: boolean;
}

function StatCard({ isMobileView, text, content }: StatCardProps) {

    let el: any;
    if (isMobileView) {
        el = (
            <Grid sx={{ overflow: "hidden" }} item>
                <Paper className={styles.statCardPaper} sx={{ height: "fit-content !important" }}>
                    <Box display="flex">
                        <Box sx={{ fontSize: "22px" }}>
                            <b>{content}</b>
                        </Box>
                        <Typography sx={{ marginLeft: "6px", marginTop: "11px", fontSize: ".75rem" }}>
                            <b>{text}</b>
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        )
    }
    else {
        el = (
            <Grid sx={{ overflow: "hidden" }} item>
                <Paper className={styles.categoryBox} sx={{ height: "fit-content !important", padding: "12px !important" }}>
                    <Typography sx={{ textTransform: "uppercase", fontSize: "12px" }}>
                        <b>{text}</b>
                    </Typography>
                    <Box sx={{ marginLeft: "2px", textTransform: "uppercase", fontSize: "14px" }}>
                        {content}
                    </Box>
                </Paper>
            </Grid>
        );
    }

    return (
        <>{el}</>
    )
}

function costsToTotal(costs: ExpenseTotalCostMultiple[], currency: string) {

    interface Totals {
        currency: string;
        total: number;
    };

    let totals: Totals[] = [];

    costs.forEach(cost => {
        cost.total.forEach(total => {
            let idx = totals.findIndex(t => t.currency === total.currency);
            if (idx === -1) {
                totals.push({ currency: total.currency, total: total.price });
            }
            else {
                /* FIXME: hold the whole and fractional parts as two different columns in the db ? */
                const x = new Decimal(totals[idx].total);
                const y = new Decimal(total.price);
                totals[idx].total = x.add(y).toNumber();
            }
        })
    });

    for (let i = 0; i < totals.length; ++i) {
        if (totals[i].currency !== currency) {
            totals.splice(i, 1);
            --i;
        }
    }


    let content: any;
    if (totals.length === 0) {
        content = (
            <Box>
                0
            </Box>
        )
    }
    else {
        content = (
            <Box>
                <Box display="flex">
                    <Box>
                        <b>{totals[0].currency}</b>
                    </Box>
                    &nbsp;
                    <Box><b>{totals[0].total}</b></Box>
                </Box>
            </Box>
        )
    }

    return content;
}

function costsToCostly(costs: ExpenseTotalCostMultiple[]) {

    interface Totals {
        currency: string;
        total: number;
        category: string;
    }

    let totals: Totals[] = [];

    costs.forEach(cost => {
        cost.total.forEach(total => {
            let idx = totals.findIndex(t => t.currency === total.currency);
            if (idx === -1) {
                totals.push({ category: cost.category_name, currency: total.currency, total: total.price });
            }
            else {
                if (total.price > totals[idx].total) {
                    totals[idx].category = cost.category_name;
                    totals[idx].total = total.price;
                }
            }
        })
    });

    let content: any;
    if (totals.length === 0) {
        content = (
            <Box>
                0
            </Box>
        )
    }
    else {
        content = (
            <Box>
                <Box display="flex">
                    <Box>
                        {totals[0].category}:
                    </Box>
                    &nbsp;
                    <Box>
                        <b>{totals[0].currency}</b>
                    </Box>
                    &nbsp;
                    <Box><b>{totals[0].total}</b></Box>
                </Box>
            </Box>
        );
    }

    return content;
}

interface StatsProps {
    categories?: Category[] | null;
    expensesMultipleCategories: MultiCategoryExpenses;
    isMobileView: boolean;
    preferred_currency: string;
}

export default function Stats({ preferred_currency, isMobileView, expensesMultipleCategories, categories }: StatsProps) {

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

    let content: any;
    if (isMobileView) {
        content = (
            <Box sx={{ overflowY: "auto" }} display="flex" flexDirection="column">
                <Grid container spacing={3}>
                    <StatCard isMobileView={isMobileView} text="This month" content={totalThisMonth} />
                </Grid>
            </Box >
        )
    }
    else {
        content = (
            <Box sx={{ overflowY: "auto" }} paddingTop="20px" display="flex" flexDirection="column">
                <Grid container spacing={3}>
                    <StatCard isMobileView={isMobileView} text="This month" content={totalThisMonth} />
                </Grid>
            </Box >
        )
    }

    return (
        <>{content}</>
    )
}
