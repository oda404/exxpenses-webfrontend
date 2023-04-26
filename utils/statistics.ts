import Decimal from "decimal.js";
import { Category, User, Expense } from "../generated/graphql";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "./CategoryTotal";
import expensesToTotal, { TotalExpense } from "./expensesToTotal";

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

export function get_working_expenses(categories_expenses: MultiCategoryExpenses, categories: Category[], user: User) {
    let workingExpenses: Expense[] = [];
    categories_expenses.categories.forEach(category => {

        const tmp = categories?.find(c => c.name === category.name);
        if (!tmp || tmp.default_currency !== user.preferred_currency)
            return;

        workingExpenses.push(...category.expenses);
    });
    return workingExpenses;
}

export function get_categories_totals(categories_expenses: MultiCategoryExpenses, categories: Category[], total: TotalExpense, user: User) {
    let categoryTotals: CategoryTotal[] = [];
    categories_expenses.categories.forEach(c => {
        const category = categories.find(cat => cat.name === c.name)!;
        if (category.default_currency !== user.preferred_currency)
            return;

        categoryTotals.push(expensesToCategoryTotal(c.expenses, category, total.price));
    });

    categoryTotals.sort((a, b) => {
        return b.price - a.price;
    });

    return categoryTotals;
}

