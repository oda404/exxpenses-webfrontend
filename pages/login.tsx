
import { useMutation } from "@apollo/client";
import { UserLoginDocument } from "../generated/graphql";
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import InputField from "../components/InputField";
import { InferGetServerSidePropsType } from "next";
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import styles from "../styles/Login.module.css";
import { CircularProgress } from "@mui/material";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";
import Head from "next/head";
import Cookies from "universal-cookie";
import userGet from "../gql/ssr/userGet";
import BigLogo from "../components/BigLogo";
import { useState } from "react";
import Turnstile from "../components/Turnstile";
import { TURNSTILE_MANAGED_KEY } from "../utils/turnstile";

interface UserInfo {
    email: string;
    password: string;
}

type LoginProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Login({ }: LoginProps) {

    const [turnstile_payload, set_turnstile_payload] = useState<UserInfo | null>(null);
    const [error, set_error] = useState<string | undefined>(undefined);
    const [token_error, set_token_error] = useState<string | undefined>(undefined);

    const [userLogin] = useMutation(UserLoginDocument);
    const isMobileView = useShowMobileView();

    const turnstile_verify = async (token: string) => {
        if (turnstile_payload === null)
            return;

        let { email, password } = turnstile_payload as UserInfo;
        let res = await userLogin({ variables: { loginData: { email: email, password: password, token: token } } });
        if (res.data.userLogin.error) {
            set_turnstile_payload(null);
            if (res.data.userLogin.error.field === "token")
                set_token_error(res.data.userLogin.error.name);
            else
                set_error(res.data.userLogin.error.name);
            return;
        }
        window.location.assign("/dashboard");
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

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Sign in - Exxpenses</title>
                <meta
                    name="description"
                    content="Login to your Exxpenses account."
                    key="desc"
                />
            </Head>

            <Box minHeight="100vh" display="flex" marginTop={isMobileView ? "20px" : "100px"} justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    padding="50px"
                    borderRadius="8px"
                    width="100%"
                >
                    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                        <Link href="/">
                            <BigLogo />
                        </Link>
                        <Box
                            color={'gray.100'}
                            lineHeight={1.1}
                            fontSize="24px"
                            sx={{ marginBottom: "8px" }}
                        >
                            Sign in
                        </Box>
                        <Box width={isMobileView ? "100%" : "405px"}>
                            <Formik
                                initialValues={{ email: "", password: "", generic: "", token: "" }}
                                initialErrors={{ email: error ? "" : undefined, password: error ? "" : undefined, generic: error, token: token_error }}
                                enableReinitialize={true}
                                onSubmit={async ({ email, password }, actions) => {

                                    if (!email || email.length === 0) {
                                        actions.setFieldError("email", "Enter your email address")
                                        return;
                                    }
                                    else if (email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "Invalid email address");
                                        return;
                                    }

                                    if (!password || password.length === 0) {
                                        actions.setFieldError("password", "Enter your password");
                                        return;
                                    }

                                    if (password.length < 8) {
                                        actions.setFieldError("password", "Password needs to be at least 8 characters long");
                                        return;
                                    }

                                    set_token_error(undefined);
                                    set_error(undefined);
                                    set_turnstile_payload({
                                        email: email,
                                        password: password
                                    });
                                }}
                            >
                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Field name="email">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="14px">
                                                    <InputField is_error={errors.email !== undefined} field={field} label="Email" name="email" />
                                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="email" />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Field>
                                        <Field name="password">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="18px">
                                                    <InputField is_error={errors.password !== undefined} field={field} type="password" label="Password" name="password" />
                                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="generic" />
                                                    </Box>
                                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="password" />
                                                    </Box>
                                                    <Link href="/password-recover" className={styles.loginForgot}>Forgot password?</Link>
                                                </Box>
                                            )}
                                        </Field>
                                        <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="token" />
                                        </Box>
                                        <Box marginTop="20px" display="flex" justifyContent="space-between">
                                            <Button href="/register" className="emptyButton">
                                                Create account
                                            </Button>
                                            <Button sx={{ display: turnstile_payload === null ? "initial !important" : "none !important" }} disabled={isSubmitting} className="fullButton" type="submit">
                                                {isSubmitting ? <CircularProgress style={{ width: "18px", height: "18px" }} /> : "Sign in"}
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

export async function getServerSideProps({ req, res }: any) {

    const cookies = new Cookies(req.headers.cookie);
    if (cookies.get("user_session") !== undefined) {
        const userData = await userGet(req);
        if (userData.user !== undefined && userData.user !== null) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/dashboard"
                }
            }
        }
    }

    return {
        props: {
            ssr: {
            }
        }
    }
}
