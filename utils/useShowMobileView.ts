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
    const [device, setDevice] = useState(getMobileDetect("SSR"));

    useEffect(() => {
        const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;
        setDevice(getMobileDetect(userAgent));

        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return device.isMobile() || windowSize.width! < 700;
}

export default useShowMobileView;
