import { Divider, Box, Button, IconButton } from "@mui/material";
import Decimal from "decimal.js";
import dynamic from "next/dynamic";
import { Category, Expense, User } from "../generated/graphql";
import addFloats from "../utils/addFloats";
import daysBetweenDates from "../utils/daysBetweenDates";
import expensesToDailyTotals, { DailyExpenses } from "../utils/expensesToDaily";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import last_month_today from "../utils/lastMonthToday";
import { useState } from "react";
import daily_totals_to_cumulative from "../utils/dailyTotalsToCumulative";
import dayjs, { Dayjs } from "dayjs";
import DateRangePickerCustom from "./DateRangePicker";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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
    user: User;
    total: TotalExpense;
    category: Category;

    showing_expenses: Expense[];
    compare_expenses: Expense[];

    showing_since: Date;
    showing_until: Date;
    compare_since: Date;
    compare_until: Date;
    custom_period: boolean;
}

export default function CategoryStatistics({
    user, showing_expenses, compare_expenses, category, total, showing_since, showing_until, compare_since, compare_until, custom_period
}: StatisticsTabProps) {

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

        window.location.assign(`/category/${category.name}?${query_params.toString()}`);
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

        window.location.assign(`/category/${category.name}?${query_params.toString()}`);
    }

    let showing_daily_totals = expensesToDailyTotals(showing_expenses, category.default_currency);
    if (!compare_expenses)
        compare_expenses = [];

    let compare_daily_totals = expensesToDailyTotals(compare_expenses, category.default_currency);

    let compare_total = expensesToTotal(compare_expenses, category.default_currency);
    let last_month_total = expensesToTotal(compare_expenses, category.default_currency, last_month_today(new Date()));

    /* most expensive day */
    let mostExpensiveDay: DailyExpenses | undefined = undefined;
    for (let i = 0; i < showing_daily_totals.length; ++i) {
        if (mostExpensiveDay === undefined || showing_daily_totals[i].expense.price > mostExpensiveDay.expense.price)
            mostExpensiveDay = showing_daily_totals[i];
    }

    /* average */
    let avg = 0;
    showing_daily_totals.forEach(t => {
        avg = addFloats(avg, t.expense.price);
    });
    let averageString = new Decimal(avg).dividedBy(new Decimal(daysBetweenDates(showing_since, showing_until))).toFixed(2).replace(/\.0+$/, '');

    /* diffs */
    let diffPerc = String(total.price);
    if (compare_total.price > 0)
        diffPerc = (Math.abs(compare_total.price - total.price) / compare_total.price * 100).toFixed(2).replace(/\.0+$/, '');

    let sign = compare_total.price > total.price ? "-" : "+";
    let diffPrice = Math.abs(compare_total.price - total.price);

    let diffPercToday = String(total.price);
    if (last_month_total.price > 0)
        diffPercToday = (Math.abs(last_month_total.price - total.price) / last_month_total.price * 100).toFixed(2).replace(/\.0+$/, '');

    let signToday = last_month_total.price > total.price ? "-" : "+";
    let diffPriceToday = Math.abs(last_month_total.price - total.price);

    // cumulative bullshit
    let daily_totals_copy: DailyExpenses[] = [];
    for (let i = 0; i < showing_daily_totals.length; ++i) {
        daily_totals_copy.push({
            date: showing_daily_totals[i].date,
            expense_count: showing_daily_totals[i].expense_count,
            expense: {
                price: showing_daily_totals[i].expense.price,
                currency: showing_daily_totals[i].expense.currency
            }
        });
    }

    let compare_daily_totals_copy: DailyExpenses[] = [];
    for (let i = 0; i < compare_daily_totals.length; ++i) {
        compare_daily_totals_copy.push({
            date: compare_daily_totals[i].date,
            expense_count: compare_daily_totals[i].expense_count,
            expense: {
                price: compare_daily_totals[i].expense.price,
                currency: compare_daily_totals[i].expense.currency
            }
        });
    }

    if (cumulative) {
        daily_totals_copy = daily_totals_to_cumulative(daily_totals_copy, showing_until);
        compare_daily_totals_copy = daily_totals_to_cumulative(compare_daily_totals_copy, compare_until);
    }

    return (
        <Box sx={{ height: "100%" }}>
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
                            disabled={user.plan === 0}
                            onAccept={on_showing_period_accept}
                            defaultValue={[dayjs(showing_since), dayjs(showing_until)]}
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
                <Box position="relative">
                    <FullBarExpenseChart
                        currency={category.default_currency}
                        dailyTotals={daily_totals_copy}
                        lm_daily_totals={show_last_month ? compare_daily_totals_copy : undefined}
                        since={showing_since}
                        until={showing_until}
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
                <FullViewStatistic title="Total spent" content={`${total.currency} ${total.price}`} />
                <FullViewStatistic title="Most expensive day" content={
                    mostExpensiveDay !== undefined ?
                        `${mostExpensiveDay.expense.currency} ${mostExpensiveDay.expense.price} on ${new Date(mostExpensiveDay.date).toDateString()}` :
                        `N/A`}
                />
                <FullViewStatistic title={`Average per day`} content={`${category.default_currency} ${averageString}`} />
                <FullViewStatistic title="Compared to last month (today)" content={`${signToday}${diffPercToday}% (${sign}${total.currency} ${diffPriceToday})`} />
                <FullViewStatistic title="Compared to last month (whole)" content={`${sign}${diffPerc}% (${sign}${total.currency} ${diffPrice})`} />
            </Box>
        </Box>
    )
}