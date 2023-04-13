import { Box } from "@mui/material";

export default function CardBox(props: any) {
    return (
        <Box
            sx={{ background: "var(--exxpenses-second-bg-color)", overflowY: "auto" }}
            padding="14px"
            display="flex"
            flexDirection="column"
            borderRadius="8px"
            height="fit-content"
            boxShadow="rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px"
            {...props}
        >
            {props.children}
        </Box>
    )
}
