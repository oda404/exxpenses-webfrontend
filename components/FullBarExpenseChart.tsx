import { Box } from "@mui/material";
import { Area, AreaChart, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Bar, CartesianGrid, Legend, Line, LineChart } from "recharts";
import { DailyExpenses } from "../utils/expensesToDaily";

interface FullBarExpenseChartProps {
    dailyTotals: DailyExpenses[];
    since: Date;
    until: Date;
}

function CustomizedAxisTick({ x, y, stroke, payload }: any) {

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="14px" transform="rotate(-35)">
                {payload.value}
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

export default function FullBarExpenseChart({ since, until, dailyTotals }: FullBarExpenseChartProps) {

    let plotData: any[] = [];
    var dates = [];
    for (let d = new Date(since); d <= new Date(until); d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
        plotData.push({
            name: new Date(d).toISOString().slice(0, 10),
            pv: 0
        })
    }
    dates.reverse();

    dailyTotals.forEach((e, idx) => {
        if (e.expenses.length === 0)
            return;

        plotData[new Date(e.date).getDate() - 1] = {
            name: new Date(e.date).toISOString().slice(0, 10),
            pv: e.expenses[0].price,
        }
    })

    return (
        <Box>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={plotData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                    }}
                >
                    <XAxis fontSize="8px" dataKey="name" height={80} tick={<CustomizedAxisTick />} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} cursorStyle={{ background: "black" }} />
                    <Line type="monotone" dataKey="pv" stroke="var(--exxpenses-light-green)" />
                </LineChart>
            </ResponsiveContainer>

        </Box>

    )
}
