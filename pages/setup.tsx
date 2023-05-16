import { useMutation } from "@apollo/client";
import { Button, Backdrop, Grid, Paper, Link } from "@mui/material";
import { Formik, Form, Field, FieldProps, ErrorMessage } from "formik";
import { Box } from "@mui/material";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import { CategoryAddDocument, UserUpdatePreferredCurrencyDocument, User } from "../generated/graphql";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import styles from "../styles/Setup.module.css";
import { useEffect } from "react";
import Footer from "../components/Footer";
import Head from "next/head";
import userGet from "../gql/ssr/userGet";
import useShowMobileView from "../utils/useShowMobileView";
import categoriesGet from "../gql/ssr/categoriesGet";
import BigLogo from "../components/BigLogo";
import DropdownInputField from "../components/DropdownInputField";
import { currencies } from "../utils/currency";

interface NumberBubbleProps {
    number: string;
}

function NumberBubble({ number }: NumberBubbleProps) {
    return (
        <Box
            width="40px"
            height="40px"
            sx={{
                borderRadius: "25px"
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
        >
            <Box fontSize="24px" color="#888888">
                {number}
            </Box>
        </Box >
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
                    <Box position="relative" sx={{ padding: "14px", borderRadius: "6px" }} maxWidth="270px">
                        <Box marginBottom="4px" fontSize="15px">
                            {grayed_out ?
                                <b>
                                    Preferred currency
                                </b> :
                                <b>
                                    Choose your preferred currency
                                </b>
                            }
                        </Box>
                        <Box marginBottom="18px" fontSize="14px">
                            {grayed_out ?
                                <Box>
                                    You can always change this setting in your user preference panel.
                                </Box> :
                                <Box>
                                    This currency will be used as the default for every expense you create.
                                </Box>
                            }
                        </Box>

                        <Formik
                            initialValues={{ currency: preferred_currency }}
                            onSubmit={async ({ currency }, actions) => {

                                if (!currency || currency.length === 0) {
                                    actions.setFieldError("currency", "Invalid currency");
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
                                                <Box>
                                                    <DropdownInputField
                                                        field={field}
                                                        is_error={errors.currency !== undefined}
                                                        elements={currencies}
                                                    />
                                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                        <ErrorMessage name="currency" />
                                                    </Box>
                                                </Box>
                                            )}
                                        </Field>
                                    </Box>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        sx={{ width: "100% !important", marginTop: "10px" }}
                                        className="fullButton"
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
                            sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)", borderRadius: "6px" }}
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

    let content = (
        <>
            <Box marginBottom="18px">
                Something you spend money on every month, like &#39;Takeaway&#39;.
            </Box>
            <Formik
                initialValues={{ name: "", default_curr: preferred_currency }}
                onSubmit={async ({ name, default_curr }, actions) => {

                    if (!name || name.length === 0) {
                        actions.setFieldError("name", "Enter a name")
                        return;
                    }
                    else if (name.length > 30) {
                        actions.setFieldError("name", "Name can't be longer than 30 characters");
                        return;
                    }

                    if (!default_curr || default_curr.length === 0) {
                        actions.setFieldError("default_curr", "The category's default currency is required");
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
                        <Field name="name">
                            {({ field, form }: FieldProps) => (
                                <Box>
                                    <InputField is_error={errors.name !== undefined} bg="var(--exxpenses-main-bg-color)" field={field} name="name" label="Name" />
                                    <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                        <ErrorMessage name="name" />
                                    </Box>
                                </Box>
                            )}
                        </Field>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            sx={{ width: "100% !important", marginTop: "10px" }}
                            className="fullButton"
                        >
                            Add
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    )

    if (grayed_out) {
        content = (
            <Box>
                Setup your preferred currency before creating your first category.
            </Box>
        );
    }

    return (
        <Grid item id="addFirstCategoryBox">
            <Paper className={styles.cardBox}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <NumberBubble number="2" />
                    <Box position="relative" sx={{ padding: "14px", borderRadius: "6px" }} maxWidth="270px">
                        <Box marginBottom="4px" fontSize="15px">
                            <b>
                                Create your first category
                            </b>
                        </Box>
                        <Box fontSize="14px">
                            {content}
                        </Box>
                        <Backdrop
                            sx={{ position: "absolute !important", zIndex: "999", background: "rgba(0, 0, 0, 0.3)", borderRadius: "6px" }}
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

    const isMobileView = useShowMobileView();

    const user = ssr.userGet.user as User;
    const preferred_currency = user.preferred_currency;
    const lastname = user.lastname;
    const router = useRouter();

    const scrollToTop = (pos: number) => {
        window.scrollTo({
            top: pos,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        if (preferred_currency && router.asPath !== "/setup#addFirstCategoryBox") {
            const pos = document.getElementById("addFirstCategoryBox")!.offsetTop;
            scrollToTop(pos);
        }
    })

    return (
        <Box position="relative" minHeight="100vh" bgcolor="var(--exxpenses-main-bg-color)">
            <Head>
                <title>Setup your account - Exxpenses</title>
                <meta
                    name="description"
                    content="Setup your Exxpenses account"
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
                        <Link href="/">
                            <BigLogo width={120} height={40} />
                        </Link>
                        <Box
                            color={'gray.100'}
                            lineHeight={1.1}
                            fontSize="24px"
                            sx={{ marginBottom: "8px" }}
                        >
                            Let&#39;s setup your account
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
            </Box>
            <Footer />
        </Box >

    )
}

export async function getServerSideProps({ req }: any) {

    const userData = await userGet(req);
    if (!userData.user) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            },
        }
    }

    const categoriesData = await categoriesGet(req);
    if (userData.user.preferred_currency && categoriesData.categories?.length! > 0) {
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
                userGet: userData
            }
        }
    }
}
