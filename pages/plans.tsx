import { InferGetServerSidePropsType } from "next";
import userGet from "../gql/ssr/userGet";
import { Box, Button, IconButton } from "@mui/material";
import Topbar from "../components/Topbar";
import Head from "next/head";
import Footer from "../components/Footer";
import CardBox from "../components/CardBox";
import { User } from "../generated/graphql";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from "react";
import useShowMobileView from "../utils/useShowMobileView";

type PlansProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function PlanBoxDescription({ title, description, prev }: { title: string; description: string; prev?: boolean }) {

    const [open, setOpen] = useState(false);
    const isMobileView = useShowMobileView();

    let content: any;
    if (prev) {
        content = (
            <>
                <Box alignItems="center" display="flex">
                    <IconButton disabled>
                        <ArrowForwardIosIcon sx={{ fill: "white", width: "12px", height: "12px", rotate: isMobileView ? "-90deg" : "-180deg" }} />
                    </IconButton>
                    <Box color="white" fontSize="14px">Everything in the previous plan, plus...</Box>
                </Box>
            </>
        )
    }
    else {
        content = (
            <>
                <Box alignItems="center" display="flex">
                    <IconButton
                        onClick={() => setOpen(!open)}
                    >
                        <ArrowForwardIosIcon sx={{ width: "12px", height: "12px", rotate: open ? "90deg" : "0" }} />
                    </IconButton>
                    <Box color="white" fontSize="14px">{title}</Box>
                </Box>
                <Box textAlign="justify" display={open ? "block" : "none"} marginLeft="28px" fontSize="14px">{description}</Box>
            </>
        )
    }

    return (
        <Box paddingY="2px">
            {content}
        </Box>
    )
}

interface PlanBoxProps {
    is_signed_in: boolean;
    name: string;
    description: string;
    price: number;
    active: boolean;
    hot?: boolean;
    descriptions: { title: string; description: string; prev?: boolean }[];
}

function PlanBox({ name, description, price, active, hot, descriptions, is_signed_in }: PlanBoxProps) {

    const isMobileView = useShowMobileView();

    let hotMargin = "-30px";
    if (isMobileView)
        hotMargin = "0";

    if (hot)
        hot = false;

    return (
        <CardBox sx={{ borderTopWidth: "30px", marginTop: hot ? hotMargin : "0" }} height="auto" padding="0 !important" border={hot ? "3px solid var(--exxpenses-light-green)" : "none"} width="100%">
            <Box display={hot ? "block" : "none"} fontFamily="'Work Sans', sans-serif" textAlign="center" sx={{ top: "-28px" }} position="relative">MOST POPULAR</Box>
            <Box padding="14px" flexDirection="column" alignItems="center" display="flex">
                <Box fontFamily="'Work Sans', sans-serif" fontSize="20px">
                    {name}
                </Box>
                <Box width="80%" fontSize="14px" textAlign="center">
                    {description}
                </Box>
                <Box justifyContent="center" display="flex">
                    <Box marginRight="2px" marginTop="10px">$</Box>
                    <Box fontSize="32px">{price > -1 ? price : "-"}</Box>
                    <Box marginLeft="4px" marginTop="14px">/month</Box>
                </Box>
                <Button
                    className="fullButton"
                    disabled={active}
                    // disabled={true}
                    sx={{
                        width: "100% !important",
                        background: active ? "var(--exxpenses-main-button-hover-bg-color) !important" : "var(--exxpenses-dark-green) !important",
                        // background: "var(--exxpenses-main-button-hover-bg-color) !important",
                        color: "white !important"
                    }}
                    onClick={() => {
                        if (!is_signed_in)
                            window.location.assign("/register");
                    }}
                >
                    {active ? "Current plan" : "Get"}
                    {/* {active ? "Current plan" : "Unavailable"} */}
                </Button>
            </Box>
            <Box height="100%" padding="8px" bgcolor="var(--exxpenses-dark-highlight)">
                {descriptions.map((d, idx) => (
                    <PlanBoxDescription key={idx} title={d.title} description={d.description} prev={d.prev} />
                ))}
            </Box>
        </CardBox>
    )
}

function PlansContent({ user }: { user?: User; }) {

    const isMobileView = useShowMobileView();

    return (
        <Box sx={{ minHeight: "100vh", width: "990px" }}>
            {/* <Box color="var(--exxpenses-warning-color)" textAlign="center" fontWeight="900">
                The only account plan available at the moment is the Free plan. Thank you for understanding!
            </Box> */}
            <Box fontFamily="'Work Sans', sans-serif" textAlign="center" fontWeight="900" fontSize="40px">Choose the right plan for your needs.</Box>
            {/* <Box justifyContent="center">
                <Box fontSize="18px" textAlign="center" marginTop="10px"><b>How often do you want to pay?</b></Box>
                <Box justifyContent="center" display="flex">
                    <Button className="emptyButton">Monthly</Button>
                    <Box marginX="10px" />
                    <Button className="emptyButton">Yearly</Button>
                </Box>
            </Box > */}
            <Box marginTop={isMobileView ? "10px" : "50px"} display="flex" flexDirection={isMobileView ? "column" : "row"}>
                <PlanBox
                    name="Free"
                    description="The basic plan for tracking your monthly expenses"
                    price={0}
                    active={user?.plan === 0}
                    is_signed_in={!!user}
                    descriptions={[
                        { title: "8 categories", description: "Create up to 8 categories." },
                        { title: "20 monthly expenses", description: "Track up to 20 monthly expenses for each category." },
                        { title: "Monthly comparisons", description: "Compare this month's expenses with last month's." }
                    ]}
                />
                <Box marginX={!isMobileView ? "10px" : "0"} marginY={isMobileView ? "10px" : "0"} />
                <PlanBox
                    name="Premium"
                    description="The advanced plan for the power user"
                    price={-1}
                    active={user?.plan === 1}
                    hot={true}
                    is_signed_in={!!user}
                    descriptions={[
                        { title: "", description: "", prev: true },
                        { title: "Unlimited Categories", description: "Create an unlimited number of categories." },
                        { title: "Unlimited Expenses", description: "Track an unlimited number of monthly expenses for each category." },
                        // { title: "Currency conversions", description: "Manually convert the currencies of categories and expenses. This can either be done for a category's expenses when changing that category's currency, or for categories (and their expenses) when changing the account's currency." },
                        { title: "Custom statistic periods", description: "Look at the expenses of any custom time period, and compare them with any other custom time period." },
                        { title: "No ads", description: "Remove advertisements" }
                    ]}
                />
                {/* <Box marginX={!isMobileView ? "10px" : "0"} marginY={isMobileView ? "10px" : "0"} />
                <PlanBox
                    name="Pro"
                    description="The professional plan for the entrepreneur"
                    price={-1}
                    active={user?.plan === 2}
                    is_signed_in={!!user}
                    descriptions={[
                        { title: "", description: "", prev: true },
                        { title: "Automatic currency conversions", description: "Expenses keep their original currency but, when counted towards the total, they will be accurately converted to the top-level currency." },
                        { title: "Incomes", description: "Track and get statistics on your incomes in combination with your expenses." }
                    ]}
                /> */}
            </Box>
            <Box fontSize="14px" padding="20px">
                <b>* All curency conversions are done using the expenses&#39; dates as the historical points.</b>
            </Box>
        </Box >
    )
}

export default function Plans({ ssr }: PlansProps) {


    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
            <Head>
                <title>Plans | Exxpenses</title>
                <meta
                    name="description"
                    content="Check out the available Exxpenses account plans and see which one fits your spending needs best!"
                    key="desc"
                />
            </Head>

            <Box>
                <Topbar user={ssr.userGet.user ? ssr.userGet.user as User : undefined} />
                <Box padding="10px" paddingY="40px" marginX="auto" maxWidth="990px" justifyContent="center" display="flex">
                    <PlansContent user={ssr.userGet.user ? ssr.userGet.user as User : undefined} />
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req }: any) {
    const userData = await userGet(req);
    return {
        props: {
            ssr: {
                userGet: userData,
            }
        }
    }
}
