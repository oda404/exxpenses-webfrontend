

import currency_data from "./currencies.json";

export const currencies = Object.entries(currency_data).map(([key, value]) => {
    return { name: `${key} (${value.name})`, value: key }
});
