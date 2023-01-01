import { Divider, Box } from "@mui/material";
import Decimal from "decimal.js";
import dynamic from "next/dynamic";
import { Category, Expense } from "../generated/graphql";
import addFloats from "../utils/addFloats";
import daysBetweenDates from "../utils/daysBetweenDates";
import { DailyExpenses } from "../utils/expensesToDaily";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";

/* What in the living fuck ?!:)dwdA!@W! */
const FullBarExpenseChart = dynamic(
    import("./FullBarExpenseChart"),
    { ssr: false }
);

function FullViewStatistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content" borderBottom="1px solid var(--exxpenses-main-border-color)" marginTop="20px">
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
    since: Date;
    until: Date;
}

export default function CategoryStatistics({ lastMonthExpenses, category, since, until, totalExpenses, dailyTotals }: StatisticsTabProps) {

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

    let diffPerc = String(totalExpenses.price);
    if (lastMonthTotal.price > 0)
        diffPerc = (Math.abs(lastMonthTotal.price - totalExpenses.price) / lastMonthTotal.price * 100).toFixed(2).replace(/\.0+$/, '');

    let sign = lastMonthTotal.price > totalExpenses.price ? "-" : "+";
    let diffPrice = Math.abs(lastMonthTotal.price - totalExpenses.price);

    return (
        <Box sx={{ height: "100%" }}>
            <Box marginBottom="15px">
                Statistics
            </Box>
            <FullBarExpenseChart dailyTotals={dailyTotals} since={since} until={until} />
            <Divider sx={{ marginTop: "10px", width: "100%", backgroundColor: "var(--exxpenses-main-border-color)", height: "1px" }} />

            <Box>
                <FullViewStatistic title="Total spent" content={`${totalExpenses.currency} ${totalExpenses.price}`} />
                <Box marginX="10px" />
                <FullViewStatistic title="Most expensive day" content={
                    mostExpensiveDay !== undefined ?
                        `${mostExpensiveDay.expense.currency} ${mostExpensiveDay.expense.price} on ${new Date(mostExpensiveDay.date).toDateString()}` :
                        `N/A`}
                />
                <Box marginX="10px" />
                <FullViewStatistic title="Average per day" content={`${category.default_currency} ${averageString}`} />
                <Box marginX="10px" />
                <FullViewStatistic title="Compared to last month" content={`${sign}${diffPerc}% (${sign}${totalExpenses.currency}${diffPrice})`} />
            </Box>
        </Box>
    )
}