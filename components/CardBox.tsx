import { Box } from "@mui/material";

export default function CardBox(props: any) {
    return (
        <Box
            sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
            paddingX="18px"
            paddingY="16px"
            display="flex"
            flexDirection="column"
            borderRadius="8px"
            height="fit-content"
            {...props}
        >
            {props.children}
        </Box>
    )
}
