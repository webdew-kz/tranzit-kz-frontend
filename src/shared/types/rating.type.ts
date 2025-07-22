/** @format */

import { IReview } from "./review.type";
import { User } from "./user.type";

export interface IRating {
    id?: string; // id
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления

    iin?: string;
    phoneNumber?: string;
    value?: number;

    user?: User;

    review?: IReview;
}
