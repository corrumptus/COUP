import { useEffect, useState } from "react";

export default function useDeviceWidth() {
    const [width, setWidth] = useState(0);

    function resize() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        resize();

        window.addEventListener('resize', resize);

        return () => window.removeEventListener('resize', resize);
    }, []);

    return width;
}