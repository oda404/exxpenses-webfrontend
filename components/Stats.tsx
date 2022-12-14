import { Box, Grid, Paper, Typography } from "@mui/material";
import styles from "../styles/Dashboard.module.css";
import { Category, CategoryDeleteDocument, ExpenseTotalCostMultiple } from "../generated/graphql";
import { Decimal } from "decimal.js";

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
                        <Box sx={{ fontSize: "20px" }}>
                            <b>{content}</b>
                        </Box>
                        <Typography sx={{ marginLeft: "6px", marginTop: "9px", fontSize: "12px" }}>
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

function costsToTotal(costs: ExpenseTotalCostMultiple[]) {

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

function categoriesToMostRecent(categories: Category[]) {

}

interface StatsProps {
    categories?: Category[] | null;
    totalCosts?: ExpenseTotalCostMultiple[] | null;
    isMobileView: boolean;
}

export default function Stats({ isMobileView, totalCosts, categories }: StatsProps) {

    let totalThisMonth;
    if (totalCosts === undefined || totalCosts === null || totalCosts.length === 0)
        totalThisMonth = 0;
    else
        totalThisMonth = costsToTotal(totalCosts);

    let costlyThisMonth = (totalCosts === undefined || totalCosts === null) ? "None" : costsToCostly(totalCosts);
    let mostRecent = (categories === undefined || categories === null) ? "None" : categoriesToMostRecent(categories);

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
                    <StatCard isMobileView={isMobileView} text="Costly This month" content={costlyThisMonth} />
                </Grid>
            </Box >
        )
    }

    return (
        <>{content}</>
    )
}
