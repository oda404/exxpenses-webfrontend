import { Category, ExpenseTotalCostMultiple } from "../generated/graphql";


export default function totalCostsKeepCurrency(
    totalCosts?: ExpenseTotalCostMultiple[] | null,
    categories?: Category[]
) {
    if (!totalCosts)
        return [];

    if (!categories)
        return totalCosts;

    totalCosts.forEach(totals => {
        let category = categories.find(c => c.name === totals.category_name);
        if (!category)
            return;

        for (let i = 0; i < totals.total.length; ++i) {
            if (totals.total[i].currency !== category?.default_currency) {
                totals.total.splice(i, 1);
                --i;
            }
        }
    })

    return totalCosts;
}
