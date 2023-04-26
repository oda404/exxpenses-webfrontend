import { Box } from "@mui/material";
import { ResponsiveContainer, Tooltip, Area, AreaChart, YAxis } from "recharts";
import { DailyExpenses } from "../utils/expensesToDaily";
import { useEffect, useState } from "react";
import last_month_today from "../utils/lastMonthToday";

function name_to_lm_date(name: string) {

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

    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return last_month_today(date);
}

interface FullBarExpenseChartProps {
    dailyTotals: DailyExpenses[];
    lm_daily_totals?: DailyExpenses[];
    currency: string;
    since: Date;
    until: Date;
}

function CustomTooltip({ active, payload }: any) {

    useEffect(() => {
        if (active && payload && payload.length)
            payload[0].payload.cb(payload[0].payload);
    }, [payload, active]);

    return null;
}

function CustomTick(...args: any) {
    const { x, y, stroke, payload } = args[0];
    return (
        <g transform={`translate(${x},${y})`}>
            <text fontSize="14px" x={0} y={0} fill="#666" textAnchor="start">
                {payload.value}
            </text>
        </g>
    );
}

interface PayloadData {
    name: string;
    pv: number;
    count: number;
    uv?: number;
    uv_count?: number;
}

export default function FullBarExpenseChart({ dailyTotals, currency, since, until, lm_daily_totals }: FullBarExpenseChartProps) {

    let plotData: any[] = [];
    for (let d = new Date(since); d <= new Date(until); d.setDate(d.getDate() + 1)) {
        if (lm_daily_totals) {
            plotData.push({
                name: `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`,
                count: 0,
                pv: 0,
                uv: 0
            })
        }
        else {
            plotData.push({
                name: `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`,
                count: 0,
                pv: 0
            })
        }
    }

    let maxval_digcnt = 0;
    dailyTotals.forEach((e, idx) => {
        const d = new Date(e.date);
        if (d < since || d > until)
            return;

        let date_string = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
        let i = plotData.findIndex(pd => pd.name === date_string);
        plotData[i].pv = e.expense.price
        plotData[i].count = e.expense_count;

        let len = Math.round(e.expense.price).toString().length;
        if (len > maxval_digcnt)
            maxval_digcnt = len;
    })

    lm_daily_totals?.forEach((e) => {

        let new_date = new Date(e.date);
        let new_str_date = `${new_date.getDate()}.${new_date.getMonth() + 2}.${new_date.getFullYear()}`;

        let idx = plotData.findIndex(d => d.name == new_str_date);
        if (idx > -1) {
            plotData[idx].uv = e.expense.price;
            plotData[idx].uv_count = e.expense_count;
        }
    });

    const last_payload = plotData[plotData.length - 1];
    last_payload.name = `Today (${last_payload.name})`;
    const [cur_payload, set_cur_payload] = useState<PayloadData>(last_payload);

    const cur_payload_changed = (payload: PayloadData) => {
        const now = new Date();
        const now_date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
        if (now_date == payload.name)
            payload.name = `Today (${payload.name})`;

        if (cur_payload!.name != payload.name || cur_payload!.count != payload.count || cur_payload!.pv != payload.pv)
            set_cur_payload(payload);
    }

    for (let i = 0; i < plotData.length; ++i)
        plotData[i].cb = cur_payload_changed;

    let line_legend = null;
    if (lm_daily_totals) {
        line_legend = (
            <Box>
                <Box alignItems="center" display="flex">
                    <Box marginRight="8px" fontSize="14px" marginTop="2px">This month</Box>
                    <Box
                        width="8px"
                        height="8px"
                        borderRadius="50%"
                        bgcolor="var(--exxpenses-dark-green)"
                    />
                </Box>
                <Box alignItems="center" display="flex">
                    <Box marginRight="8px" fontSize="14px" marginTop="2px">Last month</Box>
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

    let name_content = (
        <>
            <Box display="flex" fontWeight="bold">
                <Box>
                    {currency} {cur_payload!.pv}
                </Box>
                <Box fontWeight="initial" display={cur_payload!.count > 0 ? "initial" : "none"}>
                    &nbsp; {cur_payload!.count} expenses
                </Box>
            </Box>
            <Box>
                {cur_payload!.name}
            </Box>
        </>
    );
    if (lm_daily_totals) {
        let lm_date = name_to_lm_date(cur_payload!.name);
        let lm_date_str = `${lm_date.getDate()}.${lm_date.getMonth() + 1}.${lm_date.getFullYear()}`;

        const now = new Date();
        if (lm_date.getDate() == now.getDate())
            lm_date_str = `Last month, today (${lm_date_str})`;

        name_content = (
            <>
                <Box fontSize="14px" display="flex" fontWeight="bold">
                    <Box>
                        {currency} {cur_payload!.pv}
                    </Box>
                    <Box fontWeight="initial">
                        &nbsp; {cur_payload!.name}
                    </Box>
                    <Box fontWeight="initial" display={cur_payload!.count > 0 ? "initial" : "none"}>
                        &nbsp; {cur_payload!.count} expense(s)
                    </Box>
                </Box>
                <Box fontSize="14px" display="flex" fontWeight="bold">
                    <Box>
                        {currency} {cur_payload!.uv}
                    </Box>
                    <Box fontWeight="initial">
                        &nbsp; {lm_date_str}
                    </Box>
                    <Box fontWeight="initial" display={(cur_payload!.uv_count !== undefined && cur_payload!.uv_count > 0) ? "initial" : "none"}>
                        &nbsp; {cur_payload!.uv_count} expense(s)
                    </Box>
                </Box>
            </>
        )
    }

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
                        bottom: 20,
                    }}
                    onMouseLeave={() => cur_payload_changed(last_payload)}
                >
                    <YAxis tickMargin={8} fontSize="14px" orientation="right" width={maxval_digcnt * 14.5} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursorStyle={{ background: "black" }} />
                    <Area strokeWidth={2} type="monotone" dataKey="uv" stroke="#0088FE" fillOpacity={1} fill="url(#colorUv)" />
                    <Area strokeWidth={2} type="monotone" dataKey="pv" stroke="var(--exxpenses-dark-green)" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}
