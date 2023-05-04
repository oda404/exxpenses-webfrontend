import { Grid, Paper, Button, Tooltip, Box, Link, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import { Expense, Category } from "../generated/graphql";
import expensesToDaily, { DailyExpenses } from "../utils/expensesToDaily";
import MinifiedExpenseChart from "./MinifiedExpenseChart";
import AddIcon from '@mui/icons-material/Add';
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import expensesToTotal from "../utils/expensesToTotal";
import WarningIcon from '@mui/icons-material/Warning';
import AddNewExpenseCard from "./AddNewExpenseCard";

interface CategoryBoxProps {
    category: Category;
    expenses: Expense[];
    since: Date;
    until: Date;
    preferred_currency: string;
    key: number;
    isMobileView: boolean;
}

export default function CategoryBox({ since, until, preferred_currency, category, expenses, isMobileView }: CategoryBoxProps) {

    let dailyExpenses: DailyExpenses[] = [];
    dailyExpenses = expensesToDaily(expenses, category.default_currency);

    let total = expensesToTotal(expenses, category.default_currency);
    let monthly: any;

    monthly = (
        <Box>
            {total.currency} {total.price}
        </Box>
    );

    let warningIcon: any = null;
    if (preferred_currency !== category.default_currency) {
        warningIcon = (
            <IconButton href="/plans" sx={{ padding: "0", marginLeft: "10px" }}>
                <Tooltip title="This category is not counted towards the total. Click to learn more.">
                    <WarningIcon
                        sx={{ width: "20px", height: "20px", fill: "var(--exxpenses-warning-color)" }}
                    />
                </Tooltip>
            </IconButton>
        )
    }

    const [isOpen, setOpen] = useState(false);

    return (
        <Grid item maxWidth="100%" width={isMobileView ? "100%" : "auto"}>
            <Modal
                open={isOpen}
                onClose={() => { setOpen(false) }}
                sx={{ display: "flex", paddingTop: "25vh", justifyContent: "center", backdropFilter: "blur(5px)" }}
            >
                <Box>
                    <AddNewExpenseCard
                        close={() => { setOpen(false) }}
                        category={category}
                    />
                </Box>
            </Modal>

            <Link href={`/category/${category.name}`} sx={{ textDecoration: "none", "&:hover": { textDecoration: "none" } }}>
                <Paper className={styles.categoryBox}>
                    <Box display="flex" height="74px">
                        <Box minWidth="fit-content">
                            <Box alignItems="center" sx={{ overflowX: "hidden" }} display="flex">
                                <Box sx={{ textTransform: "none", fontSize: ".875rem" }}><b>{category.name}</b></Box>
                                {warningIcon}
                            </Box>

                            <Box className={styles.categoryTotalCostBox} fontSize=".75rem !important">
                                {monthly}
                            </Box>
                        </Box>

                        <Box sx={{ "&:hover": { cursor: "pointer" } }} marginLeft="auto" width="70%">
                            <MinifiedExpenseChart since={since} until={until} dailyTotals={dailyExpenses} />
                        </Box>

                        <Box>
                            <Tooltip title="New expense" placement="top" arrow>
                                <Button
                                    className="fullButton"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setOpen(true);
                                    }}
                                    sx={{
                                        height: "100% !important",
                                        width: "fit-content !important",
                                        margin: "0 !important",
                                        padding: "0 !important",
                                    }}
                                >
                                    <AddIcon sx={{ padding: "0", width: "20px", height: "20px" }} />
                                </Button>
                            </Tooltip>
                        </Box>
                    </Box>
                </Paper>
            </Link>
        </Grid >
    );
}
