/** @format */

import { format } from "date-fns";

export function isEndedDate(date: string) {
    const now = new Date();
    const end = new Date(date);

    return end < now;
}

export function checkEndDate(startDate: string, endDate: string) {
    const end = new Date(endDate);
    const start = new Date(startDate);

    if (isEndedDate(endDate)) {
        return "Заявка просрочена";
    } else {
        return `${format(start, "dd.MM")} - ${format(end, "dd.MM")}`;
    }
}
