/** @format */

export default function currencyTranslate(currency: string) {
    switch (currency) {
        case "USD":
            return "доллар";
        case "EUR":
            return "евро";
        case "CNY":
            return "юань";
        case "KZT":
            return "тенге";
        case "RUB":
            return "рубль";
        case "UZS":
            return "сум";
        case "KGS":
            return "сом";
        default:
            return currency;
    }
}
