import Head from "next/head";
import Footer from "../components/Footer";
import Topbar from "../components/Topbar";
import { User } from "../generated/graphql";
import { Box, Button, CircularProgress } from "@mui/material";
import userGet from "../gql/ssr/userGet";
import { InferGetServerSidePropsType } from "next";
import get_stripe from "../utils/stripe";
import { useEffect, useState } from "react";
import { PaymentIntentResult } from "@stripe/stripe-js";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Decimal from "decimal.js";

function PaymentStatusContent({ status, cs, id }: { status: string, cs: string, id: string }) {

    const [payment_res, set_payment_res] = useState<PaymentIntentResult | undefined>(undefined);

    useEffect(() => {
        get_stripe().then((s) => {
            s?.retrievePaymentIntent(cs).then((res) => {
                set_payment_res(res);
                console.log(res);
            })
        })
    }, []);

    let content: any;
    if (status === "failed") {
        content = (
            <>
                <CancelIcon sx={{ width: "40px", height: "40px", fill: "var(--exxpenses-main-error-color)" }} />
                <Box fontSize="22px">
                    <b>Failed</b>
                </Box>
                <Box fontSize="18px">
                    Unfortunately the payment was rejected
                </Box>
                <Box marginTop="10px" fontSize="12px">
                    Reason: {payment_res ? payment_res?.paymentIntent?.last_payment_error?.message : <CircularProgress style={{ width: "16px", height: "16px" }} />}
                </Box>
                <Button href="/plans" sx={{ width: "fit-content !important", marginTop: "15px" }} className="fullButton">
                    Back to plans
                </Button>
            </>
        )
    }
    else if (status === "succeeded") {
        content = (
            <>
                <CheckCircleIcon sx={{ width: "60px", height: "60px", fill: "var(--exxpenses-light-green)" }} />
                <Box fontWeight="bold" color="var(--exxpenses-lighter-green)" fontSize="22px">
                    Payment Successful!
                </Box>
                <Box>Your subscription may take a minute to active.</Box>
                <Box marginTop="4px" fontSize="12px">
                    Payment id: {id}
                </Box>
                {payment_res && (<Box marginTop="10px" width="100%">
                    <Box display="flex" justifyContent="space-between">
                        <Box>
                            Amount paid:
                        </Box>
                        <Box>
                            ${new Decimal(payment_res?.paymentIntent?.amount!).div(100).toNumber()}
                        </Box>
                    </Box>
                    <Box>

                    </Box>
                </Box>)}
                <Button href="/dashboard" sx={{ width: "100% !important", marginTop: "15px" }} className="fullButton">
                    Back to dashboard
                </Button>
            </>
        )
    }


    return (
        <Box sx={{ minHeight: "100vh", width: "990px" }}>
            <Box marginX="auto" width="fit-content" marginTop="40px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                {content}
            </Box>
        </Box>
    )
}

type PaymentStatusProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PaymentStatus({ ssr }: PaymentStatusProps) {

    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
            <Head>
                <title>{`Payment ${ssr.status} | Exxpenses`}</title>
                <meta
                    name="description"
                    content="Payment status for your purchase."
                    key="desc"
                />
            </Head>

            <Box>
                <Topbar user={ssr.userGet.user ? ssr.userGet.user as User : undefined} />
                <Box padding="10px" paddingY="40px" marginX="auto" maxWidth="990px" justifyContent="center" display="flex">
                    <PaymentStatusContent id={ssr.id} status={ssr.status} cs={ssr.cs} />
                    {/* <PlansContent user={ssr.userGet.user ? ssr.userGet.user as User : undefined} /> */}
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req, query }: any) {
    const userData = await userGet(req);
    if (userData.user === null) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }

    let status = query.redirect_status;
    if (query.redirect_status === undefined)
        status = "unexpected";

    let cs = query.payment_intent_client_secret;
    if (cs === undefined) {
        return {
            redirect: {
                permanent: false,
                destination: "/plans"
            }
        }
    }

    let id = query.payment_intent;
    if (id === undefined) {
        return {
            redirect: {
                permanent: false,
                destination: "/plans"
            }
        }
    }

    return {
        props: {
            ssr: {
                userGet: userData,
                status: status,
                cs: cs,
                id: id
            }
        }
    }
}
