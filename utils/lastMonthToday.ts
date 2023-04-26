

export default function last_month_today(today: Date) {
    let lm_max_days = new Date(today.getFullYear(), today.getMonth() - 1, 0).getDate();

    let lm_capped_day = today.getDate();
    if (lm_capped_day > lm_max_days)
        lm_capped_day = lm_max_days;

    return new Date(today.getFullYear(), today.getMonth() - 1, lm_capped_day);
}
