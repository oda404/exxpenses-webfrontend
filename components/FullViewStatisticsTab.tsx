

import { Box } from "@mui/material";
import { Category, Expense, User } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal from "../utils/expensesToTotal";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";
import Sidenav from "./Sidenav";
import OrderedCategories from "./OrderedCategories";
import StatisticsThisMonth from "./StatisticsGeneral";
import { get_working_expenses, get_categories_totals } from "../utils/statistics";
import NewsTab from "./NewsTab";

function SideTab({ user, categoryTotals }: { user: User, categoryTotals: CategoryTotal[] }) {
    return (
        <NewsTab user={user}>
            <CardBox>
                <Box fontSize='.875rem'>
                    <b>Piechart</b>
                    <Box fontSize=".75rem">
                        This month&#39;s category piechart
                    </Box>
                </Box>
                <CategoriesPiechart preferred_currency={user.preferred_currency!} categoryTotals={categoryTotals} />
            </CardBox>
        </NewsTab>
    )
}

interface StatisticsTabProps {
    user: User;
    categories: Category[];
    expensesMultipleCategories: MultiCategoryExpenses;
    last_month_categories: MultiCategoryExpenses;
}

export default function FullViewStatisticsTab({ user, categories, expensesMultipleCategories, last_month_categories }: StatisticsTabProps) {

    let working_expenses = get_working_expenses(expensesMultipleCategories, categories, user);
    let total = expensesToTotal(working_expenses, user.preferred_currency as string);
    let categories_totals = get_categories_totals(expensesMultipleCategories, categories, total, user);

    let lm_working_expenses = get_working_expenses(last_month_categories, categories, user);
    let lm_total = expensesToTotal(lm_working_expenses, user.preferred_currency as string);
    // let lm_categories_totals = get_categories_totals(last_month_categories, categories, lm_total, user);

    return (
        <Box display="flex" justifyContent="center" marginTop="40px">
            <Sidenav />
            <Box width="540px" display="flex" flexDirection="column" alignItems="center">
                <CardBox width="540px">
                    <StatisticsThisMonth
                        user={user}
                        working_expenses={working_expenses}
                        total={total}
                        categoryTotals={categories_totals}
                        lm_total={lm_total}
                        lm_working_expenses={lm_working_expenses}
                    />
                </CardBox>
                <Box marginY="5px" />
                <CardBox width="540px">
                    <OrderedCategories
                        total_price={total.price}
                        expensesMultipleCategories={expensesMultipleCategories}
                        categoryTotals={categories_totals}
                    />
                </CardBox>
            </Box>
            <Box marginX="10px" />
            <SideTab user={user} categoryTotals={categories_totals} />
        </Box>
    )
}
