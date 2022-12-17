import { Expense } from "../../generated/graphql";
import expensesGet from "./expensesGet";

export interface CategoryExpenses {
    name: string;
    expenses: Expense[];
}

export interface MultiCategoryExpenses {
    categories: CategoryExpenses[];
}

export default async function expensesGetMultipleCategories(
    req: any,
    categories: string[],
    since?: Date,
    until?: Date
) {

    let multiCategoryExpenses: MultiCategoryExpenses = {
        categories: []
    };

    // FIXME paralelise
    for (let i = 0; i < categories.length; ++i) {
        const category = categories[i];

        const expensesData = await expensesGet(req, category, since, until);
        if (!expensesData.expenses)
            expensesData.expenses = [];

        multiCategoryExpenses.categories.push({
            name: category,
            expenses: expensesData.expenses
        });
    }

    return multiCategoryExpenses;
}
