/** @format */

import { formatDistanceToNow, format } from "date-fns";
import { ru } from "date-fns/locale";

export function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);

    const relative = formatDistanceToNow(date, { locale: ru, addSuffix: true });
    const time = format(date, "HH:mm");

    // return `${relative} в ${time}`;
    return `${relative}`;
}

function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
