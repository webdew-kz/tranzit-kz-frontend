/** @format */

import { IRating } from "./rating.type";
import { User } from "./user.type";

export interface IReview {
    id?: string; // id
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления

    value?: number;
    isBlocked?: boolean;
    adminComment?: string;

    iin?: string;
    phoneNumber?: string;
    title?: string;
    description?: string;
    tags?: string[];

    views: Views; // просмотры

    user?: User;

    rating?: IRating;

    averageRating?: string;
}

export interface Views {
    count: number; // количество просмотров
}
