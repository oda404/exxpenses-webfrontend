import { Box, Button, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { User, Expense } from "../generated/graphql";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToDailyTotals, { DailyExpenses } from "../utils/expensesToDaily";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import last_month_today from "../utils/lastMonthToday";
import Decimal from "decimal.js";
import { useState } from "react";
import daysBetweenDates from "../utils/daysBetweenDates";
import daily_totals_to_cumulative from "../utils/dailyTotalsToCumulative";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DateRangePickerCustom from "./DateRangePicker";
import dayjs, { Dayjs } from "dayjs";

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

    showing_since: Date;
    showing_until: Date;
    compare_since: Date;
    compare_until: Date;
    custom_period: boolean;
}

export default function StatisticsThisMonth({
    user, categoryTotals, total, working_expenses, lm_total, lm_working_expenses,
    compare_since, compare_until, showing_since, showing_until, custom_period
}: StatisticsThisMonthProps) {

    let [cumulative, setCumulative] = useState(true);
    let [show_last_month, set_show_last_month] = useState(true);

    let on_showing_period_accept = (value: (Dayjs | null)[]) => {
        if (value[0] === null || value[1] === null)
            return;

        const query_params = new URLSearchParams(window.location.search);
        if (query_params.has("showing_since"))
            query_params.set("showing_since", value[0].valueOf().toString());
        else
            query_params.append("showing_since", value[0].valueOf().toString());

        if (query_params.has("showing_until"))
            query_params.set("showing_until", value[1].valueOf().toString());
        else
            query_params.append("showing_until", value[1].valueOf().toString());

        window.location.assign(`/statistics?${query_params.toString()}`);
    }

    let on_compare_period_accept = (value: (Dayjs | null)[]) => {
        if (value[0] === null || value[1] === null)
            return;

        const query_params = new URLSearchParams(window.location.search);
        if (query_params.has("compare_since"))
            query_params.set("compare_since", value[0].valueOf().toString());
        else
            query_params.append("compare_since", value[0].valueOf().toString());

        if (query_params.has("compare_until"))
            query_params.set("compare_until", value[1].valueOf().toString());
        else
            query_params.append("compare_until", value[1].valueOf().toString());

        window.location.assign(`/statistics?${query_params.toString()}`);
    }

    let mostExpensiveCategory: CategoryTotal = categoryTotals[0];
    for (let i = 0; i < categoryTotals.length; ++i) {
        if (categoryTotals[i].price > mostExpensiveCategory.price)
            mostExpensiveCategory = categoryTotals[i];
    }

    let most_expensive_cat_content = `${mostExpensiveCategory?.category} - ${mostExpensiveCategory?.currency} ${mostExpensiveCategory?.price}`;
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

    if (cumulative) {
        daily_totals_this_month = daily_totals_to_cumulative(daily_totals_this_month, new Date(showing_until));
        lm_daily_totals = daily_totals_to_cumulative(lm_daily_totals, new Date(compare_until));
    }

    let diff_perc = String(total.price);
    if (lm_total.price > 0)
        diff_perc = (Math.abs(lm_total.price - total.price) / lm_total.price * 100).toFixed(2).replace(/\.0+$/, '');
    let sign = lm_total.price > total.price ? "-" : "+";
    let diff_price = new Decimal(lm_total.price).sub(new Decimal(total.price)).abs().toNumber();

    let lm_total_today = expensesToTotal(lm_working_expenses, user.preferred_currency as string, last_month_today(new Date()));

    let diff_perc_today = String(total.price);
    if (lm_total_today.price > 0)
        diff_perc_today = (Math.abs(lm_total_today.price - total.price) / lm_total_today.price * 100).toFixed(2).replace(/\.0+$/, '');

    let sign_today = lm_total_today.price > total.price ? "-" : "+";
    let diff_price_today = new Decimal(lm_total_today.price).sub(new Decimal(total.price)).abs().toNumber();

    let averageString = new Decimal(total.price).dividedBy(new Decimal(daysBetweenDates(new Date(showing_since), new Date(showing_until)))).toFixed(2).replace(/\.0+$/, '');

    return (
        <Box>
            <Box sx={{ fontSize: "20px" }}>
                Statistics
            </Box>
            <Box justifyContent="space-between" display="flex">
                <Box>
                    <Box alignItems="center" display="flex" fontSize="14px">
                        <Box>
                            Showing
                        </Box>
                        <Box display={custom_period ? "block" : "none"}>
                            <IconButton
                                onClick={() => {
                                    const query_params = new URLSearchParams(window.location.search);
                                    query_params.delete("showing_since");
                                    query_params.delete("showing_until");
                                    window.location.assign(`/statistics?${query_params.toString()}`);
                                }}
                                sx={{ padding: "4px" }}
                            >
                                <RestartAltIcon sx={{ width: "16px", height: "16px" }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box marginTop="2px" marginBottom="15px" fontSize="12px">
                        <DateRangePickerCustom
                            onAccept={on_showing_period_accept}
                            defaultValue={[dayjs(showing_since), dayjs(showing_until)]}
                            disabled={user.plan === 0}
                        />
                    </Box>
                </Box>
                <Box>
                    <Box alignItems="center" display="flex" fontSize="14px">
                        <Box textAlign="right" width="100%">
                            Comparing with
                        </Box>
                        <Box display={custom_period ? "block" : "none"}>
                            <IconButton onClick={() => {
                                const query_params = new URLSearchParams(window.location.search);
                                query_params.delete("compare_since");
                                query_params.delete("compare_until");
                                window.location.assign(`/statistics?${query_params.toString()}`);
                            }} sx={{ padding: "4px" }}>
                                <RestartAltIcon sx={{ width: "16px", height: "16px" }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box marginTop="2px" textAlign="right" marginBottom="15px" fontSize="12px">
                        <DateRangePickerCustom disabled={user.plan === 0} onAccept={on_compare_period_accept} defaultValue={[dayjs(compare_since), dayjs(compare_until)]} />
                    </Box>
                </Box>
            </Box>
            <Box position="relative">
                <FullBarExpenseChart
                    currency={user.preferred_currency as string}
                    dailyTotals={daily_totals_this_month}
                    lm_daily_totals={show_last_month ? lm_daily_totals : undefined}
                    since={new Date(showing_since)}
                    until={new Date(showing_until)}
                    compare_since={show_last_month ? compare_since : undefined}
                    compare_until={show_last_month ? compare_until : undefined}
                    custom_period={custom_period}
                />
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

                    <Box marginLeft="10px">
                        <Button
                            sx={{
                                color: "var(--exxpenses-main-color)",
                                borderRadius: "25px",
                                paddingX: "10px",
                                background: show_last_month ? "var(--exxpenses-dark-green)" : "var(--exxpenses-main-bg-color)",
                                textTransform: "none",
                                fontSize: "12px",
                                "&:hover": {
                                    background: show_last_month ? "var(--exxpenses-dark-green)" : "var(--exxpenses-main-bg-color)"
                                }
                            }}
                            onClick={() => set_show_last_month(!show_last_month)}
                        >
                            {custom_period ? "Show comparison" : "Show last month"}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Statistic title="Total" content={`${total.currency} ${total.price}`} />
                <Statistic title="Average per day" content={`${total.currency} ${averageString}`} />
                <Statistic title="Most expensive category" content={most_expensive_cat_content} />
                <Statistic title="Most expensive day" content={most_expensive_day_content} />
                {custom_period ? null : <Statistic title="Compared to last month (today)" content={`${sign_today}${diff_perc_today}% (${sign_today}${total.currency} ${diff_price_today})`} />}
                <Statistic title={custom_period ? "Compared to comparison per." : "Compared to last month (whole)"} content={`${sign}${diff_perc}% (${sign}${total.currency} ${diff_price})`} />
            </Box>
        </Box >
    )
}