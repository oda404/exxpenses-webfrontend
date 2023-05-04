import { IconButton, Box, Tooltip } from "@mui/material";
import Link from "next/link";
import { ExpenseDeleteDocument } from "../generated/graphql";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useState } from "react";
import HelpIcon from '@mui/icons-material/Help';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useMutation } from "@apollo/client";

interface CategoryTabExpenseProps {
    category_name: string;
    category_currency: string;
    expense: {
        id: string,
        price: number,
        currency: string,
        date: Date,
        description: string | null;
    }
}

export default function CategoryTabExpense({ category_name, category_currency, expense: { id, price, currency, date, description } }: CategoryTabExpenseProps) {

    const [expenseDelete] = useMutation(ExpenseDeleteDocument);

    const [detailsShown, setDetailsShown] = useState(false);

    let leadingIcon: any;
    if (true && currency !== category_currency) { // free account
        leadingIcon = (
            <Link href="/plans">
                <Tooltip title="This expense is not counted towards the total. Click to learn more.">
                    <HelpIcon
                        sx={{
                            width: "22px",
                            height: "22px",
                            fill: "var(--exxpenses-warning-color)",
                            '&:hover': {
                                cursor: "pointer"
                            }
                        }}
                    />
                </Tooltip>
            </Link>
        )
    }
    else {
        leadingIcon = (
            <RemoveCircleIcon sx={{ width: "22px", height: "22px", }} />
        )
    }

    return (
        <Box
            paddingX="6px"
            borderRadius="6px"
            marginLeft="5px"
            fontSize="14px"
            width="fit-content"
        >
            <Box
                display="flex"
                alignItems="center"
            >
                <Box marginRight="10px">
                    {leadingIcon}
                </Box>
                <Box>
                    <b>{currency}&nbsp;{price}</b>
                </Box>
                <IconButton onClick={() => setDetailsShown(!detailsShown)}>
                    {detailsShown ? <KeyboardArrowUpIcon sx={{ width: "20px", height: "20px" }} /> : <KeyboardArrowDownIcon sx={{ width: "20px", height: "20px" }} />}
                </IconButton>
            </Box>

            <Box alignItems="center" marginLeft="35px" marginBottom="10px" display={detailsShown ? "flex" : "none"}>
                <Box marginRight="10px">{description ? `"${description}"` : "No description"}</Box>
                <Tooltip title="Delete">
                    <IconButton sx={{ width: "22px", height: "22px" }} onClick={async () => {
                        await expenseDelete({
                            variables: {
                                deleteData: {
                                    expense_id: id,
                                    category_name: category_name
                                }
                            }
                        });

                        window.location.reload();
                    }}>
                        <DeleteOutlineIcon sx={{ width: "19px", height: "19px" }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}
