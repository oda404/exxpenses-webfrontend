
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { DEV_REST_API_URI, PROD_REST_API_URI } from "./rest";

const live_key = "pk_live_51NBc9rEb8Qqtk4l9AFIQoPz4VODsVfdCPvucu1RgDPlcfG2xFOfEzf4w7uZ85JtaulJWv6moD54pudSXoRrTVJcP00oTFi0Cg8";
const test_key = "pk_test_51NBc9rEb8Qqtk4l9RM85t1iDtK6cyga3cZc8QtkgqmItlvdne9nBLfjMWxkKZkSK6iq0bjKRwmQiLksvpYbZ0FX200nuLrQtDa";
let pub_key = process.env.NODE_ENV === "production" ? live_key : test_key;

export const stripe_premium_price_id = process.env.NODE_ENV === "production" ? "price_1NBcSaEb8Qqtk4l9LVeUZcgI" : "price_1NBcc8Eb8Qqtk4l9rcpIcP8B";

let stripe_promise: Promise<Stripe | null> | null = null;
const get_stripe = () => {
    if (stripe_promise === null)
        stripe_promise = loadStripe(pub_key);
    return stripe_promise;
}

export async function stripe_get_client_secret(email: string, price_id: string) {
    const res = await fetch(
        process.env.NODE_ENV === "production" ? `${PROD_REST_API_URI}/create-subscribe-intent` : `${DEV_REST_API_URI}/create-subscribe-intent`,
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, price_id: price_id })
        }
    );

    return (await res.json())["client_secret"];
}

export default get_stripe;
