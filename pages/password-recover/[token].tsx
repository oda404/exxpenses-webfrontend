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
import styles from "../../styles/PasswordRecoverNew.module.css"
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

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
                        sx={{ marginBottom: "4px" }}
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
                                actions.setFieldError("password", "Password needs to be at least 8 characters long.");
                                return;
                            }

                            if (!confirm_password || confirm_password.length === 0) {
                                actions.setFieldError("confirm_password", "Please confirm your password.");
                                return;
                            }

                            if (password !== confirm_password) {
                                actions.setFieldError("confirm_password", "The passwords don't match.");
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

                                <Field name="confirm_password">
                                    {({ field }: FieldProps) => (
                                        <Box marginTop="14px">
                                            <InputField type="password" is_error={errors.confirm_password !== undefined} field={field} label="Confirm" name="confirm_password" />
                                        </Box>
                                    )}
                                </Field>

                                <Box color="var(--exxpenses-main-error-color)" fontSize="14px">
                                    <Box display={errors.password || errors.confirm_password ? "none" : "block"} paddingX="8px" fontSize="13px">
                                        Use 8 or more characters. For extra security make sure to include numbers and symbols.
                                    </Box>
                                    <ErrorMessage name="confirm_password" />
                                    <ErrorMessage name="password" />
                                </Box>

                                <Box marginTop="20px" display="flex" justifyContent="space-between">

                                    <Button className={styles.loginButton} sx={{ width: "100% !important" }} type="submit">
                                        {
                                            isSubmitting ?
                                                <CircularProgress style={{ marginTop: "2px", width: "20px", height: "20px" }} /> :
                                                "OK"
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
                <title>Exxpenses</title>
                <meta
                    name="description"
                    content="Forgot your email? Let us send you an email, so you can create a new one."
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
                        <Image src="/exxpenses.svg" alt="peni" width={150} height={30} />
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