import { Box } from "@mui/material";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import CategoryTotal from "../utils/CategoryTotal";

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, currency, setActiveCategory } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    setActiveCategory(payload.name)

    return (
        <g>
            <text x={cx} y={cy} dy={-14} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <text fontSize="13px" x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {currency} {value}
            </text>
            <text fontSize="13px" x={cx} y={cy} dy={24} textAnchor="middle" fill={fill}>
                {(percent * 100).toFixed(2)}%
            </text>
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
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#ddd">{`${currency} ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}% of total)`}
            </text> */}
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
}

export default function CategoriesPiechart({ categoryTotals }: CategoriesPiechartProps) {

    const [state, setState] = useState(0);

    let onPieEnter = (_: any, index: number) => {
        setState(index);
    };

    const [activeCategory, setActiveCategory] = useState("");

    const data: any[] = [];
    categoryTotals.forEach(ct => {
        if (ct.price === 0)
            return;

        data.push({
            name: ct.category,
            value: ct.price,
            currency: ct.currency,
            setActiveCategory: setActiveCategory
        })
    })

    const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

    const category: ActiveCategory = {
        name: activeCategory,
        total: data.find(d => d.name === activeCategory)?.value,
        currency: data.find(d => d.name === activeCategory)?.currency
    }

    return (
        <Box>
            {/* <Box>{category.name}: <b>{category.currency} {category.total}</b></Box> */}

            <Box display="flex" alignItems="center" height="220px" width="100%">
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart margin={{ bottom: 20 }}>
                        <Pie
                            activeIndex={state}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="var(--exxpenses-light-green)"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            paddingAngle={data.length > 1 ? 5 : 0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </Box >
        </Box>

    )
}
