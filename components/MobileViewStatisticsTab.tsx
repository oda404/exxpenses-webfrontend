

import { Box, Link } from "@mui/material";
import Decimal from "decimal.js";
import { Category, Expense, User } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal from "../utils/expensesToTotal";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";
import MobileViewNavigationBar from "./MobileViewNavigationBar";
import WarningIcon from '@mui/icons-material/Warning';

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

function OrderedCategories({ user, categories, expensesMultipleCategories }: StatisticsTabProps) {

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

    let content = (
        <Box width="fit-content">
            {categoryTotals.map((c, idx) =>
                <Link
                    sx={{
                        textDecoration: "none",
                        "&:hover": {
                            textDecoration: "none",
                        }
                    }}
                    href={`/category/${c.category}`}
                    key={idx}
                    display="flex"
                >
                    <Box marginBottom="9px" marginRight="6px" borderRadius="8px" width="4px" sx={{ background: "var(--exxpenses-light-green)" }} />
                    <Box marginBottom="12px" width="fit-content">
                        <Box>
                            {c.category}
                        </Box>
                        <b>{c.currency} {c.price}</b> ({c.percentage}%)
                    </Box>
                </Link>
            )}
        </Box>
    )

    let notice: any = null;
    if (categoryTotals.length < expensesMultipleCategories.categories.length) {
        notice = (
            <Box alignItems="center" display="flex" marginTop="10px">
                <WarningIcon sx={{ width: "20px", height: "20px", fill: "var(--exxpenses-warning-color)" }} />
                <Link
                    marginLeft="10px"
                    fontSize="14px"
                    sx={{
                        color: "var(--exxpenses-warning-color)",
                        textDecoration: "none",
                        "&:hover": {
                            textDecoration: "none"
                        }
                    }}
                    href="/free-account"
                >
                    Some categories are missing. Click to learn more.
                </Link>
            </Box>
        )
    }

    return (
        <Box>
            <Box marginBottom="5px">
                Categories
            </Box>
            {content}
            {notice}
        </Box>
    )
}

function Statistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content" borderBottom="1px solid var(--exxpenses-main-border-color)">
            <Box fontSize="14px">
                {title}
            </Box>
            <Box fontSize="14px">
                <b>{content}</b>
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
        const category = categories.find(cat => cat.name === c.name)!;
        if (category.default_currency !== user.preferred_currency)
            return;

        categoryTotals.push(expensesToCategoryTotal(c.expenses, category, total.price))
    })

    let mostExpensiveCategory: CategoryTotal = categoryTotals[0];
    for (let i = 0; i < categoryTotals.length; ++i) {
        if (categoryTotals[i].price > mostExpensiveCategory.price)
            mostExpensiveCategory = categoryTotals[i];
    }

    return (
        <Box>
            <Box sx={{ marginBottom: "10px", fontSize: "18px" }}>
                <b>Stats this month</b>
            </Box>
            <Box marginBottom="12px">
                <CategoriesPiechart categoryTotals={categoryTotals} />
            </Box>

            <Box>
                <Box marginBottom="5px">General statistics</Box>
                <Statistic title="Total" content={`${total.currency} ${total.price}`} />
                <Box marginY="12px" />
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
        <Box padding="10px" marginTop="28px">
            <MobileViewNavigationBar />
            <Box marginY='10px' />
            <CardBox>
                <StatisticsThisMonth user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />
            </CardBox>
            <Box marginY='10px' />
            <CardBox>
                <OrderedCategories user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />
            </CardBox>
        </Box>
    )
}

