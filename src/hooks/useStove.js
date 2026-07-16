import { useEffect, useState } from "react";
import { getStove } from "../services/fleetService";

function useStove(deviceCode) {

    const [stove, setStove] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    async function loadStove() {

        try {

            const data = await getStove(deviceCode);

            setStove(data);

            setError(null);

        }

        catch (err) {

            console.error(err);

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadStove();

        const interval = setInterval(loadStove, 10000);

        return () => clearInterval(interval);

    }, [deviceCode]);

    return {

        stove,

        loading,

        error,

        refresh: loadStove

    };

}

export default useStove;