
import Navbar from "../components/navbar";
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { UserGetDocument, UserGetQuery, UserLoginDocument } from "../generated/graphql";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import InputField from "../components/InputField";
import { useRouter } from "next/router";
import apolloClient, { cache } from "../utils/apollo-client";
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

type LoginProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Login({ }: LoginProps) {

    const [userLogin] = useMutation(UserLoginDocument);
    const showMobileView = useShowMobileView();

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Login | Exxpenses</title>
                <meta
                    name="description"
                    content="Login to your Exxpenses account."
                    key="desc"
                />
            </Head>

            <Navbar />

            <Box height="70vh" display="flex" alignItems="center" justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="26px"
                    border={showMobileView ? "none" : "1px var(--exxpenses-main-border-color) solid"}
                    width="fit-content"
                    borderRadius="8px"
                    boxShadow={showMobileView ? "none" : "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"}
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Stack spacing={20}>
                            <Box
                                color={'gray.100'}
                                lineHeight={1.1}
                                fontSize="24px"
                                sx={{ marginBottom: "8px" }}
                            >
                                Sign in
                            </Box>
                        </Stack>
                        <Box width="320px">
                            <Formik
                                initialValues={{ email: "", password: "" }}
                                onSubmit={async (values, actions) => {

                                    if (!values.email || values.email.length === 0) {
                                        actions.setFieldError("email", "The email address is required!")
                                        return;
                                    }
                                    else if (values.email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "Invalid email address!");
                                        return;
                                    }

                                    if (!values.password || values.password.length === 0) {
                                        actions.setFieldError("password", "The password is required!");
                                        return;
                                    }

                                    let res = await userLogin({ variables: { loginData: { email: values.email, password: values.password } } });

                                    if (res.data.userLogin.error) {
                                        actions.setFieldError("password", res.data.userLogin.error.name);
                                        return;
                                    }

                                    window.location.assign("/dashboard");
                                    window.location.reload();
                                }}
                            >
                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Field name="email">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="14px">
                                                    <InputField is_error={errors.email !== undefined} field={field} label="Email" name="email" />
                                                    <ErrorMessage name="email" />
                                                </Box>
                                            )}
                                        </Field>
                                        <Field name="password">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="18px">
                                                    <InputField is_error={errors.password !== undefined} field={field} type="password" label="Password" name="password" />
                                                    <ErrorMessage name="password" />
                                                </Box>
                                            )}
                                        </Field>
                                        <Button className={styles.loginButton} type="submit">
                                            {isSubmitting ? <CircularProgress style={{ width: "26px", height: "26px" }} /> : "Sign in"}
                                        </Button>
                                        <Link href="/forgotpass" className={styles.loginForgot}>Forgot your password?</Link>
                                    </form>
                                )}
                            </Formik>
                        </Box>

                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box>
    )
}

export async function getServerSideProps({ req, res }: any) {
    const { data: { userGet } }: ApolloQueryResult<UserGetQuery> = await apolloClient.query({
        query: UserGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    if (userGet.user !== undefined && userGet.user !== null) {
        return {
            redirect: {
                permanent: false,
                destination: "/dashboard"
            }
        }
    }

    return {
        props: {
            ssr: {
                userResponse: userGet

            }
        }
    }
}
