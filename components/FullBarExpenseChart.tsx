import tabHeaderButtonStyles from "../styles/TabHeaderButton.module.css";
import { Backdrop, Box, Button } from "@mui/material";
import { XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import { DailyExpenses } from "../utils/expensesToDaily";
import { useState } from "react";

interface FullBarExpenseChartProps {
    dailyTotals: DailyExpenses[];
    since: Date;
    until: Date;
}

function CustomizedAxisTick({ x, y, stroke, payload }: any) {

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="14px" transform="rotate(-35)">

            </text>
        </g>
    );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div>
                <p className="label">{`${label}`}</p>
            </div>
        );
    }

    return null
}

export default function FullBarExpenseChart({ dailyTotals }: FullBarExpenseChartProps) {

    const [activePeriod, setActivePeriod] = useState("1 Month");

    const now = new Date();
    let since: Date;
    let until: Date;

    switch (activePeriod) {
        case "1 Day":
            {
                since = new Date();
                until = new Date();
                break;
            }

        case "1 Week":
            {
                const days = now.getDate() - 7;
                since = new Date(now.getFullYear(), now.getMonth(), days);
                until = new Date(now);
                break;
            }

        case "1 Month":
            {
                since = new Date(now.getFullYear(), now.getMonth(), 1);
                until = new Date(now);
                break;
            }

        default:
            since = new Date();
            until = new Date();
            break;
    }

    let plotData: any[] = [];
    var dates = [];
    for (let d = new Date(since); d <= new Date(until); d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
        plotData.push({
            name: `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`,
            pv: 0
        })
    }
    dates.reverse();

    dailyTotals.forEach((e, idx) => {
        const d = new Date(e.date);

        if (d < since || d > until)
            return;

        let i = plotData.findIndex(pd => pd.name === `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`);
        plotData[i].pv = e.expense.price
    })

    return (
        <Box>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={plotData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: -15,
                        bottom: 25
                    }}
                >
                    <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis fontSize="8px" dataKey="name" height={10} tick={<CustomizedAxisTick />} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} cursorStyle={{ background: "black" }} />
                    <Area type="monotone" dataKey="pv" stroke="var(--exxpenses-light-green)" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
            </ResponsiveContainer>

            <Box display="flex">
                <Button
                    className={tabHeaderButtonStyles.tabHeaderButton}
                    sx={{
                        background: activePeriod === "1 Day" ? "var(--exxpenses-main-border-color)" : "var(--exxpenses-main-bg-color)",

                        "&:hover": {
                            background: "var( --exxpenses-main-button-hover-bg-color)",
                            textDecoration: "none"
                        },
                        height: "fit-content !important",
                        paddingY: "5px",
                        paddingX: "10px",
                        textDecoration: "none",
                        width: "100%",
                        fontSize: "14px"
                    }}
                    onClick={() => {
                        setActivePeriod("1 Day");
                    }}
                >
                    1 Day
                </Button>
                <Box marginX="5px" />
                <Button
                    className={tabHeaderButtonStyles.tabHeaderButton}
                    sx={{
                        background: activePeriod === "1 Week" ? "var(--exxpenses-main-border-color)" : "var(--exxpenses-main-bg-color)",

                        "&:hover": {
                            background: "var( --exxpenses-main-button-hover-bg-color)",
                            textDecoration: "none"
                        },
                        height: "fit-content !important",
                        paddingY: "5px",
                        paddingX: "10px",
                        textDecoration: "none",
                        width: "100%",
                        fontSize: "14px"
                    }}
                    onClick={() => {
                        setActivePeriod("1 Week");
                    }}
                >
                    1 Week
                </Button>
                <Box marginX="5px" />
                <Button
                    className={tabHeaderButtonStyles.tabHeaderButton}
                    sx={{
                        background: activePeriod === "1 Month" ? "var(--exxpenses-main-border-color)" : "var(--exxpenses-main-bg-color)",

                        "&:hover": {
                            background: "var( --exxpenses-main-button-hover-bg-color)",
                            textDecoration: "none"
                        },
                        height: "fit-content !important",
                        paddingY: "5px",
                        paddingX: "10px",
                        textDecoration: "none",
                        width: "100%",
                        fontSize: "14px"
                    }}
                    onClick={() => {
                        setActivePeriod("1 Month");
                    }}
                >
                    1 Month
                </Button>
                <Box marginX="5px" />
                <Button
                    className={tabHeaderButtonStyles.tabHeaderButton}
                    sx={{
                        background: activePeriod === "Custom" ? "var(--exxpenses-main-border-color)" : "var(--exxpenses-main-bg-color)",

                        "&:hover": {
                            background: "var(--exxpenses-main-bg-color)",
                            textDecoration: "none"
                        },
                        height: "fit-content !important",
                        paddingY: "5px",
                        paddingX: "10px",
                        textDecoration: "none",
                        width: "100%",
                        fontSize: "14px"
                    }}

                >
                    Custom
                    <Backdrop
                        sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)", borderRadius: "8px" }}
                        open={true}
                    />
                </Button>
            </Box>
        </Box>

    )
}
