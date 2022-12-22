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
