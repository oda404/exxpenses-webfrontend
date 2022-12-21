

import { Box, Divider } from "@mui/material";
import Decimal from "decimal.js";
import { Category, Expense, User } from "../generated/graphql";
import { CategoryExpenses, MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";


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

    let content = (
        <Box width="fit-content">
            {categoryTotals.map(c =>
                <Box display="flex">
                    <Box marginBottom="9px" marginRight="5px" width="4px" sx={{ background: "var(--exxpenses-light-green)" }} />
                    <Box borderBottom="1px solid var(--exxpenses-main-border-color)" marginBottom="10px" width="fit-content">
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
        <Box sx={{ background: "var(--exxpenses-main-bg-color)" }} paddingX="12px" paddingY="8px" borderRadius="8px">
            <Box marginBottom="5px">
                Categories sorted by most expensive
            </Box>
            {content}
        </Box>
    )
}

function Statistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content">
            <Box display="flex">
                <Box marginRight="5px" width="4px" sx={{ background: "var(--exxpenses-light-green)" }} />
                <Box borderBottom="1px solid var(--exxpenses-main-border-color)">
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
            <Box marginBottom="10px">Stats for this month</Box>
            <Box marginBottom="10px">
                <CategoriesPiechart categoryTotals={categoryTotals} />
                <OrderedCategories categoryTotals={categoryTotals} />
            </Box>
            <Box sx={{ background: "var(--exxpenses-main-bg-color)" }} paddingX="12px" paddingY="8px" borderRadius="8px">
                <Box marginBottom="5px">General statistics</Box>
                <Statistic title="Total" content={`${total.currency} ${total.price}`} />
                <Box marginY="10px" />
                <Statistic title="Most expensive category" content={`${mostExpensiveCategory.category} (${mostExpensiveCategory.currency} ${mostExpensiveCategory.price})`} />

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
            <Box display="flex">
                <CardBox width="100%">
                    <StatisticsThisMonth user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />
                </CardBox>
            </Box>
        </Box>
    )
}

