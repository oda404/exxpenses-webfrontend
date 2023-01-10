

import { Box, Link } from "@mui/material";
import Decimal from "decimal.js";
import { Category, Expense, User } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal from "../utils/expensesToTotal";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";
import MobileViewNavigationBar from "./MobileViewNavigationBar";
import OrderedCategories from "./OrderedCategories";
import StatisticsThisMonth from "./StatisticsGeneral";

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

function PiechartCard({ user, categoryTotals }: { user: User, categoryTotals: CategoryTotal[] }) {
    return (
        <Box>
            <Box fontSize='22px'>
                Piechart
                <Box fontSize=".75rem">
                    This month's expenses piechart
                </Box>
            </Box>
            <CategoriesPiechart preferred_currency={user.preferred_currency!} categoryTotals={categoryTotals} />
        </Box>
    )
}

interface StatisticsTabProps {
    user: User;
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
}

export default function MobileViewStatisticsTab({ user, categories, expensesMultipleCategories }: StatisticsTabProps) {

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
        const category = categories.find(cat => cat.name === c.name)!;
        if (category.default_currency !== user.preferred_currency)
            return;

        categoryTotals.push(expensesToCategoryTotal(c.expenses, category, total.price))
    })

    categoryTotals.sort((a, b) => {
        return b.price - a.price;
    });

    return (
        <Box padding="10px" marginTop="28px">
            <MobileViewNavigationBar />
            <Box marginY='10px' />
            <CardBox>
                <StatisticsThisMonth
                    user={user}
                    categoryTotals={categoryTotals}
                    categories={categories}
                    expensesMultipleCategories={expensesMultipleCategories}
                    total={total}
                />
            </CardBox>
            <Box marginY='10px' />
            <CardBox>
                <PiechartCard user={user} categoryTotals={categoryTotals} />
            </CardBox>
            <Box marginY='10px' />
            <CardBox>
                <OrderedCategories
                    expensesMultipleCategories={expensesMultipleCategories}
                    categoryTotals={categoryTotals}
                />
            </CardBox>
        </Box>
    )
}

