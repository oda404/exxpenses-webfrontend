import { Box } from "@mui/material";
import { User, Category } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import { TotalExpense } from "../utils/expensesToTotal";

function Statistic({ title, content }: { title: string; content: string }) {
    return (
        <Box width="fit-content">
            <Box fontSize="1rem">
                <b>{content}</b>
            </Box>
            <Box fontSize=".75rem">
                {title}
            </Box>
        </Box>
    )
}

interface StatisticsThisMonthProps {
    user: User;
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
    categoryTotals: CategoryTotal[];
    total: TotalExpense;
}

export default function StatisticsThisMonth({ user, categoryTotals, total, categories, expensesMultipleCategories }: StatisticsThisMonthProps) {

    let mostExpensiveCategory: CategoryTotal = categoryTotals[0];
    for (let i = 0; i < categoryTotals.length; ++i) {
        if (categoryTotals[i].price > mostExpensiveCategory.price)
            mostExpensiveCategory = categoryTotals[i];
    }
    if (mostExpensiveCategory === undefined) {
        mostExpensiveCategory = {
            category: "N/A",
            price: 0,
            currency: user.preferred_currency!,
            percentage: 0
        }
    }

    return (
        <Box>
            <Box sx={{ marginBottom: "10px", fontSize: "22px" }}>
                General statistics
            </Box>

            {/* <Box>
                <CategoriesPiechart preferred_currency={user.preferred_currency!} categoryTotals={categoryTotals} />
            </Box> */}

            <Box display="flex">
                <Statistic title="Total" content={`${total.currency} ${total.price}`} />
                <Box height="auto" width="1px" bgcolor="var(--exxpenses-main-border-color)" marginX="10px" />
                <Statistic title="Most expensive category" content={`${mostExpensiveCategory?.category} (${mostExpensiveCategory?.currency} ${mostExpensiveCategory?.price})`} />
            </Box>
        </Box>
    )
}