import { Box, Button, CircularProgress, Link } from "@mui/material";
import { Formik, Field, FieldProps, ErrorMessage } from "formik";
import Head from "next/head";
import Image from 'next/image'
import Footer from "../components/Footer";
import InputField from "../components/InputField";
import useShowMobileView from "../utils/useShowMobileView";
import styles from "../styles/PasswordRecover.module.css"
import { useState } from "react";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useMutation } from "@apollo/client";
import { UserRecoverPasswordDocument } from "../generated/graphql";

export default function PasswordRecover() {

    const isMobileView = useShowMobileView();
    const [sent, setSent] = useState(false);
    const [userRecoverPassword] = useMutation(UserRecoverPasswordDocument);

    let header: any;
    if (sent) {
        header = (
            "We've sent you an email"
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
            "Follow the instructions in the email and create a new password."
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
                        <Image src="/exxpenses.svg" alt="peni" width="150px" height="30px" />
                        <Box marginBottom="8px" width="360px" marginTop="20px">
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
                        <Box width={isMobileView ? "100%" : "320px"}>
                            <Formik
                                initialValues={{ email: "" }}
                                onSubmit={async (values, actions) => {

                                    if (!values.email || values.email.length === 0) {
                                        actions.setFieldError("email", "Enter your email address.")
                                        return;
                                    }
                                    else if (values.email.match(/^[a-zA-Z0-9.!#$&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) === null) {
                                        actions.setFieldError("email", "This email address is invalid.");
                                        return;
                                    }

                                    await userRecoverPassword({
                                        variables: {
                                            email: values.email
                                        }
                                    });

                                    setSent(true);
                                    actions.setSubmitting(false);
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

                                        <Box marginTop="20px" display="flex" justifyContent="space-between">
                                            <Button href="/login" className={styles.createAccountButton}>
                                                Back to login
                                            </Button>
                                            <Button disabled={sent} className={styles.loginButton} type="submit">
                                                {
                                                    sent ? <CheckRoundedIcon style={{ marginTop: "2px", width: "20px", height: "20px" }} /> :
                                                        isSubmitting ?
                                                            <CircularProgress style={{ marginTop: "2px", width: "20px", height: "20px" }} /> :
                                                            "Send"
                                                }
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
