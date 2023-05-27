import { Box, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";

interface OrderedCategoriesProps {
    expensesMultipleCategories: MultiCategoryExpenses;
    categoryTotals: CategoryTotal[];
    lm_category_totals: CategoryTotal[];
    total_price: number;
    custom_period: boolean;
}

export default function OrderedCategories({ total_price, categoryTotals, expensesMultipleCategories, lm_category_totals, custom_period }: OrderedCategoriesProps) {

    let content: any;
    if (categoryTotals.length === 0) {
        // should not happen
        content = (
            <Box fontSize=".875rem" paddingY="10px" paddingX="4px" borderBottom="1px solid var(--exxpenses-main-border-color)" justifyContent="space-between" display="flex" marginBottom="12px" width="100%">
                <Box>
                    <b>---</b>
                </Box>
                <Box>
                    <b>---</b>
                </Box>
                <Box>
                    <b>---</b>
                </Box>
            </Box>
        )
    }
    else {
        content = (
            <TableContainer component={Paper} sx={{ background: "var(--exxpenses-second-bg-color)" }}>
                <Table padding="normal" size="small">
                    <TableHead >
                        <TableRow>
                            <TableCell sx={{ fontSize: "12px", borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }}>Category</TableCell>
                            <TableCell sx={{ fontSize: "12px", borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right">{custom_period ? "Comparison per." : "Last month"}</TableCell>
                            <TableCell sx={{ fontSize: "12px", borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right">{custom_period ? "Showing per." : "This month"}</TableCell>
                            <TableCell sx={{ fontSize: "12px", borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right">% of total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryTotals.map((c, idx) => {
                            let perc_string = `${c.percentage}%`;
                            if (total_price == 0)
                                perc_string = "-";

                            let lm_cat = lm_category_totals.find(cat => cat.category === c.category);
                            let lm_total_content: any;
                            if (lm_cat === undefined) {
                                // should not happen
                                lm_total_content = "-";
                            }
                            else {
                                lm_total_content = (
                                    <Box>
                                        {lm_cat.currency} {lm_cat.price}
                                    </Box>
                                )
                            }

                            return (
                                <TableRow key={idx}>
                                    <TableCell
                                        onClick={() => { window.location.assign(`/category/${c.category}`) }}
                                        sx={{
                                            borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)", "&:hover": {
                                                cursor: "pointer"
                                            }
                                        }}
                                        component="th"
                                        scope="row"
                                    >
                                        <Box sx={{ fontSize: "12px" }}><b>{c.category}</b></Box>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => { window.location.assign(`/category/${c.category}`) }}
                                        sx={{
                                            borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)", "&:hover": {
                                                cursor: "pointer"
                                            }
                                        }}
                                        component="th"
                                        scope="row"
                                        align="right"
                                    >
                                        <Box sx={{ fontSize: "12px" }}><b>{lm_total_content}</b></Box>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => { window.location.assign(`/category/${c.category}`) }}
                                        sx={{
                                            borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)", "&:hover": {
                                                cursor: "pointer"
                                            }
                                        }}
                                        component="th"
                                        scope="row"
                                        align="right"
                                    >
                                        <Box sx={{ fontSize: "12px" }}><b>{c.currency} {c.price}</b></Box>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => { window.location.assign(`/category/${c.category}`) }}
                                        sx={{
                                            borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)", "&:hover": {
                                                cursor: "pointer"
                                            }
                                        }}
                                        component="th"
                                        scope="row"
                                        align="right"
                                    >
                                        <Box sx={{ fontSize: "12px" }}><b>{perc_string}</b></Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    let notice: any = null;
    if (categoryTotals.length < expensesMultipleCategories.categories.length) {
        notice = (
            <Box fontSize="12px" color="var(--exxpenses-warning-color)" alignItems="center" display="flex" marginTop="20px" >
                {/* <Link
                    fontSize="14px"
                    sx={{
                        color: "var(--exxpenses-warning-color)",
                        textDecoration: "none",
                        "&:hover": {
                            textDecoration: "none"
                        }
                    }}
                    href="/plans"
                > */}
                Some categories are missing, due to them having different currencies.This is a feature that is going to be implemented in the future.Thank you for understanding!
                {/* </Link> */}
            </Box >
        )
    }

    return (
        <Box>
            <Box marginBottom="10px" fontSize="20px">
                Categories
            </Box>
            {content}
            {notice}
        </Box>
    )
}
