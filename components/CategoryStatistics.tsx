import { Divider, Box, Button } from "@mui/material";
import Decimal from "decimal.js";
import dynamic from "next/dynamic";
import { Category, Expense } from "../generated/graphql";
import addFloats from "../utils/addFloats";
import daysBetweenDates from "../utils/daysBetweenDates";
import { DailyExpenses } from "../utils/expensesToDaily";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import last_month_today from "../utils/lastMonthToday";
import { useState } from "react";
import daily_totals_to_cumulative from "../utils/dailyTotalsToCumulative";

/* What in the living fuck ?!:)dwdA!@W! */
const FullBarExpenseChart = dynamic(
    import("./FullBarExpenseChart"),
    { ssr: false }
);

function FullViewStatistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content" marginTop="12px">
            <Box fontSize="14px">
                {title}
            </Box>
            <Box fontSize="14px">
                <b>{content}</b>
            </Box>
        </Box>
    )
}

interface StatisticsTabProps {
    totalExpenses: TotalExpense;
    dailyTotals: DailyExpenses[];
    lastMonthExpenses: Expense[];
    category: Category;
}

export default function CategoryStatistics({ lastMonthExpenses, category, totalExpenses, dailyTotals }: StatisticsTabProps) {

    let now = new Date();
    let since = new Date(now.getFullYear(), now.getMonth(), 1);
    let until = new Date(now);

    let [cumulative, setCumulative] = useState(true);

    let mostExpensiveDay: DailyExpenses | undefined = undefined;
    for (let i = 0; i < dailyTotals.length; ++i) {
        if (mostExpensiveDay === undefined || dailyTotals[i].expense.price > mostExpensiveDay.expense.price)
            mostExpensiveDay = dailyTotals[i];
    }

    let avg = 0;
    dailyTotals.forEach(t => {
        avg = addFloats(avg, t.expense.price);
    });
    let averageString = new Decimal(avg).dividedBy(new Decimal(daysBetweenDates(since, until))).toFixed(2).replace(/\.0+$/, '');

    if (!lastMonthExpenses)
        lastMonthExpenses = [];
    let lastMonthTotal = expensesToTotal(lastMonthExpenses, category.default_currency);

    let lastMonthTotalUntilToday = expensesToTotal(lastMonthExpenses, category.default_currency, last_month_today(until));

    let diffPerc = String(totalExpenses.price);
    if (lastMonthTotal.price > 0)
        diffPerc = (Math.abs(lastMonthTotal.price - totalExpenses.price) / lastMonthTotal.price * 100).toFixed(2).replace(/\.0+$/, '');

    let sign = lastMonthTotal.price > totalExpenses.price ? "-" : "+";
    let diffPrice = Math.abs(lastMonthTotal.price - totalExpenses.price);

    let diffPercToday = String(totalExpenses.price);
    if (lastMonthTotalUntilToday.price > 0)
        diffPercToday = (Math.abs(lastMonthTotalUntilToday.price - totalExpenses.price) / lastMonthTotalUntilToday.price * 100).toFixed(2).replace(/\.0+$/, '');

    let signToday = lastMonthTotalUntilToday.price > totalExpenses.price ? "-" : "+";
    let diffPriceToday = Math.abs(lastMonthTotalUntilToday.price - totalExpenses.price);

    // cumulative bullshit
    let daily_totals_copy: DailyExpenses[] = [];
    for (let i = 0; i < dailyTotals.length; ++i) {
        daily_totals_copy.push({
            date: dailyTotals[i].date,
            expense_count: dailyTotals[i].expense_count,
            expense: {
                price: dailyTotals[i].expense.price,
                currency: dailyTotals[i].expense.currency
            }
        });
    }

    if (cumulative)
        daily_totals_copy = daily_totals_to_cumulative(daily_totals_copy, until);

    return (
        <Box sx={{ height: "100%" }}>
            <Box fontSize="18px">
                Statistics
            </Box>
            <Box marginBottom="15px" fontSize=".875rem">
                {since.getDate()}.{since.getMonth() + 1}.{since.getFullYear()} - {now.getDate()}.{now.getMonth() + 1}.{now.getFullYear()} (This month)
            </Box>
            <Box position="relative">
                <FullBarExpenseChart currency={category.default_currency} dailyTotals={daily_totals_copy} since={since} until={until} />

                <Box display="flex" bottom="10px" left="10px" position="absolute" fontSize="12px">
                    <Box bgcolor="var(--exxpenses-main-bg-color)" borderRadius="25px">
                        <Button
                            sx={{
                                color: "var(--exxpenses-main-color)",
                                borderRadius: "25px",
                                paddingX: "10px",
                                background: cumulative ? "var(--exxpenses-dark-green)" : "none",
                                textTransform: "none",
                                fontSize: "12px",
                                "&:hover": {
                                    background: cumulative ? "var(--exxpenses-dark-green)" : "none"
                                }
                            }}
                            onClick={() => { if (!cumulative) setCumulative(true); }}
                        >
                            Cumulative
                        </Button>
                        <Button
                            sx={{
                                color: "var(--exxpenses-main-color)",
                                borderRadius: "25px",
                                paddingX: "10px",
                                background: cumulative ? "none" : "var(--exxpenses-dark-green)",
                                textTransform: "none",
                                fontSize: "12px",
                                "&:hover": {
                                    background: cumulative ? "none" : "var(--exxpenses-dark-green)"
                                }
                            }}
                            onClick={() => { if (cumulative) setCumulative(false); }}
                        >
                            Per-day
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box>
                <FullViewStatistic title="Total spent" content={`${totalExpenses.currency} ${totalExpenses.price}`} />
                <FullViewStatistic title="Most expensive day" content={
                    mostExpensiveDay !== undefined ?
                        `${mostExpensiveDay.expense.currency} ${mostExpensiveDay.expense.price} on ${new Date(mostExpensiveDay.date).toDateString()}` :
                        `N/A`}
                />
                <FullViewStatistic title={`Average per day`} content={`${category.default_currency} ${averageString}`} />
                <FullViewStatistic title="Compared to last month (today)" content={`${signToday}${diffPercToday}% (${sign}${totalExpenses.currency} ${diffPriceToday})`} />
                <FullViewStatistic title="Compared to last month (whole)" content={`${sign}${diffPerc}% (${sign}${totalExpenses.currency} ${diffPrice})`} />
            </Box>
        </Box>
    )
}