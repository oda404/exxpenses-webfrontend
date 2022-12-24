

import { Box, Divider } from "@mui/material";
import Decimal from "decimal.js";
import { Category, Expense, User } from "../generated/graphql";
import { CategoryExpenses, MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import CardBox from "./CardBox";
import CategoriesLinechart from "./CategoriesLinechart";
import CategoriesPiechart from "./CategoriesPiechart";
import MobileViewNavigationBar from "./MobileViewNavigationBar";


function expensesToCategoryTotal(expenses: Expense[], category: Category, totalPrice: number) {
    let categoryTotal: CategoryTotal;

    let total = expensesToTotal(expenses, category.default_currency);
    let percentage = Number(new Decimal(100 * total.price / totalPrice).toFixed(2));

    categoryTotal = {
        category: category.name,
        price: total.price,
        currency: total.currency,
        percentage: percentage
    }

    return categoryTotal!;
}

interface OrderedCategoriesProps {
    categoryTotals: CategoryTotal[]
}

function OrderedCategories({ categoryTotals }: OrderedCategoriesProps) {

    categoryTotals.sort((a, b) => {
        return b.price - a.price;
    });

    let content = (
        <Box width="fit-content">
            {categoryTotals.map((c, idx) =>
                <Box key={idx} display="flex">
                    <Box marginBottom="9px" marginRight="6px" borderRadius="8px" width="4px" sx={{ background: "var(--exxpenses-light-green)" }} />
                    <Box marginBottom="12px" width="fit-content">
                        <Box>
                            {c.category}
                        </Box>
                        <b>{c.currency} {c.price}</b> ({c.percentage}%)
                    </Box>
                </Box>
            )}
        </Box>
    )

    return (
        <Box>
            <Box marginBottom="5px">
                Categories
            </Box>
            {content}
        </Box>
    )
}

function Statistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content">
            <Box display="flex">
                <Box marginRight="6px" borderRadius="8px" width="4px" sx={{ background: "var(--exxpenses-light-green)" }} />
                <Box>
                    <Box>
                        {title}
                    </Box>
                    <b>{content}</b>
                </Box>

            </Box>
        </Box>
    )
}

function StatisticsThisMonth({ user, categories, expensesMultipleCategories }: StatisticsTabProps) {

    let workingExpenses: Expense[] = [];
    expensesMultipleCategories.categories.forEach(category => {

        const tmp = categories?.find(c => c.name === category.name);
        if (!tmp || tmp.default_currency !== user.preferred_currency)
            return;

        workingExpenses.push(...category.expenses);
    });

    let total = expensesToTotal(workingExpenses, user.preferred_currency as string);

    let categoryTotals: CategoryTotal[] = [];
    expensesMultipleCategories.categories.forEach(c => {
        categoryTotals.push(expensesToCategoryTotal(c.expenses, categories.find(cat => cat.name === c.name)!, total.price))
    })

    let mostExpensiveCategory: CategoryTotal = categoryTotals[0];
    for (let i = 0; i < categoryTotals.length; ++i) {
        if (categoryTotals[i].price > mostExpensiveCategory.price)
            mostExpensiveCategory = categoryTotals[i];
    }

    return (
        <Box>
            <Box sx={{ marginBottom: "10px", fontSize: "20px" }}>
                <b>Stats this month</b>
            </Box>
            <Box marginBottom="12px">
                <CategoriesPiechart categoryTotals={categoryTotals} />
            </Box>

            <Box marginBottom="14px">
                <Box marginBottom="5px">General statistics</Box>
                <Statistic title="Total" content={`${total.currency} ${total.price}`} />
                <Box marginY="12px" />
                <Statistic title="Most expensive category" content={`${mostExpensiveCategory.category} (${mostExpensiveCategory.currency} ${mostExpensiveCategory.price})`} />
            </Box>

            <Box marginBottom="14px">
                <OrderedCategories categoryTotals={categoryTotals} />
            </Box>
        </Box>
    )
}

interface StatisticsTabProps {
    user: User;
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
}

export default function MobileViewStatisticsTab({ user, categories, expensesMultipleCategories }: StatisticsTabProps) {
    return (
        <Box>
            <MobileViewNavigationBar />
            <CardBox>
                <StatisticsThisMonth user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />
            </CardBox>
        </Box>
    )
}

