import { Box, Divider } from "@mui/material";
import Decimal from "decimal.js";
import { Category, Expense, User } from "../generated/graphql";
import { CategoryExpenses, MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal, { TotalExpense } from "../utils/expensesToTotal";
import useShowMobileView from "../utils/useShowMobileView";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";
import MobileViewStatisticsTab from "./MobileViewStatisticsTab";


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
                <Box width="fit-content">
                    {c.category} <b>{c.currency} {c.price}</b> ({c.percentage}%)
                </Box>
            )}
        </Box>
    )

    return (
        <Box width="fit-content">
            {content}
        </Box>
    )
}

function Statistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content" borderBottom="1px solid var(--exxpenses-main-border-color)" marginTop="20px">
            <Box>
                {title}
            </Box>
            <Box>
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
        categoryTotals.push(expensesToCategoryTotal(c.expenses, categories.find(cat => cat.name === c.name)!, total.price))
    })

    return (
        <Box>
            <Box marginBottom="10px">Stats for this month</Box>
            <Box display="flex">
                <OrderedCategories categoryTotals={categoryTotals} />
                <CategoriesPiechart categoryTotals={categoryTotals} />
            </Box>
            <Divider sx={{ width: "100%", height: "1px", background: "var(--exxpenses-main-border-color)" }} />
            <Statistic title="Total" content={`${total.currency} ${total.price}`} />
        </Box>
    )
}

interface StatisticsTabProps {
    user: User;
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
}

export default function StatisticsTab({ user, categories, expensesMultipleCategories }: StatisticsTabProps) {

    const isMobileView = useShowMobileView();

    let content: any;
    if (isMobileView)
        content = <MobileViewStatisticsTab user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />
    else
        content = <Box></Box>

    return (
        <Box>
            {content}
        </Box>
    )
}
