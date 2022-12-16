import Decimal from "decimal.js";
import { Expense } from "../generated/graphql";

export interface DailyTotal {
    price: number;
    currency: string;
}

export interface DailyExpenses {
    date: Date;
    expenses: DailyTotal[];
}

export default function expensesToDailyTotals(expenses: Expense[]) {
    let dailyExpenses: DailyExpenses[] = [];

    expenses.forEach(e => {
        const idx = dailyExpenses.findIndex(d => d.date === e.date);

        if (idx === -1) {
            dailyExpenses.push({ date: e.date, expenses: [{ price: e.price, currency: e.currency }] });
        }
        else {
            const dailyIdx = dailyExpenses[idx].expenses.findIndex(d => d.currency === e.currency);
            if (dailyIdx === -1) {
                dailyExpenses[idx].expenses.push({ price: e.price, currency: e.currency });
            }
            else {
                let x = new Decimal(dailyExpenses[idx].expenses[dailyIdx].price);
                let y = new Decimal(e.price);

                dailyExpenses[idx].expenses[dailyIdx].price = x.add(y).toNumber();
            }
        }
    })

    dailyExpenses.sort((a, b) => {
        return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    })

    return dailyExpenses;
}

export function dailyTotalsKeepCurrency(dailyTotals: DailyExpenses[], currency: string) {
    dailyTotals.forEach(d => {
        for (let i = 0; i < d.expenses.length; ++i) {
            if (d.expenses[i].currency !== currency) {
                d.expenses.splice(i, 1);
                --i;
            }
        }
    })

    return dailyTotals;
}
