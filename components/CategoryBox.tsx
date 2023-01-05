import { useMutation } from "@apollo/client";
import { Grid, Paper, Button, Popover, Divider, Tooltip, Box, Link, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { CategoryDeleteDocument, Expense, Category } from "../generated/graphql";
import expensesToDaily, { DailyExpenses } from "../utils/expensesToDaily";
import MinifiedExpenseChart from "./MinifiedExpenseChart";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import expensesToTotal from "../utils/expensesToTotal";
import WarningIcon from '@mui/icons-material/Warning';

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
            <IconButton onClick={() => { window.location.assign("/free-account") }} sx={{ padding: "0", marginLeft: "10px" }}>
                <Tooltip title="This category is not counted towards the total. Click to learn more.">
                    <WarningIcon
                        sx={{ width: "20px", height: "20px", fill: "var(--exxpenses-warning-color)" }}
                    />
                </Tooltip>
            </IconButton>
        )
    }

    return (
        <Grid item maxWidth="100%" width={isMobileView ? "100%" : "auto"}>
            <Paper className={styles.categoryBox} sx={{ width: isMobileView ? "auto" : "150px" }}>
                <Box display="flex">
                    <Box minWidth="fit-content">
                        <Box alignItems="center" sx={{ overflowX: "hidden" }} display="flex">
                            <Link href={`/category/${category.name}`} sx={{ textDecoration: "none", display: "flex", "&:hover": { textDecoration: "none" } }}>
                                <ClassIcon
                                    sx={{ width: "20px", height: "20px" }}
                                />
                                <Box sx={{ textTransform: "none", marginLeft: "8px", fontSize: "14px" }}><b>{category.name}</b></Box>
                            </Link>
                            {warningIcon}
                        </Box>

                        <Box className={styles.categoryTotalCostBox}>
                            {monthly}
                        </Box>
                    </Box>

                    <Box style={{}} marginLeft="auto" marginRight="auto" width="70%">
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
                                        await categoryDelete({ variables: { category_name: category.name } });
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
