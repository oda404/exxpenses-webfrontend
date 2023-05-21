import Decimal from "decimal.js";
import { DailyExpenses } from "./expensesToDaily";
import dayjs from "dayjs";

export default function daily_totals_to_cumulative(daily_totals: DailyExpenses[], until: Date) {
    let running = new Decimal(0);
    let tmp_daily_expenses: DailyExpenses[] = [];

    for (let i = 0; i < daily_totals.length; ++i) {
        running = running.add(new Decimal(daily_totals[i].expense.price));

        let e = daily_totals[i];
        e.expense.price = running.toNumber();
        tmp_daily_expenses.push(e);

        if (i < daily_totals.length - 1) {
            let d1 = new Date(e.date);
            let d2 = new Date(daily_totals[i + 1].date);
            d1.setDate(d1.getDate() + 1);
            d2.setDate(d2.getDate() - 1);

            for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1))
                tmp_daily_expenses.push({ date: new Date(d), expense_count: 0, expense: { currency: e.expense.currency, price: e.expense.price } })
        }
    }

    let last_expense = tmp_daily_expenses[tmp_daily_expenses.length - 1];
    if (last_expense === undefined)
        return tmp_daily_expenses;

    let last_registered_day = dayjs(new Date(last_expense.date)).add(1, "day").hour(0);
    let last_day = dayjs(until);

    for (let d = last_registered_day; d <= last_day; d = d.add(1, "day"))
        tmp_daily_expenses.push({ date: d.toDate(), expense_count: 0, expense: last_expense.expense });

    return tmp_daily_expenses;
}
