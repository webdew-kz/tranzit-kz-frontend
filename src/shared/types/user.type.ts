/** @format */

export interface User {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string | null;
    phone: string | null;
    name: string;
    surname: string | null;
    city: string | null;
    avatar: string | null;
    role: string;
    whatsappNumbers: string[];
    telegramNumbers: string[];
    viberNumbers: string[];
    skypeNumbers: string[];
    otherNumbers: string[];
    subscriptionStartDate: string | null;
    subscriptionEndDate: string | null;
    subscriptionStatus: boolean | null;
    isVerified: boolean | null;
    isBlocked: boolean | null;
    documents: string[];
}
