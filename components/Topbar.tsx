import { Box, Link } from "@mui/material";
import useShowMobileView from "../utils/useShowMobileView";
import Image from 'next/image';

export default function Topbar() {

    const isMobileView = useShowMobileView();

    return (
        <Box
            display="flex"
            justifyContent={isMobileView ? "normal" : "center"}
            padding="8px"
            paddingX="18px"
            width="auto"
            bgcolor="var(--exxpenses-second-bg-color)"
        >
            <Link style={{ marginLeft: isMobileView ? "0px" : "-850px" }} href="/dashboard">
                <Image src="/exxpenses.svg" alt="Exxpenses" width={130} height={32} />
            </Link>
        </Box >
    )
}
