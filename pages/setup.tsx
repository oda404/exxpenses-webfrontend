import { ApolloQueryResult, useMutation } from "@apollo/client";
import { Button, Backdrop, Grid, Paper } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import { UserGetQuery, UserGetDocument, CategoriesGetDocument, CategoriesGetQuery, CategoryAddDocument, UserUpdatePreferredCurrencyDocument } from "../generated/graphql";
import apolloClient from "../utils/apollo-client";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import styles from "../styles/Setup.module.css";
import { useEffect } from "react";
import Footer from "../components/Footer";
import Head from "next/head";

interface NumberBubbleProps {
    number: string;
}

function NumberBubble({ number }: NumberBubbleProps) {
    return (
        <Box
            width="40px"
            height="40px"
            sx={{ background: "var(--exxpenses-main-bg-color)", borderRadius: "25px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            marginBottom="10px"
            position="relative"
        >
            <Box fontSize="24px" color="#888888">
                {number}
            </Box>
        </Box>
    )
}

interface ConfigurePreferredCurrencyCardProps {
    grayed_out: boolean;
    preferred_currency: string;
}

function ConfigurePreferredCurrencyCard({ preferred_currency, grayed_out }: ConfigurePreferredCurrencyCardProps) {

    const router = useRouter();
    const [updatePreferredCurrency] = useMutation(UserUpdatePreferredCurrencyDocument);

    return (
        <Grid item>
            <Paper className={styles.cardBox}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <NumberBubble number="1" />
                    <Box position="relative" sx={{ padding: "14px", borderRadius: "4px" }} border="1px solid var(--exxpenses-main-border-color)" maxWidth="270px">
                        <Box marginBottom="8px" fontSize="15px">
                            {grayed_out ?
                                <b>
                                    Preferred currency
                                </b> :
                                <b>
                                    Tell us your preferred currency
                                </b>
                            }
                        </Box>
                        <Box marginBottom="24px" fontSize="15px">
                            {grayed_out ?
                                <Box>
                                    You can always change this setting in your user preference panel.
                                </Box> :
                                <Box>
                                    This currency will be used as the default for every category you create.
                                </Box>
                            }
                        </Box>

                        <Formik
                            initialValues={{ currency: preferred_currency }}
                            onSubmit={async ({ currency }, actions) => {

                                if (!currency || currency.length === 0) {
                                    actions.setFieldError("currency", "The category's default currency is required!");
                                    return;
                                }

                                const { data } = await updatePreferredCurrency({ variables: { preferred_currency: currency } });
                                // FIXME: error handling

                                router.reload();
                            }}
                        >
                            {({ isSubmitting, errors }) => (
                                <Form>
                                    <Box>
                                        <Field name="currency">
                                            {({ field, form }: FieldProps) => (
                                                <Box marginTop="12px">
                                                    <InputField field={field} name="currency" label="Currency" />
                                                    <ErrorMessage name="currency" component="div" />
                                                </Box>
                                            )}
                                        </Field>
                                    </Box>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={styles.submitButton}
                                    >
                                        {grayed_out ?
                                            <CheckRoundedIcon /> :
                                            <Box>
                                                Set
                                            </Box>
                                        }
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                        <Backdrop
                            sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)" }}
                            open={grayed_out}
                        />
                    </Box>
                </Box>
            </Paper>
        </Grid>
    )
}

interface AddFirstCategoryCardProps {
    grayed_out: boolean;
    preferred_currency: string;
}

function AddFirstCategoryCard({ preferred_currency, grayed_out }: AddFirstCategoryCardProps) {

    const router = useRouter();
    const [categoryAdd] = useMutation(CategoryAddDocument);

    return (
        <Grid item id="addFirstCategoryBox">
            <Paper className={styles.cardBox}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <NumberBubble number="2" />
                    <Box position="relative" sx={{ padding: "14px", borderRadius: "4px" }} border="1px solid var(--exxpenses-main-border-color)" maxWidth="270px">
                        <Box marginBottom="8px" fontSize="15px">
                            <b>
                                Your first category
                            </b>
                        </Box>
                        <Box marginBottom="12px" fontSize="15px">
                            Kickstart your Exxpenses account by creating your first expense category!
                        </Box>

                        <Formik
                            initialValues={{ name: "", default_curr: preferred_currency }}
                            onSubmit={async ({ name, default_curr }, actions) => {

                                if (!name || name.length === 0) {
                                    actions.setFieldError("name", "The category name is required!")
                                    return;
                                }
                                else if (name.length > 30) {
                                    actions.setFieldError("name", "The category name can't be longer than 30 characters!");
                                    return;
                                }

                                if (!default_curr || default_curr.length === 0) {
                                    actions.setFieldError("default_curr", "The category's default currency is required!");
                                    return;
                                }

                                const { data } = await categoryAdd({ variables: { addData: { name: name, default_currency: default_curr } } });
                                if (data.categoryAdd.error !== null) {
                                    actions.setFieldError(data.categoryAdd.error.field, data.categoryAdd.error.name);
                                    return;
                                }

                                router.reload();
                            }}
                        >
                            {({ isSubmitting, errors }) => (
                                <Form>
                                    <Box display="flex">
                                        <Field name="name">
                                            {({ field, form }: FieldProps) => (
                                                <Box marginTop="12px">
                                                    <InputField field={field} name="name" label="Name" />
                                                    <ErrorMessage name="name" component="div" />
                                                </Box>
                                            )}
                                        </Field>
                                        <Box marginLeft="5px" marginRight="5px" />
                                        <Field name="default_curr">
                                            {({ field }: FieldProps) => (
                                                <Box marginTop="10px">
                                                    <InputField field={field} name="default_curr" label="Currency" />
                                                    <ErrorMessage name="default_curr" component="div" />
                                                </Box>
                                            )}
                                        </Field>
                                    </Box>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={styles.submitButton}
                                    >
                                        Add
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                        <Backdrop
                            sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)" }}
                            open={grayed_out}
                        />
                    </Box>
                </Box>
            </Paper>
        </Grid>
    )
}

type DashboardProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Setup({ ssr }: DashboardProps) {

    const preferred_currency = ssr.userGet.user.preferred_currency;
    const lastname = ssr.userGet.user.lastname;
    const router = useRouter();

    const scrollToTop = (pos: number) => {
        window.scrollTo({
            top: pos,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (preferred_currency && router.asPath !== "/setup#addFirstCategoryBox") {
            const pos = document.getElementById("addFirstCategoryBox").offsetTop;
            scrollToTop(pos);
        }
    })

    return (
        <Box position="relative" minHeight="100vh" display="flex" flexDirection="column" sx={{ height: "100vh", overflowY: "auto" }}>
            <Head>
                <title>Setup | Exxpenses</title>
                <meta
                    name="description"
                    content="Setup your Exxpenses account"
                    key="desc"
                />
            </Head>
            <Box>

                <Box
                    marginTop="60px"
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                >
                    <Box textAlign="center" fontSize="18px" marginBottom="15px">
                        <b>Setup your Exxpenses account</b>
                        <Box fontSize="16px">
                            Let&apos;s get the basic stuff out of the way
                        </Box>
                    </Box>
                    <Box>
                        <Grid spacing={4} justifyContent="center" padding="12px" height="fit-content" width="fit-content" container>
                            <ConfigurePreferredCurrencyCard
                                preferred_currency={preferred_currency ? preferred_currency : ""}
                                grayed_out={preferred_currency !== null}
                            />
                            <AddFirstCategoryCard
                                preferred_currency={preferred_currency ? preferred_currency : ""}
                                grayed_out={preferred_currency === null}
                            />
                        </Grid>
                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box >

    )
}

export async function getServerSideProps({ req }: any) {
    const user_resp: ApolloQueryResult<UserGetQuery> = await apolloClient.query({
        query: UserGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    if (user_resp.data.userGet.user === undefined || user_resp.data.userGet.user === null) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            },
            props: {}
        }
    }

    const category_resp: ApolloQueryResult<CategoriesGetQuery> = await apolloClient.query({
        query: CategoriesGetDocument,
        context: { cookie: req.headers.cookie },
        fetchPolicy: "no-cache"
    });

    if (category_resp.data.categoriesGet?.categories?.length! > 0) {
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
                userGet: user_resp.data.userGet
            }
        }
    }
}
