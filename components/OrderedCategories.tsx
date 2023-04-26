import { Box, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";
import { tableCellClasses } from "@mui/material/TableCell";

interface OrderedCategoriesProps {
    expensesMultipleCategories: MultiCategoryExpenses;
    categoryTotals: CategoryTotal[];
    total_price: number;
}

export default function OrderedCategories({ total_price, categoryTotals, expensesMultipleCategories }: OrderedCategoriesProps) {

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
                            <TableCell sx={{ borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }}>Category</TableCell>
                            <TableCell sx={{ borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right">Total</TableCell>
                            <TableCell sx={{ borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right">% of total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryTotals.map((c, idx) => {
                            let perc_string = `${c.percentage}%`;
                            if (total_price == 0)
                                perc_string = "-";

                            return (
                                <TableRow key={idx}>
                                    <TableCell sx={{ borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} component="th" scope="row">
                                        <b>{c.category}</b>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right"><b>{c.currency} {c.price}</b></TableCell>
                                    <TableCell sx={{ borderBottom: "1px solid var(--exxpenses-main-border-color)", color: "var(--exxpenses-main-color)" }} align="right"><b>{perc_string}</b></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    let notice: any = null;
    if (categoryTotals.length < expensesMultipleCategories.categories.length) {
        notice = (
            <Box alignItems="center" display="flex" marginTop="20px">
                <Link
                    fontSize="14px"
                    sx={{
                        color: "var(--exxpenses-warning-color)",
                        textDecoration: "none",
                        "&:hover": {
                            textDecoration: "none"
                        }
                    }}
                    href="/free-account"
                >
                    Some categories are missing. Click to learn more.
                </Link>
            </Box>
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
