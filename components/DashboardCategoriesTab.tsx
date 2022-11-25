import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Divider, Popover, Stack, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Category, CategoryDeleteDocument, ExpenseTotalCostMultiple } from "../generated/graphql";
import { NewTabCallback } from "../utils/types";
import ClassIcon from '@mui/icons-material/Class';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import styles from "../styles/Dashboard.module.css";
import stylesNew from "../styles/DashboardCategoriesTab.module.css";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';

interface CategoryBoxProps {
    name: string;
    default_currency: string;
    newTab: NewTabCallback;
    key: number;
    totalCost?: ExpenseTotalCostMultiple;
    focusCategory: (category: string) => void;
}

function CategoryBox({ focusCategory, totalCost, name, newTab }: CategoryBoxProps) {

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

    let monthly: any;
    if (totalCost?.total?.length > 0) {
        monthly = (
            <Box>
                {totalCost?.total[0].price} {totalCost?.total[0].currency}
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

    return (
        <Grid item>
            <Paper className={styles.categoryBox}>
                <Box display="flex">
                    <Box>
                        <Box sx={{ overflowX: "hidden" }} display="flex">
                            <ClassIcon />
                            <Box sx={{ textTransform: "none", marginLeft: "10px" }} fontSize="lg"><b>{name}</b></Box>
                        </Box>

                        <Box
                            marginLeft="4px"
                            marginTop="4px"
                            maxHeight="70px"
                        >
                            <Box>This month:</Box>
                        </Box>
                        <Box className={styles.categoryTotalCostBox}>
                            {monthly}
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        flexDirection="column"
                        marginLeft="30px"
                        sx={{ backgroundColor: "var(--exxpenses-main-bg-color)" }}
                    >
                        <Tooltip title="New expense" placement="top" arrow>
                            <Button
                                className={stylesNew.categoryActionButton}
                                onClick={() => {
                                    focusCategory(name);
                                }}
                            >
                                <AddIcon sx={{ padding: "0", width: "26px", height: "26px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Details" arrow>
                            <Button
                                onClick={() => {
                                    newTab(name);
                                }}
                                className={stylesNew.categoryActionButton}
                            >
                                <ShowChartIcon sx={{ fill: "var(--exxpenses-light-green)", padding: "0", width: "26px", height: "26px" }} />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                            <Button
                                aria-describedby={id}
                                onClick={(e) => handleClick(e)}
                                className={stylesNew.categoryActionButton}
                            >
                                <DeleteIcon className={styles.categoryDeleteIcon} sx={{ padding: "0", width: "26px", height: "26px" }} />
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
                                    Delete {name}
                                </Button>
                            </Box>
                        </Popover >
                    </Box>
                </Box>
            </Paper>
        </Grid >
    );
}

interface DashboardCategoriesTabProps {
    categories: Category[];
    newTab: NewTabCallback;
    totalCosts?: ExpenseTotalCostMultiple[] | null;
    focusCategory: (cat: string) => void;
}

export default function DashboardCategoriesTab({ focusCategory, totalCosts, categories, newTab }: DashboardCategoriesTabProps) {

    let content: any;

    if (categories.length > 0) {
        content = (
            <Grid container spacing={3}>
                {categories.map((cat, idx) =>
                    <CategoryBox
                        focusCategory={focusCategory}
                        key={idx}
                        newTab={newTab}
                        default_currency={cat.default_currency}
                        name={cat.name}
                        totalCost={totalCosts?.find(c => c.category_name === cat.name)}
                    />
                )}
            </Grid>
        );
    }
    else {
        content = (
            <Box>
                You don&apos;t have any categories yet! Try adding some, to the left.
            </Box>
        )
    }

    return (
        <Box maxHeight="90%" height="90%" sx={{ overflowY: "auto" }} padding="10px" display="flex" flexDirection="column">
            <Typography variant="h5" style={{ marginBottom: "10px" }}>
                Your categories
            </Typography>
            <Box className={styles.categoriesBox}>
                {content}
            </Box>
        </Box >
    )
}
