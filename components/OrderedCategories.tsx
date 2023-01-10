import { Box, Link } from "@mui/material";
import { MultiCategoryExpenses } from "../gql/ssr/expensesGetMultipleCategories";
import CategoryTotal from "../utils/CategoryTotal";

interface OrderedCategoriesProps {
    expensesMultipleCategories: MultiCategoryExpenses;
    categoryTotals: CategoryTotal[]
}

export default function OrderedCategories({ categoryTotals, expensesMultipleCategories }: OrderedCategoriesProps) {

    let content: any;
    if (categoryTotals.length === 0) {
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
            <Box>
                {
                    categoryTotals.map((c, idx) =>
                        <Link
                            sx={{
                                textDecoration: "none",
                                "&:hover": {
                                    textDecoration: "none",
                                }
                            }}
                            href={"/category/" + c.category}
                            key={idx}
                            display="flex"
                        >
                            <Box fontSize=".875rem" paddingY="10px" paddingX="4px" borderBottom="1px solid var(--exxpenses-main-border-color)" justifyContent="space-between" display="flex" width="100%">
                                <Box>
                                    <b>{c.category}</b>
                                </Box>
                                <Box>
                                    <b>{c.currency} {c.price}</b>
                                </Box>
                                <Box>
                                    <b>{c.percentage}%</b>
                                </Box>
                            </Box>
                        </Link>
                    )
                }
            </Box>
        )
    }

    let notice: any = null;
    if (categoryTotals.length < expensesMultipleCategories.categories.length) {
        notice = (
            <Box alignItems="center" display="flex" marginTop="20px">
                {/* <WarningIcon sx={{ width: "20px", height: "20px", fill: "var(--exxpenses-warning-color)" }} /> */}
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
            <Box marginBottom="10px" fontSize="22px">
                All categories
            </Box>
            <Box fontSize=".875rem" padding="4px" borderBottom="1px solid var(--exxpenses-main-border-color)" display="flex" justifyContent="space-between">
                <Box width="auto">
                    Category
                </Box>
                <Box width="auto">
                    Total
                </Box>
                <Box width="auto">
                    % of total
                </Box>
            </Box>
            {content}
            {notice}
        </Box>
    )
}
