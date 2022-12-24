import { Box } from "@mui/material";
import { Category, User } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import useShowMobileView from "../utils/useShowMobileView";
import FullViewStatisticsTab from "./FullViewStatisticsTab";
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
        content = <FullViewStatisticsTab user={user} categories={categories} expensesMultipleCategories={expensesMultipleCategories} />

    return (
        <Box>
            {content}
        </Box>
    )
}
