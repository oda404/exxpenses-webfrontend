import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { User, Expense } from "../generated/graphql";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToDailyTotals from "../utils/expensesToDaily";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import last_month_today from "../utils/lastMonthToday";

const FullBarExpenseChart = dynamic(
    import("./FullBarExpenseChart"),
    { ssr: false }
);

function Statistic({ title, content }: { title: string; content: string }) {
    return (
        <Box marginTop="12px" width="fit-content">
            <Box fontSize="14px">
                {title}
            </Box>
            <Box fontSize="14px">
                <b>{content}</b>
            </Box>
        </Box>
    )
}

interface StatisticsThisMonthProps {
    user: User;
    categoryTotals: CategoryTotal[];
    total: TotalExpense;
    working_expenses: Expense[];

    lm_total: TotalExpense;
    lm_working_expenses: Expense[];
}

export default function StatisticsThisMonth({ user, categoryTotals, total, working_expenses, lm_total, lm_working_expenses }: StatisticsThisMonthProps) {

    let now = new Date();
    let since = new Date(now.getFullYear(), now.getMonth(), 1);
    let until = new Date(now);

    let mostExpensiveCategory: CategoryTotal = categoryTotals[0];
    for (let i = 0; i < categoryTotals.length; ++i) {
        if (categoryTotals[i].price > mostExpensiveCategory.price)
            mostExpensiveCategory = categoryTotals[i];
    }

    let most_expensive_cat_content = `${mostExpensiveCategory?.category} | ${mostExpensiveCategory?.currency} ${mostExpensiveCategory?.price}`;
    if (mostExpensiveCategory.price == 0)
        most_expensive_cat_content = "N/A";

    let daily_totals_this_month = expensesToDailyTotals(working_expenses, user.preferred_currency as string);
    let most_expensive_day_content = "N/A";
    if (daily_totals_this_month.length > 0) {
        let most_expensive_day = daily_totals_this_month[0];
        for (let i = 0; i < daily_totals_this_month.length; ++i)
            if (daily_totals_this_month[i].expense.price > most_expensive_day.expense.price)
                most_expensive_day = daily_totals_this_month[i];

        most_expensive_day_content = `${most_expensive_day.expense.currency} ${most_expensive_day.expense.price} on ${new Date(most_expensive_day.date).toDateString()}`;
    }

    let lm_daily_totals = expensesToDailyTotals(lm_working_expenses, user.preferred_currency as string);

    let diff_perc = String(total.price);
    if (lm_total.price > 0)
        diff_perc = (Math.abs(lm_total.price - total.price) / lm_total.price * 100).toFixed(2).replace(/\.0+$/, '');
    let sign = lm_total.price > total.price ? "-" : "+";
    let diff_price = Math.abs(lm_total.price - total.price);

    let lm_total_today = expensesToTotal(lm_working_expenses, user.preferred_currency as string, last_month_today(now));

    let diff_perc_today = String(total.price);
    if (lm_total_today.price > 0)
        diff_perc_today = (Math.abs(lm_total_today.price - total.price) / lm_total_today.price * 100).toFixed(2).replace(/\.0+$/, '');

    let sign_today = lm_total_today.price > total.price ? "-" : "+";
    let diff_price_today = Math.abs(lm_total_today.price - total.price);

    return (
        <Box>
            <Box sx={{ fontSize: "20px" }}>
                Statistics
            </Box>
            <Box marginBottom="15px" fontSize=".875rem">
                {since.getDate()}.{since.getMonth() + 1}.{since.getFullYear()} - {until.getDate()}.{until.getMonth() + 1}.{until.getFullYear()} (This month)
            </Box>
            <Box>
                <FullBarExpenseChart currency={user.preferred_currency as string} dailyTotals={daily_totals_this_month} lm_daily_totals={lm_daily_totals} since={since} until={until} />
            </Box>
            <Box>
                <Statistic title="Total" content={`${total.currency} ${total.price}`} />
                <Statistic title="Most expensive category" content={most_expensive_cat_content} />
                <Statistic title="Most expensive day" content={most_expensive_day_content} />
                <Statistic title="Compared to last month (whole)" content={`${sign}${diff_perc}% (${sign}${total.currency} ${diff_price})`} />
                <Statistic title="Compared to last month (today)" content={`${sign_today}${diff_perc_today}% (${sign_today}${total.currency} ${diff_price_today})`} />
            </Box>
        </Box>
    )
}