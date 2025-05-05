/** @format */

// hooks/useCurrencyRates.ts
import { useEffect, useState, useMemo } from "react";

interface RawCurrencyRate {
    title: string;
    rate: string; // приходит с сервера
}

export interface CurrencyRate {
    title: string;
    rate: string; // уже нормальное число
}

export function useCurrencyRates() {
    const [rawRates, setRawRates] = useState<RawCurrencyRate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRates() {
            try {
                const res = await fetch(`${process.env.SERVER_URL}/currency`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    // body: JSON.stringify(data),
                    credentials: "include",
                });

                const data = await res.json();

                if (!data.length) {
                    await fetch(`${process.env.SERVER_URL}/currency/update`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        // body: JSON.stringify(data),
                        credentials: "include",
                    });

                    const res = await fetch(
                        `${process.env.SERVER_URL}/currency`,
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                            // body: JSON.stringify(data),
                            credentials: "include",
                        }
                    );

                    const data = await res.json();

                    setRawRates(data);

                    return;
                }
                setRawRates(data);
            } catch (error) {
                console.error("Failed to load currency rates", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRates();
    }, []);

    // Нормализация через useMemo
    const rates: CurrencyRate[] = useMemo(() => {
        return rawRates.map(({ title, rate }) => ({
            title,
            rate: parseFloat(rate.replace(",", ".")).toString(), // преобразование один раз
        }));
    }, [rawRates]);

    return { rates, loading };
}
