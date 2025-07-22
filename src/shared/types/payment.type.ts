/** @format */

import { User } from "./user.type";

export interface IPayment {
    id?: string; // id
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления

    amount?: number;

    user?: User;
}
