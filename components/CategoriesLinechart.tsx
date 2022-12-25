import { Box } from "@mui/material";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Expense } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import expensesToDailyTotals from "../utils/expensesToDaily";

function CustomizedAxisTick({ x, y, stroke, payload }: any) {
    console.log(payload)
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="14px" transform="rotate(0)">
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

interface CategoriesLinechartProps {
    expensesMultipleCategories: MultiCategoryExpenses;
    preferred_currency: string;
}

export default function CategoriesLinechart({ preferred_currency, expensesMultipleCategories }: CategoriesLinechartProps) {

    let expenses: Expense[] = [];
    expensesMultipleCategories.categories.forEach(c => {
        expenses.push(...c.expenses)
    });

    let dailyExpenses = expensesToDailyTotals(expenses, preferred_currency);

    let plotData: any[] = [];
    dailyExpenses.forEach(e => {
        plotData.push({
            name: e.date,
            pv: e.expense.price,
            currency: e.expense.currency
        })
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
                    <XAxis fontSize="8px" dataKey="name" height={40} tick={<CustomizedAxisTick />} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} cursorStyle={{ background: "black" }} />
                    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    )
}
