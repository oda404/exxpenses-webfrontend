import { Box } from "@mui/material";

export default function CardBox(props: any) {
    return (
        <Box
            sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
            paddingX="20px"
            paddingY="16px"
            display="flex"
            flexDirection="column"
            borderRadius="8px"
            height="fit-content"
            marginTop="15px"
            {...props}
        >
            {props.children}
        </Box>
    )
}
