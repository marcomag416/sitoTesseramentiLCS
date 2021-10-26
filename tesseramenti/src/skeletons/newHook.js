import { useState, useEffect } from "react";

const useProva = (param) => {
    const [data, setData] = useState(null);

    useEffect(() => {

    }, [param]);

    return [data];
};

export default useFetch;