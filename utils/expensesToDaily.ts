
import Decimal from "decimal.js";
import { Expense } from "../generated/graphql";

export interface DailyTotal {
    price: number;
    currency: string;
}

export interface DailyExpenses {
    date: Date;
    expense: DailyTotal;
}

export default function expensesToDailyTotals(expenses: Expense[], currency: string) {
    let dailyExpenses: DailyExpenses[] = [];

    expenses.forEach(e => {
        if (e.currency !== currency)
            return;

        const idx = dailyExpenses.findIndex(d => d.date === e.date);

        if (idx === -1) {
            dailyExpenses.push({ date: e.date, expense: { price: e.price, currency: e.currency } });
        }
        else {
            let x = new Decimal(dailyExpenses[idx].expense.price);
            let y = new Decimal(e.price);

            dailyExpenses[idx].expense.price = x.add(y).toNumber();
        }
    })

    dailyExpenses.sort((a, b) => {
        return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    });

    return dailyExpenses;
}
