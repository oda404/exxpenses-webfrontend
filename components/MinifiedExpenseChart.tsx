import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { DailyExpenses } from "../utils/expensesToDaily";

interface MinifiedExpenseChartProps {
    dailyTotals: DailyExpenses[];
    since: Date;
    until: Date;
}

export default function MinifiedExpenseChart({ since, until, dailyTotals }: MinifiedExpenseChartProps) {

    var dates = [];
    for (let d = new Date(since); d <= new Date(until); d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    dates.reverse();

    let plotData: any[] = [];
    if (dailyTotals.length > 0) {
        for (let i = 1; i <= new Date(until).getDate(); ++i) {
            plotData.push({
                name: i,
                pv: 0
            })
        };
    }
    else {
        plotData.push({
            name: 0,
            pv: 0
        })
        plotData.push({
            name: 1,
            pv: 0
        })
    }


    dailyTotals.forEach((e, idx) => {
        if (e.expenses.length === 0)
            return;

        plotData[new Date(e.date).getDate() - 1] = {
            name: e.date,
            pv: e.expenses[0].price,
        }
    })

    return (
        <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={plotData}
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}
