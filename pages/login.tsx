
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { UserGetDocument, UserGetQuery, UserLoginDocument } from "../generated/graphql";
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import InputField from "../components/InputField";
import apolloClient from "../utils/apollo-client";
import { InferGetServerSidePropsType } from "next";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import styles from "../styles/Login.module.css";
import { CircularProgress } from "@mui/material";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";
import Head from "next/head";
import Cookies from "universal-cookie";
import userGet from "../gql/ssr/userGet";
import Image from 'next/image'

type LoginProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Login({ }: LoginProps) {

    const [userLogin] = useMutation(UserLoginDocument);
    const isMobileView = useShowMobileView();

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Exxpenses - Log in</title>
                <meta
                    name="description"
                    content="Login to your Exxpenses account."
                    key="desc"
                />
            </Head>

            <Box height="70vh" display="flex" marginTop={isMobileView ? "20px" : "0px"} alignItems={isMobileView ? "unset" : "center"} justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="50px"
                    width="100%"
                    borderRadius="8px"
                >
                    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                        <Image src="/exxpenses.svg" alt="peni" width="150px" height="30px" />
                        <Box marginTop="20px">
                            <Box
                                color={'gray.100'}
                                lineHeight={1.1}
                                fontSize="24px"
                                sx={{ marginBottom: "8px" }}
                            >
                                Sign in
                            </Box>
                        </Box>
                        <Box width={isMobileView ? "100%" : "320px"}>
                            <Formik
                                initialValues={{ email: "", password: "" }}
                                onSubmit={async (values, actions) => {

                                    if (!values.email || values.email.length === 0) {
                                        actions.setFieldError("email", "Enter your email address.")
                                        return;
                                    }
                                    else if (values.email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "This email address is invalid.");
                                        return;
                                    }

                                    if (!values.password || values.password.length === 0) {
                                        actions.setFieldError("password", "Enter your password.");
                                        return;
                                    }

                                    let res = await userLogin({ variables: { loginData: { email: values.email, password: values.password } } });

                                    if (res.data.userLogin.error) {
                                        actions.setFieldError("password", res.data.userLogin.error.name);
                                        return;
                                    }

                                    window.location.assign("/dashboard");
                                }}
                            >
                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Field name="email">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="14px">
                                                    <InputField is_error={errors.email !== undefined} field={field} label="Email" name="email" />
                                                    <Box color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="email" />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Field>
                                        <Field name="password">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="18px">
                                                    <InputField is_error={errors.password !== undefined} field={field} type="password" label="Password" name="password" />
                                                    <Box color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="password" />
                                                    </Box>
                                                    <Link href="/password-recover" className={styles.loginForgot}><b style={{ color: "#5f5fe0" }}>Forgot password?</b></Link>
                                                </Box>
                                            )}
                                        </Field>

                                        <Box marginTop="20px" display="flex" justifyContent="space-between">
                                            <Button href="/register" className={styles.createAccountButton}>
                                                Create account
                                            </Button>
                                            <Button className={styles.loginButton} type="submit">
                                                {isSubmitting ? <CircularProgress style={{ width: "26px", height: "26px" }} /> : "Sign in"}
                                            </Button>
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
