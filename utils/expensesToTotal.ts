
import Decimal from "decimal.js";
import { Expense } from "../generated/graphql";

export interface TotalExpense {
    currency: string;
    price: number;
}

export default function expensesToTotal(expenses: Expense[], currency?: string) {

    let totalExpenses: TotalExpense[] = [];
    expenses.forEach(e => {
        const idx = totalExpenses.findIndex(t => t.currency === e.currency);

        if (idx === -1) {
            totalExpenses.push({ currency: e.currency, price: e.price });
        }
        else {

            let x = new Decimal(totalExpenses[idx].price);
            let y = new Decimal(e.price);
            totalExpenses[idx].price = x.add(y).toNumber();
        }
    })

    if (currency) {
        for (let i = 0; i < totalExpenses.length; ++i) {
            if (totalExpenses[i].currency !== currency) {
                totalExpenses.splice(i, 1);
                --i;
            }
        }
    }

    return totalExpenses;
}
