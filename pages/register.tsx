
import Navbar from "../components/navbar";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import InputField from "../components/InputField";
import { ApolloQueryResult, useMutation } from "@apollo/client";
import { UserGetDocument, UserGetQuery, UserRegisterDocument } from "../generated/graphql";
import { useRouter } from "next/router";
import apolloClient from "../utils/apollo-client";
import { InferGetServerSidePropsType } from "next";
import { Box, Button, CircularProgress, Link, Stack } from "@mui/material";
import styles from "../styles/Register.module.css";
import useShowMobileView from "../utils/useShowMobileView";
import Footer from "../components/Footer";

type RegisterProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Register({ }: RegisterProps) {

    const [userRegister] = useMutation(UserRegisterDocument);
    const showMobileView = useShowMobileView();

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Navbar />

            <Box height="70vh" display="flex" alignItems="center" justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    marginX="auto"
                    padding="22px"
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
                                sx={{ marginBottom: "20px" }}
                            >
                                Sign up for exxpenses!
                            </Box>
                        </Stack>
                        <Box width="320px">
                            <Formik
                                initialValues={{ firstname: "", lastname: "", email: "", password: "" }}
                                onSubmit={async ({ firstname, lastname, email, password }, actions) => {
                                    if (!firstname || firstname.length === 0) {
                                        actions.setFieldError("firstname", "The firstname is required!");
                                        return;
                                    }
                                    else if (firstname.length > 30) {
                                        actions.setFieldError("firstname", "The firstname can't be longer than 30 characters.");
                                        return;
                                    }

                                    if (!lastname || lastname.length === 0) {
                                        actions.setFieldError("lastname", "The lastname is required!");
                                        return;
                                    }
                                    else if (lastname.length > 30) {
                                        actions.setFieldError("lastname", "The lastname can't be longer than 30 characters.");
                                        return;
                                    }

                                    if (!email || email.length === 0) {
                                        actions.setFieldError("email", "The email address is required!")
                                        return;
                                    }
                                    else if (email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "Invalid email address!");
                                        return;
                                    }

                                    if (!password || password.length === 0) {
                                        actions.setFieldError("password", "The password is required!");
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
                                    window.location.reload();
                                }}
                            >
                                {({ handleSubmit, isSubmitting, errors }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Box display="flex">
                                            <Field name="firstname">
                                                {({ field }: FieldProps) => (
                                                    <Stack spacing="5px">
                                                        <InputField is_error={errors.firstname !== undefined} field={field} name="firstname" label="Firstname" />
                                                        <ErrorMessage name="firstname" component="div" />
                                                    </Stack>
                                                )}
                                            </Field>
                                            <Box marginLeft="5px" marginRight="5px" />
                                            <Field name="lastname">
                                                {({ field }: FieldProps) => (
                                                    <Stack spacing="5px">
                                                        <InputField is_error={errors.lastname !== undefined} field={field} name="lastname" label="Lastname" />
                                                        <ErrorMessage name="lastname" component="div" />
                                                    </Stack>
                                                )}
                                            </Field>
                                        </Box>

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
                                        <Button className={styles.registerButton} type="submit">
                                            {isSubmitting ? <CircularProgress style={{ width: "26px", height: "26px" }} /> : "Let's go!"}
                                        </Button>
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
