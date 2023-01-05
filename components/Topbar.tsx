import { Box, Link } from "@mui/material";
import useShowMobileView from "../utils/useShowMobileView";
import Image from 'next/image';

export default function Topbar() {

    const isMobileView = useShowMobileView();

    return (
        <Box display="flex" justifyContent={isMobileView ? "normal" : "center"} padding="5px" paddingX="18px" paddingTop="18px" width="auto" borderBottom="1px solid var(--exxpenses-main-border-color)">
            <Link style={{ marginLeft: isMobileView ? "0px" : "-850px" }} href="/dashboard">
                <Image src="/exxpenses.svg" alt="Exxpenses" width="130px" height="25px" />
            </Link>
        </Box>
    )
}
