import { Box } from "@mui/material";
import { Category, User } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import expensesToTotal from "../utils/expensesToTotal";
import { get_working_expenses, get_categories_totals } from "../utils/statistics";
import CardBox from "./CardBox";
import CategoriesPiechart from "./CategoriesPiechart";
import MobileViewNavigationBar from "./MobileViewNavigationBar";
import OrderedCategories from "./OrderedCategories";
import StatisticsThisMonth from "./StatisticsGeneral";
import NewsTab from "./NewsTab";

function PiechartCard({ user, categoryTotals }: { user: User, categoryTotals: CategoryTotal[] }) {
    return (
        <Box>
            <Box fontSize='22px'>
                Piechart
                <Box fontSize=".75rem">
                    This month&#39;s category piechart
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
    last_month_categories: MultiCategoryExpenses;
    showing_since: Date;
    showing_until: Date;
    compare_since: Date;
    compare_until: Date;
    custom_period: boolean;
}

export default function MobileViewStatisticsTab({ user, categories, expensesMultipleCategories, last_month_categories, showing_since,
    showing_until, compare_since, compare_until, custom_period }: StatisticsTabProps) {

    let working_expenses = get_working_expenses(expensesMultipleCategories, categories, user);
    let total = expensesToTotal(working_expenses, user.preferred_currency as string);
    let categories_totals = get_categories_totals(expensesMultipleCategories, categories, total, user);

    let lm_working_expenses = get_working_expenses(last_month_categories, categories, user);
    let lm_total = expensesToTotal(lm_working_expenses, user.preferred_currency as string);
    let lm_categories_totals = get_categories_totals(last_month_categories, categories, lm_total, user);

    return (
        <Box minHeight="100vh" padding="10px" marginTop="28px">
            <MobileViewNavigationBar />
            <NewsTab user={user} banner_mode />
            <Box marginY='10px' />
            <CardBox>
                <StatisticsThisMonth
                    user={user}
                    working_expenses={working_expenses}
                    total={total}
                    categoryTotals={categories_totals}
                    lm_total={lm_total}
                    lm_working_expenses={lm_working_expenses}
                    showing_since={new Date(showing_since)}
                    showing_until={new Date(showing_until)}
                    compare_since={new Date(compare_since)}
                    compare_until={new Date(compare_until)}
                    custom_period={custom_period}
                />
            </CardBox>
            <Box marginY='10px' />
            <CardBox>
                <PiechartCard user={user} categoryTotals={categories_totals} />
            </CardBox>
            <Box marginY='10px' />
            <CardBox>
                <OrderedCategories
                    total_price={total.price}
                    expensesMultipleCategories={expensesMultipleCategories}
                    categoryTotals={categories_totals}
                    lm_category_totals={lm_categories_totals}
                />
            </CardBox>
        </Box>
    )
}
