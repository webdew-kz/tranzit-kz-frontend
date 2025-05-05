/** @format */

import countries from "i18n-iso-countries";
import ru from "i18n-iso-countries/langs/ru.json";

countries.registerLocale(ru);

export const getCountryCode = (countryName: string): string | undefined => {
    return countries.getAlpha2Code(countryName, "ru");
};
