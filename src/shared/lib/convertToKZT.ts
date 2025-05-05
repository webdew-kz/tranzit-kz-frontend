/** @format */

import { CurrencyRate } from "../hooks/useCurrencyRates";

export function convertToKZT(
    amount: number,
    currency: string,
    rates: CurrencyRate[]
): number {
    if (!amount) {
        throw new Error("Не указана сумма для конвертации");
    }

    if (!currency) {
        throw new Error("Не указана валюта для конвертации");
    }

    if (!rates || rates.length === 0) {
        throw new Error("Не указаны курсы валют для конвертации");
    }

    if (currency === "KZT") {
        return amount; // Если тенге, конвертация не нужна
    }

    const rateItem = rates.find((rate) => rate.title === currency);

    if (!rateItem) {
        throw new Error(`Не найден курс для валюты: ${currency}`);
    }

    const rate = parseFloat(rateItem.rate); // вдруг в XML запятая вместо точки

    return Math.round(amount * rate);
}

export function convertFromKZT(
    baseAmountPriceKZT: number,
    setAmountPrice: (amountPrice: number) => void,
    baseAmountTariffKZT: number,
    setAmountTariff: (amountTariff: number) => void,
    currency: string,
    rates: CurrencyRate[],
    setCurrency: (currency: string) => void
): void {
    if (currency === "KZT") {
        setAmountPrice(Math.round(baseAmountPriceKZT));
        setAmountTariff(Math.round(baseAmountTariffKZT));
        setCurrency(currency); // Установить валюту в тенге
        return;
    }

    const rateItem = rates.find((rate) => rate.title === currency);

    if (!rateItem) {
        throw new Error(`Не найден курс для валюты: ${currency}`);
    }

    const rate = parseFloat(rateItem.rate);

    setAmountPrice(baseAmountPriceKZT / rate);
    setAmountTariff(baseAmountTariffKZT / rate);

    setCurrency(currency);
}

export function getCurrencySymbol(currency: string): string {
    switch (currency) {
        case "KZT":
            return "₸";
        case "USD":
            return "$";
        case "EUR":
            return "€";
        case "RUB":
            return "₽";
        case "CNY":
            return "¥";
        case "UZS":
            return "сум"; // узбекский сум (можно просто "сум")
        case "KGS":
            return "сом"; // киргизский сом
        default:
            return currency; // если код валюты неизвестен — вернуть его как есть
    }
}
