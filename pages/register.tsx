
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import InputField from "../components/InputField";
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { UserGetDocument, UserGetQuery, UserRegisterDocument } from "../generated/graphql";
import apolloClient from "../utils/apollo-client";
import { InferGetServerSidePropsType } from "next";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";
import Head from "next/head";
import BigLogo from "../components/BigLogo";

type RegisterProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Register({ }: RegisterProps) {

    const [userRegister] = useMutation(UserRegisterDocument);
    const isMobileView = useShowMobileView();

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Exxpenses - Create an account</title>
                <meta
                    name="description"
                    content="Create an Exxpenses account."
                    key="desc"
                />
            </Head>

            <Box height="75vh" display="flex" marginTop={isMobileView ? "20px" : "0px"} alignItems={isMobileView ? "unset" : "center"} justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="50px"
                    width="100%"
                    borderRadius="8px"
                >
                    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
                        <BigLogo />
                        <Box marginTop="20px" textAlign="center" marginBottom="20px">
                            <Box
                                color={'gray.100'}
                                lineHeight={1.1}
                                fontSize="24px"
                            >
                                Create your account
                            </Box>
                        </Box>
                        <Box width={isMobileView ? "100%" : "405px"}>
                            <Formik
                                initialValues={{ firstname: "", lastname: "", email: "", password: "", confirm_password: "" }}
                                onSubmit={async ({ firstname, lastname, email, password, confirm_password }, actions) => {
                                    if (!firstname || firstname.length === 0) {
                                        actions.setFieldError("firstname", "Enter your firstname");
                                        return;
                                    }
                                    else if (firstname.length > 30) {
                                        actions.setFieldError("firstname", "Firstname can't be longer than 30 characters");
                                        return;
                                    }

                                    if (!lastname || lastname.length === 0) {
                                        actions.setFieldError("lastname", "Enter your lastname");
                                        return;
                                    }
                                    else if (lastname.length > 30) {
                                        actions.setFieldError("lastname", "Lastname can't be longer than 30 characters");
                                        return;
                                    }

                                    if (!email || email.length === 0) {
                                        actions.setFieldError("email", "Enter your email address")
                                        return;
                                    }
                                    else if (email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "Invalid email address");
                                        return;
                                    }

                                    if (!password || password.length === 0) {
                                        actions.setFieldError("password", "Enter a password");
                                        return;
                                    }

                                    if (password.length < 8) {
                                        actions.setFieldError("password", "Password needs to be at least 8 characters long");
                                        return;
                                    }

                                    if (!confirm_password || confirm_password.length === 0) {
                                        actions.setFieldError("confirm_password", "Please confirm your password");
                                        return;
                                    }

                                    if (password !== confirm_password) {
                                        actions.setFieldError("confirm_password", "Passwords don't match!");
                                        return;
                                    }

                                    let res = await userRegister({
                                        variables: {
                                            registerData: {
                                                firstname: firstname,
                                                lastname: lastname,
                                                email: email,
                                                password: password
                                            }
                                        }
                                    });

                                    if (res.data.userRegister.error !== null) {
                                        actions.setFieldError(
                                            res.data.userRegister.error.field,
                                            res.data.userRegister.error.name
                                        );
                                        return;
                                    }

                                    window.location.assign("/login");
                                }}
                            >
                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Box width="100%" display="flex">
                                            <Field name="firstname">
                                                {({ field }: FieldProps) => (
                                                    <Stack spacing="5px">
                                                        <InputField is_error={errors.firstname !== undefined} field={field} name="firstname" label="First name" />
                                                    </Stack>
                                                )}
                                            </Field>
                                            <Box marginX="5px" />
                                            <Field name="lastname">
                                                {({ field }: FieldProps) => (
                                                    <Stack spacing="5px">
                                                        <InputField is_error={errors.lastname !== undefined} field={field} name="lastname" label="Last name" />
                                                    </Stack>
                                                )}
                                            </Field>
                                        </Box>
                                        <Box marginBottom={errors.firstname || errors.lastname ? "-8px" : "0"} fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="firstname" />
                                            <Box fontWeight="inherit" color="inherit" marginLeft="52%">
                                                <ErrorMessage name="lastname" />
                                            </Box>
                                        </Box>

                                        <Field name="email">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="14px">
                                                    <InputField is_error={errors.email !== undefined} field={field} label="Email" name="email" />
                                                    <Box marginBottom={errors.email ? "-8px" : "0"} fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="email" />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Field>

                                        <Box marginTop="14px" display="flex">
                                            <Field name="password">
                                                {({ field }: FieldProps) => (
                                                    <Box>
                                                        <InputField is_error={errors.password !== undefined} field={field} type="password" label="Password" name="password" />
                                                    </Box>
                                                )}
                                            </Field>
                                            <Box marginX="5px" />
                                            <Field name="confirm_password">
                                                {({ field }: FieldProps) => (
                                                    <Box>
                                                        <InputField is_error={errors.confirm_password !== undefined} field={field} type="password" label="Confirm" name="confirm_password" />
                                                    </Box>
                                                )}
                                            </Field>
                                        </Box>
                                        <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                            <ErrorMessage name="password" />
                                            <Box fontWeight="inherit" color="inherit" marginLeft="52%">
                                                <ErrorMessage name="confirm_password" />
                                            </Box>
                                            <Box color="var(--exxpenses-unimportant-color)" marginTop="10px" fontSize="13px">
                                                The password should have 8 or more characters. For extra security make sure to include capital letters, numbers and symbols.
                                            </Box>
                                        </Box>

                                        <Box marginTop="20px" display="flex" justifyContent="space-between">
                                            <Button sx={{ fontWeight: "bold" }} href="/login" className="emptyButton">
                                                <Box color="inherit" fontWeight="inherit">
                                                    Already have an account?
                                                </Box>
                                            </Button>
                                            <Button disabled={isSubmitting} className="fullButton" type="submit">
                                                {isSubmitting ? <CircularProgress style={{ width: "18px", height: "18px" }} /> : "Let's go!"}
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
