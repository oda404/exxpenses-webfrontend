import { Box } from "@mui/material";
import { ResponsiveContainer, Tooltip, Area, AreaChart, YAxis, XAxis } from "recharts";
import { DailyExpenses } from "../utils/expensesToDaily";
import { useEffect, useState } from "react";
import last_month_today from "../utils/lastMonthToday";
import dayjs from "dayjs";

function name_to_date(name?: string) {

    if (name === undefined)
        return undefined;

    let start = name.indexOf('(');

    let idx = name.indexOf('.');
    let day = name.substring(start + 1, idx);

    let month = name.substring(idx + 1, name.indexOf('.', idx + 1))
    idx = name.indexOf('.', idx + 1);

    let year = "";
    let end = name.lastIndexOf(')');
    if (end == -1)
        year = name.substring(idx + 1);
    else
        year = name.substring(idx + 1, end);

    return new Date(Number(year), Number(month) - 1, Number(day));
}

interface FullBarExpenseChartProps {
    dailyTotals: DailyExpenses[];
    lm_daily_totals?: DailyExpenses[];
    currency: string;
    since: Date;
    until: Date;

    compare_since?: Date;
    compare_until?: Date;
}

function CustomTooltip({ active, payload }: any) {

    useEffect(() => {
        if (active && payload && payload.length)
            payload[0].payload.cb(payload[0].payload);
    }, [payload, active]);

    return null;
}

interface PayloadData {
    name?: string;
    compare_name?: string;
    pv: number;
    count: number;
    uv?: number;
    uv_count?: number;
}

export default function FullBarExpenseChart({ dailyTotals, currency, since, until, lm_daily_totals, compare_since, compare_until }: FullBarExpenseChartProps) {

    let plotData: any[] = [];
    for (let d = dayjs(since); d <= dayjs(until); d = d.add(1, "day")) {
        if (lm_daily_totals) {
            plotData.push({
                name: `${d.date()}.${d.month() + 1}.${d.year()}`,
                count: 0,
                pv: 0,
            })
        }
        else {
            plotData.push({
                name: `${d.date()}.${d.month() + 1}.${d.year()}`,
                count: 0,
                pv: 0
            })
        }
    }

    let tmp_idx = 0;
    for (let d = dayjs(compare_since); d <= dayjs(compare_until); d = d.add(1, "day")) {
        if (tmp_idx >= plotData.length) {
            plotData.push({
                compare_name: `${d.date()}.${d.month() + 1}.${d.year()}`,
                uv_count: 0,
                uv: 0
            });
        }
        else {
            plotData[tmp_idx].uv = 0;
            plotData[tmp_idx].uv_count = 0;
            plotData[tmp_idx].compare_name = `${d.date()}.${d.month() + 1}.${d.year()}`;
        }

        ++tmp_idx;
    }

    dailyTotals.forEach((e, idx) => {
        const d = dayjs(e.date);
        if (d < dayjs(since) || d > dayjs(until))
            return;

        let date_string = `${d.date()}.${d.month() + 1}.${d.year()}`;
        let i = plotData.findIndex(pd => pd.name === date_string);
        if (i === -1)
            return;
        plotData[i].pv = e.expense.price
        plotData[i].count = e.expense_count;
    })

    lm_daily_totals?.forEach((e) => {

        let d = dayjs(e.date);
        let new_str_date = `${d.date()}.${d.month() + 1}.${d.year()}`;

        let idx = plotData.findIndex(d => d.compare_name == new_str_date);
        if (idx > -1) {
            plotData[idx].uv = e.expense.price;
            plotData[idx].uv_count = e.expense_count;
        }
    });

    const last_payload = plotData[plotData.length - 1];
    const [cur_payload, set_cur_payload] = useState<PayloadData>(last_payload);

    const cur_payload_changed = (payload: PayloadData) => {
        const now = new Date();
        const now_date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
        if (now_date == payload.name)
            payload.name = `Today (${payload.name})`;

        if (cur_payload!.name != payload.name || cur_payload.compare_name !== payload.compare_name || cur_payload!.count != payload.count || cur_payload!.pv != payload.pv)
            set_cur_payload(payload);
    }
    cur_payload_changed(cur_payload);

    for (let i = 0; i < plotData.length; ++i)
        plotData[i].cb = cur_payload_changed;

    let line_legend = null;
    if (lm_daily_totals) {
        line_legend = (
            <Box>
                <Box alignItems="center" display="flex">
                    <Box marginRight="8px" fontSize="12px" marginTop="2px">This month</Box>
                    <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bgcolor="var(--exxpenses-dark-green)"
                    />
                </Box>
                <Box alignItems="center" display="flex">
                    <Box marginRight="8px" fontSize="12px" marginTop="2px">Last month</Box>
                    <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bgcolor="#0088FE"
                    />
                </Box>
            </Box>
        )
    }

    let name_content: any;
    if (lm_daily_totals) {

        let idx_showing = plotData.findIndex(d => d.name === cur_payload.name && cur_payload.name !== undefined);
        let idx_compare = plotData.findIndex(d => d.compare_name === cur_payload.compare_name && cur_payload.compare_name !== undefined);

        let now = dayjs();
        let now_str = `${now.date()}.${now.month() + 1}.${now.year()}`
        let last_month_now = dayjs(now).subtract(1, "month");
        let last_month_now_str = `${last_month_now.date()}.${last_month_now.month() + 1}.${last_month_now.year()}`

        let now_date = name_to_date(cur_payload!.name);
        let lm_date = name_to_date(cur_payload!.compare_name);

        let compare_date_str = cur_payload!.compare_name;
        if (compare_date_str === now_str)
            compare_date_str = `Today`;
        else if (compare_date_str === last_month_now_str)
            compare_date_str = `Last month, today`;

        let showing_date_str = cur_payload!.name;
        if (showing_date_str?.includes("Today"))
            showing_date_str = "Today";

        name_content = (
            <>
                <Box fontSize="14px" display="flex" fontWeight="bold">
                    <Box>
                        {showing_date_str === undefined ? "-" : `${currency} ${cur_payload!.pv}`}
                    </Box>
                    <Box fontSize="12px" marginTop="4px" fontWeight="initial">
                        &nbsp; {showing_date_str}
                    </Box>
                    <Box fontSize="12px" marginTop="4px" fontWeight="initial" display={cur_payload!.count > 0 ? "initial" : "none"}>
                        &nbsp; {cur_payload!.count} expense(s)
                    </Box>
                </Box>
                <Box fontSize="14px" display="flex" fontWeight="bold">
                    <Box>
                        {compare_date_str === undefined ? "-" : `${currency} ${cur_payload!.uv}`}
                    </Box>
                    <Box fontSize="12px" marginTop="4px" fontWeight="initial">
                        &nbsp; {compare_date_str}
                    </Box>
                    <Box marginTop="4px" fontSize="12px" fontWeight="initial" display={(cur_payload!.uv_count !== undefined && cur_payload!.uv_count > 0) ? "initial" : "none"}>
                        &nbsp; {cur_payload!.uv_count} expense(s)
                    </Box>
                </Box>
            </>
        )
    }
    else {

        let cur_date = cur_payload!.name;
        if (cur_date?.includes("Today"))
            cur_date = "Today";

        name_content = (
            <>
                <Box fontWeight="bold">
                    <Box>
                        {currency} {cur_payload!.pv}
                    </Box>
                </Box>
                <Box display="flex">
                    <Box fontSize="12px">
                        {cur_date}
                    </Box>
                    <Box fontSize="12px" fontWeight="initial" display={cur_payload!.count > 0 ? "initial" : "none"}>
                        &nbsp; {cur_payload!.count} expense(s)
                    </Box>
                </Box>
            </>
        );
    }

    let max = 0;
    for (let i = 0; i < plotData.length; ++i) {
        if (plotData[i].pv > max)
            max = plotData[i].pv;

        if (plotData[i].uv > max)
            max = plotData[i].uv;
    }

    let width = 13;
    if (max == 0)
        width = 0;
    else if (max > 0 && max < 10)
        width = 13;
    else if (max >= 10 && max < 100)
        width = 20;
    else if (max >= 100 && max < 1000)
        width = 28;
    else if (max >= 1000 && max < 10000)
        width = 34;
    else if (max >= 10000 && max < 100000)
        width = 40;

    return (
        <Box position="relative" bgcolor="var(--exxpenses-dark-highlight)" borderRadius="6px" padding="10px">
            <Box position="absolute">
                {name_content}
            </Box>
            <Box right="0" position="absolute">
                <Box marginRight="10px">
                    {line_legend}
                </Box>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={plotData}
                    margin={{
                        top: 70,
                        bottom: 30,
                    }}
                    onMouseLeave={() => cur_payload_changed(last_payload)}
                >
                    <XAxis height={1} tick={false} axisLine={{ strokeDasharray: 10 }} />
                    <YAxis tickMargin={0} fontSize="12px" orientation="right" width={width} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursorStyle={{ background: "black" }} />
                    <Area strokeWidth={2} type="monotone" dataKey="uv" stroke="#0088FE" fillOpacity={1} fill="url(#colorUv)" />
                    <Area strokeWidth={2} type="monotone" dataKey="pv" stroke="var(--exxpenses-dark-green)" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}
