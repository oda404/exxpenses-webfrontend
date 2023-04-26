
import Decimal from "decimal.js";
import { Expense } from "../generated/graphql";

export interface TotalExpense {
    currency: string;
    price: number;
}

export default function expensesToTotal(expenses: Expense[], currency: string, until?: Date) {

    let totalExpenses: TotalExpense | undefined = undefined;

    expenses.forEach(e => {
        if (e.currency !== currency)
            return;

        if (until !== undefined && new Date(e.date) > until) {
            return;
        }

        if (totalExpenses === undefined) {
            totalExpenses = {
                currency: e.currency,
                price: e.price
            }
        }
        else {
            let x = new Decimal(totalExpenses.price);
            let y = new Decimal(e.price);
            totalExpenses.price = x.add(y).toNumber();
        }
    });

    if (totalExpenses === undefined) {
        totalExpenses = {
            currency: currency,
            price: 0
        }
    }

    return totalExpenses;
}
