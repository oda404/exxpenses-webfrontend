import { Box, Button, IconButton, Link, Stack } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import userGet from "../gql/ssr/userGet";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import { User, UserChangePasswordDocument, UserDeleteAccountDocument, UserUpdatePreferredCurrencyDocument } from "../generated/graphql";
import NewsTab from "../components/NewsTab";
import styles from "../styles/Navbar.module.css"
import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import CardBox from "../components/CardBox";
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik";
import router from "next/router";
import DropdownInputField from "../components/DropdownInputField";
import { currencies } from "../utils/currency";
import { useMutation } from "@apollo/client";
import useShowMobileView from "../utils/useShowMobileView";
import InputField from "../components/InputField";

interface DrawerLinkProps {
    icon: any;
    name: string;
    href: string;
    active?: boolean;
}

function DrawerLink({ active, name, href, icon }: DrawerLinkProps) {
    return (
        <Box>
            <Link
                href={href}
                sx={{
                    display: "flex",
                    borderRadius: "8px",
                    padding: "8px",
                    paddingX: "12px",
                    background: active ? "var(--exxpenses-second-bg-color)" : '',
                    textDecoration: "none",
                    width: "auto",
                    "&:hover": {
                        background: active ? "var(--exxpenses-second-bg-color)" : "var(--exxpenses-main-button-hover-bg-color)",
                        textDecoration: "none",
                        cursor: "pointer"
                    },
                    alignItems: "none"
                }}
            >
                {icon}
                <Box marginX="5px" />
                <Box sx={{ textTransform: "none", fontSize: "13px" }} className={styles.drawerButtonText}>
                    {name}
                </Box>
            </Link>
        </Box>
    )
}

interface SidenavProps {
    active_tab: string;
}

function Sidenav({ active_tab }: SidenavProps) {

    return (
        <Box borderRadius="8px" width="170px" height="fit-content">
            <Stack spacing={1}>
                <DrawerLink active={active_tab === "account"} name="Account" href="/dashboard" icon={<SettingsIcon sx={{ width: "20px", height: "20px" }} />} />
            </Stack>
        </Box>
    )
}

function AccountDangerZoneTab() {

    const [show, setShow] = useState(false);
    const [userDeleteAccount] = useMutation(UserDeleteAccountDocument);

    let content: any;
    if (show) {
        content = (
            <>
                <Box fontSize="14px" color="var(--exxpenses-main-error-color)">
                    Warning: a deleted account can not be recovered!
                </Box>
                <Box fontSize="14px">
                    Input your password to delete your account:
                </Box>
                <Formik
                    initialValues={{ password: "" }}
                    onSubmit={async ({ password }, actions) => {

                        if (!password || password.length === 0) {
                            actions.setFieldError("password", "Invalid password");
                            return;
                        }

                        const res = await userDeleteAccount({ variables: { password: password } });
                        if (!res.data.userDeleteAccount) {
                            actions.setFieldError("password", "Incorrect password!");
                            return;
                        }

                        window.location.assign("/");
                    }}
                >
                    {({ isSubmitting, errors }) => (
                        <Form>
                            <Box display="flex">
                                <Box marginTop="4px">
                                    <Field name="password">
                                        {({ field, form }: FieldProps) => (
                                            <Box>
                                                <InputField bg="var(--exxpenses-second-bg-color)" type="password" is_error={errors.password !== undefined} field={field} name="password" />
                                                <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                    <ErrorMessage name="password" />
                                                </Box>
                                            </Box>
                                        )}
                                    </Field>
                                </Box>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={{
                                        marginLeft: "10px",
                                        marginTop: "4px",
                                        color: "var(--exxpenses-main-error-text-color) !important",
                                        height: "40px !important"
                                    }}
                                    className="emptyButton"
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </>
        )
    }
    else {
        content = null;
    }

    return (
        <CardBox marginTop="10px">
            <Box color="var(--exxpenses-main-error-color)" fontSize="18px">
                Danger zone
            </Box>
            <Box marginTop="5px">
                <Box display="flex" alignItems="center">
                    <Box fontSize="18px" whiteSpace="nowrap">
                        <b>Delete account</b>
                    </Box>
                    <IconButton onClick={() => setShow(!show)} sx={{}}>
                        <ArrowBackIosNewIcon sx={{ height: "16px", width: "16px", rotate: show ? "90deg" : "-90deg" }} />
                    </IconButton>
                    <Box marginLeft="5px" width="100%" height="1px" bgcolor="var(--exxpenses-main-button-hover-bg-color)" />
                </Box>
                {content}
            </Box>
        </CardBox >
    )
}

function AccountTab({ user }: { user: User }) {

    const [showPassword, setShowPassword] = useState(false);
    const [updatePreferredCurrency] = useMutation(UserUpdatePreferredCurrencyDocument);
    const [userChangePassword] = useMutation(UserChangePasswordDocument);
    const [dirtyCurrency, setDirtyCurrency] = useState(false);
    let currency_input_changed = (e: string) => {
        setDirtyCurrency(e !== user.preferred_currency);
    }
    let currency_change_notice: any = null;
    if (dirtyCurrency && user.plan === 0)
        currency_change_notice = (
            <Box color="var(--exxpenses-warning-color)">
                Changing the account currency will not change your categories&#39; currencies. Learn more &nbsp;
                <Link sx={{ color: "var(--exxpenses-warning-color)" }} href="/plans">here</Link>.
            </Box>
        )

    return (
        <CardBox>
            <Box fontSize="18px">
                Account settings
            </Box>

            <Box marginTop="10px">
                <Box display="flex" alignItems="center" fontSize="18px">
                    <Box whiteSpace="nowrap"><b>Personal details</b></Box>
                    <Box marginLeft="5px" width="100%" height="1px" bgcolor="var(--exxpenses-main-button-hover-bg-color)" />
                </Box>
                <Box padding="5px">
                    <Box >
                        <Box>Firstname</Box>
                        <Box display="flex">
                            <b>{user.firstname}</b>
                        </Box>
                    </Box>

                    <Box marginTop="10px">
                        <Box>Firstname</Box>
                        <Box display="flex">
                            <b>{user.lastname}</b>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box marginTop="10px">
                <Box display="flex" alignItems="center" fontSize="18px">
                    <Box whiteSpace="nowrap"><b>Account details</b></Box>
                    <Box marginLeft="5px" width="100%" height="1px" bgcolor="var(--exxpenses-main-button-hover-bg-color)" />
                </Box>
                <Box padding="5px">
                    <Box>
                        <Box>Preferred currency</Box>
                        <Box display="flex">
                            <Formik
                                initialValues={{ currency: user.preferred_currency }}
                                onSubmit={async ({ currency }, actions) => {

                                    if (!currency || currency.length === 0) {
                                        actions.setFieldError("currency", "Invalid currency");
                                        return;
                                    }
                                    await updatePreferredCurrency({ variables: { preferred_currency: currency } });
                                    router.reload();
                                }}
                            >
                                {({ isSubmitting, errors }) => (
                                    <Form>
                                        <Box display="flex">
                                            <Box marginTop="4px">
                                                <Field name="currency">
                                                    {({ field, form }: FieldProps) => (
                                                        <Box>
                                                            <DropdownInputField
                                                                bg="var(--exxpenses-second-bg-color)"
                                                                hide_label
                                                                field={field}
                                                                is_error={errors.currency !== undefined}
                                                                elements={currencies}
                                                                oninput={currency_input_changed}
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
                                                sx={{
                                                    marginTop: "6px",
                                                    marginLeft: "10px",
                                                    display: dirtyCurrency ? "block !important" : "none !important"
                                                }}
                                                className="fullButton"
                                            >
                                                Update
                                            </Button>
                                        </Box>
                                        {currency_change_notice}
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Box>

                    <Box marginTop="10px">
                        <Box>Email</Box>
                        <Box display="flex">
                            <b>{user.email}</b>
                            <Box marginLeft="10px">
                                {user.verified_email ? "(Verified)" : "(Not verified)"}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box marginTop="10px">
                    <Box >
                        <Box display="flex" alignItems="center" fontSize="18px">
                            <Box whiteSpace="nowrap"><b>Change password</b></Box>
                            <IconButton onClick={() => setShowPassword(!showPassword)} sx={{}}>
                                <ArrowBackIosNewIcon sx={{ height: "16px", width: "16px", rotate: showPassword ? "90deg" : "-90deg" }} />
                            </IconButton>
                            <Box marginLeft="5px" width="100%" height="1px" bgcolor="var(--exxpenses-main-button-hover-bg-color)" />
                        </Box>
                        <Box width="fit-content" display={showPassword ? "block" : "none"}>
                            <Formik
                                initialValues={{ old_password: "", password: "" }}
                                onSubmit={async ({ old_password, password }, actions) => {

                                    if (!old_password || old_password.length < 8) {
                                        actions.setFieldError("old_password", "Invalid password");
                                        return;
                                    }

                                    if (!password || password.length < 8) {
                                        actions.setFieldError("password", "Invalid password");
                                        return;
                                    }

                                    const res = await userChangePassword({ variables: { old_password: old_password, password: password } });
                                    if (!res.data.userChangePassword) {
                                        actions.setFieldError("old_password", "Incorrect password.");
                                        return;
                                    }

                                    window.location.reload();
                                }}
                            >
                                {({ isSubmitting, errors }) => (
                                    <Form>
                                        <Box marginTop="5px" display="flex">
                                            <Box display="flex" marginTop="4px">
                                                <Field name="old_password">
                                                    {({ field, form }: FieldProps) => (
                                                        <Box>
                                                            <InputField bg="var(--exxpenses-second-bg-color)" type="password" is_error={errors.old_password !== undefined} field={field} name="old_password" label="Current password" />
                                                            <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                                <ErrorMessage name="old_password" />
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Field>
                                                <Box marginX="5px" />
                                                <Field name="password">
                                                    {({ field, form }: FieldProps) => (
                                                        <Box>
                                                            <InputField bg="var(--exxpenses-second-bg-color)" type="password" is_error={errors.password !== undefined} field={field} name="password" label="New password" />
                                                            <Box fontWeight="bold" color="var(--exxpenses-main-error-color)" fontSize="14px">
                                                                <ErrorMessage name="password" />
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </Field>
                                            </Box>
                                        </Box>
                                        <Box color="var(--exxpenses-unimportant-color)" fontSize="13px">
                                            The password should have 8 or more characters. For extra security make sure to include capital letters, numbers and symbols.
                                        </Box>
                                        <Button type="submit" sx={{ marginTop: "5px", width: "100% !important" }} className="fullButton">
                                            Change password
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </CardBox >
    )
}

type AccountProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function AccountContent({ user }: { user: User }) {

    const [active_tab, set_active_tab] = useState("account");
    const isMobileView = useShowMobileView();

    let content: any;
    if (active_tab === "account")
        content = (
            <>
                <AccountTab user={user} />
                <AccountDangerZoneTab />
            </>
        )
    else
        content = null;

    let page: any;
    if (isMobileView) {
        page = (
            <Box padding="10px" sx={{ minHeight: "100vh", width: "100%" }}>
                <Box marginTop="30px" />
                <Sidenav active_tab={active_tab} />
                <NewsTab banner_mode={isMobileView} user={user} />
                <Box marginY="10px" />
                <Box>
                    {content}
                </Box>
            </Box>
        )
    }
    else {
        page = (
            <Box paddingY="40px" justifyContent="center" display="flex" sx={{ minHeight: "100vh", width: "100%" }}>
                <Sidenav active_tab={active_tab} />
                <Box marginX="10px" />
                <Box width="540px">
                    {content}
                </Box>
                <Box marginX="10px" />
                <NewsTab banner_mode={isMobileView} user={user} />
            </Box>
        )
    }


    return (
        <>
            {page}
        </>
    )
}

export default function Account({ ssr }: AccountProps) {

    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
            <Head>
                <title>Account settings - Exxpenses</title>
                <meta
                    name="description"
                    content="Settings for your Exxpenses account."
                    key="desc"
                />
            </Head>

            <Box>
                <Topbar user={ssr.userGet.user as User} />
                <Box marginX="auto" maxWidth="990px" justifyContent="center" display="flex">
                    <AccountContent user={ssr.userGet.user as User} />
                </Box>
                <Footer />
            </Box>
        </Box>
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

    return {
        props: {
            ssr: {
                userGet: userData,
            }
        }
    }
}
