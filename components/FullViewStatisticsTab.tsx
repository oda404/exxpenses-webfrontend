

import { Box } from "@mui/material";
import Decimal from "decimal.js";
import { Category, Expense, User } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal from "../utils/expensesToTotal";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";
import Sidenav from "./Sidenav";
import OrderedCategories from "./OrderedCategories";
import StatisticsThisMonth from "./StatisticsGeneral";

function expensesToCategoryTotal(expenses: Expense[], category: Category, totalPrice: number) {
    let categoryTotal: CategoryTotal;

    let total = expensesToTotal(expenses, category.default_currency);

    let percentage = 0;
    if (total.price > 0)
        percentage = Number(new Decimal(100 * total.price / totalPrice).toFixed(2));

    categoryTotal = {
        category: category.name,
        price: total.price,
        currency: total.currency,
        percentage: percentage
    }

    return categoryTotal!;
}

function SideTab({ user, categoryTotals }: { user: User, categoryTotals: CategoryTotal[] }) {
    return (
        <Box borderRadius="8px" border="1px solid var(--exxpenses-main-border-color)" width="260px" height="fit-content">
            <CardBox>
                <Box fontSize='.875rem'>
                    <b>Piechart</b>
                    <Box fontSize=".75rem">
                        This month&apos;s expenses piechart
                    </Box>
                </Box>
                <CategoriesPiechart preferred_currency={user.preferred_currency!} categoryTotals={categoryTotals} />
            </CardBox>
        </Box>
    )
}

interface StatisticsTabProps {
    user: User;
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
}

export default function FullViewStatisticsTab({ user, categories, expensesMultipleCategories }: StatisticsTabProps) {

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
        <Box display="flex" justifyContent="center" marginTop="40px">
            <Sidenav firstname={user.firstname} lastname={user.lastname} />
            <Box width="540px" display="flex" flexDirection="column" alignItems="center">
                <CardBox width="540px">
                    <StatisticsThisMonth
                        user={user}
                        categoryTotals={categoryTotals}
                        categories={categories}
                        expensesMultipleCategories={expensesMultipleCategories}
                        total={total}
                    />
                </CardBox>
                <Box marginY="5px" />
                <CardBox width="540px">
                    <OrderedCategories
                        expensesMultipleCategories={expensesMultipleCategories}
                        categoryTotals={categoryTotals}
                    />
                </CardBox>
            </Box>
            <Box marginX="10px" />
            <SideTab user={user} categoryTotals={categoryTotals} />
            {/* <NewsTab user={user} /> */}
        </Box>
    )
}
