import { useEffect } from "react";

function useAutoRefresh(callback, interval = 30000) {

    useEffect(() => {

        // Run immediately
        callback();

        // Then run every interval
        const timer = setInterval(() => {
            callback();
        }, interval);

        // Cleanup when component unmounts
        return () => clearInterval(timer);

    }, [callback, interval]);

}

export default useAutoRefresh;