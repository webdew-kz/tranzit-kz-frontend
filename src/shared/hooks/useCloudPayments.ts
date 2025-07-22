/** @format */

import { useEffect } from "react";

const useCloudPayments = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.tiptoppay.kz/bundles/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
};

export default useCloudPayments;
