/** @format */

export interface User {
    id: string;
    createdAt: string;
    updatedAt: string;
    balance?: number;
    login: string;
    email: string | null;
    phone: string | null;
    name: string;
    surname: string | null;
    city: string | null;
    avatar: string | null;
    role: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    skype?: string;
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    subscriptionStatus: boolean | null;
    isVerified: boolean | null;
    isBlocked: boolean | null;
    isRegistered: boolean | null;
    registeredDate: string;
    documents: string[];
    password?: string;
}
