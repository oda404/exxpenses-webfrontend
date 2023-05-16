import { Box, Button, CircularProgress, Link } from "@mui/material";
import { Formik, Field, FieldProps, ErrorMessage } from "formik";
import Head from "next/head";
import Footer from "../components/Footer";
import InputField from "../components/InputField";
import useShowMobileView from "../utils/useShowMobileView";
import { useState } from "react";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useMutation } from "@apollo/client";
import { UserRecoverPasswordDocument } from "../generated/graphql";
import BigLogo from "../components/BigLogo";
import Turnstile from "../components/Turnstile";
import { TURNSTILE_MANAGED_KEY } from "../utils/turnstile";

export default function PasswordRecover() {

    const [sent, setSent] = useState(false);
    const [turnstile_payload, set_turnstile_payload] = useState<string | null>(null);
    const [token_error, set_token_error] = useState<string | undefined>(undefined);

    const [userRecoverPassword] = useMutation(UserRecoverPasswordDocument);
    const isMobileView = useShowMobileView();

    const turnstile_verify = async (token: string) => {
        if (turnstile_payload === null)
            return;

        const res = await userRecoverPassword({
            variables: {
                email: turnstile_payload,
                token: token
            }
        });

        if (res.data.userRecoverPassword)
            setSent(true);
        else
            set_token_error("Server error, plase try again. If the error persists, please contact support.");

        set_turnstile_payload(null);
    }

    const turnstile_fail = () => {
        console.log('fail');
    }

    let turnstile = (<></>);
    if (turnstile_payload !== null) {
        turnstile = (
            <Box display={turnstile_payload !== null ? "initial" : "none"} marginLeft="10px">
                <Turnstile sitekey={TURNSTILE_MANAGED_KEY} onError={turnstile_fail} onVerify={turnstile_verify} />
            </Box>
        )
    }

    let header: any;
    if (sent) {
        header = (
            "We've sent you an email!"
        )
    }
    else {
        header = (
            "Forgot your password?"
        )
    }

    let content: any;
    if (sent) {
        content = (
            "If this address has been registered on Exxpenses you will shortly receive an email from us. Make sure to check the spam folder if no email comes in a few minutes."
        )
    }
    else {
        content = (
            "Enter your email address and we'll send you an email so you can create a new one."
        )
    }

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Forgotten password - Exxpenses</title>
                <meta
                    name="description"
                    content="Forgot your email? Let us send you an email, so you can create a new one."
                    key="desc"
                />
            </Head>

            <Box height="100vh" display="flex" marginTop={isMobileView ? "20px" : "100px"} justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="50px"
                    width="100%"
                    borderRadius="8px"
                >
                    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                        <Link href="/">
                            <BigLogo width={120} height={40} />
                        </Link>
                        <Box marginBottom="8px" width={isMobileView ? "100%" : "405px"}>
                            <Box
                                color={'gray.100'}
                                lineHeight={1.1}
                                fontSize="24px"
                                sx={{ marginBottom: "4px" }}
                                textAlign="center"
                            >
                                {header}
                            </Box>
                            <Box textAlign="center">
                                {content}
                            </Box>
                        </Box>
                        <Box width={isMobileView ? "100%" : "405px"}>
                            <Formik
                                initialValues={{ email: "", token: "" }}
                                initialErrors={{ token: token_error }}
                                enableReinitialize={true}
                                onSubmit={async (values, actions) => {

                                    if (!values.email || values.email.length === 0) {
                                        actions.setFieldError("email", "Enter your email address")
                                        return;
                                    }
                                    else if (values.email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "Invalid email address");
                                        return;
                                    }
                                    set_turnstile_payload(values.email);
                                }}
                            >
                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Field name="email">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="14px">
                                                    <InputField readonly={sent} is_error={errors.email !== undefined} field={field} label="Email" name="email" />
                                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="email" />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Field>
                                        <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="token" />
                                        </Box>
                                        <Box marginTop="20px" display="flex" justifyContent="space-between">
                                            <Button href="/login" className="emptyButton">
                                                Back to login
                                            </Button>
                                            <Button sx={{ display: turnstile_payload === null ? "initial !important" : "none !important" }} disabled={sent || isSubmitting} className="fullButton" type="submit">
                                                {
                                                    sent ? <CheckRoundedIcon style={{ marginTop: "2px", width: "20px", height: "20px" }} /> :
                                                        isSubmitting ?
                                                            <CircularProgress style={{ marginTop: "2px", width: "20px", height: "20px" }} /> :
                                                            "Send"
                                                }
                                            </Button>
                                            {turnstile}
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>

                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box >
    )
}

export async function getServerSideProps() {
    return {
        props: {
            ssr: {

            }
        }
    }
}
