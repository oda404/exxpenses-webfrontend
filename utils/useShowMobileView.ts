import { useEffect, useState } from "react";

const getMobileDetect = (userAgent: NavigatorID['userAgent']) => {
    const isAndroid = () => Boolean(userAgent.match(/Android/i))
    const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i))
    const isOpera = () => Boolean(userAgent.match(/Opera Mini/i))
    const isWindows = () => Boolean(userAgent.match(/IEMobile/i))
    const isSSR = () => Boolean(userAgent.match(/SSR/i))
    const isMobile = () => Boolean(isAndroid() || isIos() || isOpera() || isWindows())
    const isDesktop = () => Boolean(!isMobile() && !isSSR())
    return {
        isMobile,
        isDesktop,
        isAndroid,
        isIos,
        isSSR,
    }
}

const useShowMobileView = () => {
    const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({
        width: undefined,
        height: undefined,
    });

    const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
    const device = getMobileDetect(userAgent);

    if (device.isMobile() || device.isAndroid())
        return true;

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize.width! < 700;
}

export default useShowMobileView;
