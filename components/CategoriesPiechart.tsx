import { Box } from "@mui/material";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import CategoryTotal from "../utils/CategoryTotal";

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, currency } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    let content = null;
    let name_pos = 4;
    if (currency !== undefined) {
        content = (
            <>
                <text fontSize=".75rem" x={cx} y={cy} dy={8} textAnchor="middle" fill={"var(--exxpenses-main-color)"}>
                    {currency} {value}
                </text>
                <text fontSize=".75rem" x={cx} y={cy} dy={24} textAnchor="middle" fill={"var(--exxpenses-main-color)"}>
                    {(percent * 100).toFixed(2)}%
                </text>
            </>
        );
        name_pos = -10;
    }

    return (
        <g>
            <text fontSize="1rem" x={cx} y={cy} dy={name_pos} textAnchor="middle" fill={"var(--exxpenses-main-color)"}>
                {payload.name}
            </text>
            {content}
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 4}
                outerRadius={outerRadius + 8}
                fill={fill}
            />
        </g>
    );
};

interface ActiveCategory {
    name: string;
    total: number;
    currency: string;
}

interface CategoriesPiechartProps {
    categoryTotals: CategoryTotal[];
    preferred_currency: string;
}

export default function CategoriesPiechart({ categoryTotals, preferred_currency }: CategoriesPiechartProps) {

    const [state, setState] = useState(0);

    let onPieEnter = (_: any, index: number) => {
        setState(index);
    };

    const data: any[] = [];
    categoryTotals.forEach(ct => {
        if (ct.price === 0)
            return;

        data.push({
            name: ct.category,
            value: ct.price,
            currency: ct.currency,
        })
    })

    let colors: string[] = []
    if (data.length === 0) {
        colors = ["gray"];
        data.push({
            name: "N/A",
            value: 1,
            currency: undefined,
        });
    }
    else {
        colors = ['var(--exxpenses-dark-green)', '#0077FE', '#FFBB28', '#FF8042'];
    }

    return (
        <Box display="flex" alignItems="center" height="210px" width="100%">
            <ResponsiveContainer>
                <PieChart margin={{}}>
                    <Pie
                        activeIndex={state}
                        activeShape={renderActiveShape}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={67}
                        outerRadius={85}
                        fill="var(--exxpenses-light-green)"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        paddingAngle={data.length > 1 ? 5 : 0}
                        stroke="none"
                        animationDuration={1000}
                        onMouseDown={(d, idx, e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </Box>
    )
}
