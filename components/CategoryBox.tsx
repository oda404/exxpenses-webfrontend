import { useMutation } from "@apollo/client";
import { Grid, Paper, Button, Popover, Divider, Tooltip, Box, Link } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { CategoryDeleteDocument, Expense, Category } from "../generated/graphql";
import expensesToDaily, { DailyExpenses, dailyTotalsKeepCurrency } from "../utils/expensesToDaily";
import MinifiedExpenseChart from "./MinifiedExpenseChart";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import expensesToTotal from "../utils/expensesToTotal";

interface CategoryBoxProps {
    category: Category;
    expenses: Expense[];
    since: Date;
    until: Date;
    preferred_currency: string;
    key: number;
    focusCategory: (category: string) => void;
    isMobileView: boolean;
}

export default function CategoryBox({ since, until, preferred_currency, category, expenses, isMobileView, focusCategory }: CategoryBoxProps) {

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [categoryDelete] = useMutation(CategoryDeleteDocument);
    const router = useRouter();

    let dailyExpenses: DailyExpenses[] = [];
    dailyExpenses = expensesToDaily(expenses);
    dailyExpenses = dailyTotalsKeepCurrency(dailyExpenses, category.default_currency);

    let total = expensesToTotal(expenses, category.default_currency);
    let monthly: any;
    if (total?.length > 0) {
        monthly = (
            <Box>
                {total[0].price} {total[0].currency}
            </Box>
        );
    }
    else {
        monthly = (
            <Box>
                Nothing
            </Box>
        );
    }

    let categoryIcon: any;
    if (preferred_currency !== category.default_currency) {
        categoryIcon = (
            <Link href="/free-account">
                <Tooltip title="This category is not counted towards the total. Click to learn more.">
                    <ClassIcon
                        sx={{ width: "22px", height: "22px", fill: "#e9e976" }}
                    />
                </Tooltip>

            </Link>
        )
    }
    else {
        categoryIcon = (
            <ClassIcon
                sx={{ width: "22px", height: "22px" }}
            />
        )
    }

    return (
        <Grid item maxWidth="100%" width={isMobileView ? "100%" : "auto"}>
            <Paper className={styles.categoryBox} sx={{ width: isMobileView ? "auto" : "150px" }}>
                <Box display="flex">
                    <Box minWidth="fit-content">
                        <Box sx={{ overflowX: "hidden" }} display="flex">
                            {categoryIcon}
                            <Box sx={{ textTransform: "none", marginLeft: "8px", fontSize: "14px" }}><b>{category.name}</b></Box>
                        </Box>

                        <Box
                            marginLeft="4px"
                            marginTop="4px"
                            maxHeight="70px"
                            fontSize="14px"
                        >
                            <Box>This month:</Box>
                        </Box>
                        <Box className={styles.categoryTotalCostBox}>
                            {monthly}
                        </Box>
                    </Box>

                    <Box style={{}} marginLeft="auto" marginRight="auto" width="90%">
                        <MinifiedExpenseChart since={since} until={until} dailyTotals={dailyExpenses} />
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{ backgroundColor: "var(--exxpenses-main-bg-color)" }}
                    >
                        <Tooltip title="New expense" placement="top" arrow>
                            <Button
                                className={stylesNew.categoryActionButton}
                                onClick={() => {
                                    focusCategory(category.name);
                                }}
                            >
                                <AddIcon sx={{ padding: "0", width: "20px", height: "20px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Details" arrow>
                            <Link
                                href={`/category/${category.name}`}
                                className={stylesNew.categoryActionButton}
                            >
                                <ShowChartIcon sx={{ fill: "var(--exxpenses-light-green)", padding: "0", width: "20px", height: "20px" }} />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                            <Button
                                aria-describedby={id}
                                onClick={(e) => handleClick(e)}
                                className={stylesNew.categoryActionButton}
                            >
                                <DeleteIcon className={styles.categoryDeleteIcon} sx={{ padding: "0", width: "20px", height: "20px" }} />
                            </Button>
                        </Tooltip>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center"
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: "center"
                            }}
                            PaperProps={{ style: { background: "none" } }}
                        >
                            <Box
                                sx={{ background: "var(--exxpenses-main-bg-color)", width: "260px", borderRadius: "10px" }}
                                padding="10px"
                                display="flex"
                                flexDirection="column"
                                border="1px var(--exxpenses-main-border-color) solid"
                                textAlign="center"
                            >
                                <Box>
                                    <b>Are you sure?</b>
                                </Box>
                                <Divider sx={{ width: "100%", background: "var(--exxpenses-main-border-color)", marginY: "5px" }} />
                                Deleting this category will also delete all of it&apos;s expenses forever!
                                <Button
                                    className={styles.categoryDeleteConfirmButton}
                                    onClick={async () => {
                                        await categoryDelete({ variables: { category_name: name } });
                                        router.reload();
                                    }}
                                >
                                    Delete {category.name}
                                </Button>
                            </Box>
                        </Popover >
                    </Box>
                </Box>
            </Paper>
        </Grid >
    );
}
