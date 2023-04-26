import { useMutation } from "@apollo/client";
import { Box, Button, CircularProgress, Link } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { UserIsPasswordResetTokenValidDocument, UserSetPasswordDocument } from "../../generated/graphql";
import Image from 'next/image'
import { Formik, Field, FieldProps, ErrorMessage } from "formik";
import Footer from "../../components/Footer";
import InputField from "../../components/InputField";
import useShowMobileView from "../../utils/useShowMobileView";
import apolloClient from "../../utils/apollo-client";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import BigLogo from "../../components/BigLogo";

type CategoryProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function PasswordRecoverNew({ ssr }: CategoryProps) {

    const isMobileView = useShowMobileView();
    const [userSetPassword] = useMutation(UserSetPasswordDocument);

    let content: any;
    if (ssr?.success) {
        content = (
            <Box>
                <Box marginBottom="8px" marginTop="20px">
                    <Box
                        color={'gray.100'}
                        lineHeight={1.1}
                        fontSize="24px"
                        sx={{ marginBottom: "20px" }}
                        textAlign="center"
                    >
                        Create a new password
                    </Box>
                </Box>
                <Box width={isMobileView ? "100%" : "320px"}>
                    <Formik
                        initialValues={{ password: "", confirm_password: "" }}
                        onSubmit={async ({ password, confirm_password }, actions) => {

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

                            await userSetPassword({
                                variables: {
                                    token: ssr.token,
                                    password: password
                                }
                            });

                            window.location.assign("/login");
                            actions.setSubmitting(false);
                        }}
                    >
                        {({ handleSubmit, isSubmitting, errors }) => (
                            <form onSubmit={handleSubmit}>
                                <Field name="password">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="14px">
                                            <InputField type="password" is_error={errors.password !== undefined} field={field} label="Password" name="password" />
                                        </Box>
                                    )}
                                </Field>

                                <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                    <ErrorMessage name="password" />
                                </Box>

                                <Field name="confirm_password">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="14px">
                                            <InputField type="password" is_error={errors.confirm_password !== undefined} field={field} label="Confirm" name="confirm_password" />
                                        </Box>
                                    )}
                                </Field>

                                <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                    <Box fontWeight="inherit" color="inherit">
                                        <ErrorMessage name="confirm_password" />
                                    </Box>
                                    <Box color="var(--exxpenses-unimportant-color)" marginTop="10px" fontSize="13px">
                                        The password should have 8 or more characters. For extra security make sure to include capital letters, numbers and symbols.
                                    </Box>
                                </Box>

                                <Box marginTop="20px" display="flex" justifyContent="space-between">

                                    <Button className="fullButton" sx={{ width: "100% !important" }} type="submit">
                                        {
                                            isSubmitting ?
                                                <CircularProgress style={{ marginTop: "2px", width: "20px", height: "20px" }} /> :
                                                "Set"
                                        }
                                    </Button>
                                </Box>

                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        )
    }
    else {
        content = (
            <Box marginBottom="8px" marginTop="20px">
                <Box display="flex" flexDirection="column">
                    <Box marginBottom="10px" marginTop="20px" flexDirection="column" display="flex" alignItems="center">
                        <HeartBrokenIcon sx={{ fill: "var(--exxpenses-main-error-color)", width: "40px", height: "40px" }} />
                        <Box marginTop="10px" width="400px" fontSize="18px">
                            <b>This link has expired, please create another password reset request!</b>
                        </Box>
                    </Box>
                    <Link sx={{ color: "var(--exxpenses-main-color)", textDecoration: "none" }} href="/password-recover">
                        Take me to the password recovery page
                    </Link>
                </Box>
            </Box>
        )
    }

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Create a new password - Exxpenses</title>
                <meta
                    name="description"
                    content="Create a new password"
                    key="desc"
                />
            </Head>

            <Box height="100vh" display="flex" marginTop={isMobileView ? "20px" : "140px"} justifyContent="center">
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
                        {content}
                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box >
    )
}

export async function getServerSideProps({ params }: any) {

    const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (!uuidRegex.test(params.token)) {
        return {
            notFound: true,
            props: {

            }
        }
    }

    const { data: { userIsPasswordResetTokenValid } } = await apolloClient.query({
        query: UserIsPasswordResetTokenValidDocument,
        fetchPolicy: "no-cache",
        variables: {
            token: params.token
        }
    });

    return {
        props: {
            ssr: {
                success: userIsPasswordResetTokenValid,
                token: params.token
            }
        }
    }
}
