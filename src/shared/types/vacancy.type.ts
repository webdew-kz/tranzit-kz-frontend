/** @format */

import { User } from "./user.type";

/** @format */

export enum ExperienceTypeEnum {
    WITH_EXPERIENCE = "С опытом",
    WITHOUT_EXPERIENCE = "Без опыта",
}

export enum TypeJobEnum {
    REMOTE = "Удаленно",
    STATE = "В штате",
}

export enum JobEnum {
    DRIVER = "Водитель-дальнобойщик",
    DISPATCHER = "Диспетчер",
    LOG_DISPATCHER = "Логист-Диспечер",
    FORWARDER = "Экспедитор",
    MANAGER = "Менеджер по работе с клиентами",
    OTHER = "Другое",
}

export interface Views {
    count: number; // количество просмотров
}

export interface IVacancy {
    id?: string; // id
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления

    job: JobEnum;
    otherJob: string;
    typeJob: TypeJobEnum[];

    city: string;
    description: string;
    work_schedule_at: string;
    work_schedule_to: string;

    salary_at: number;
    salary_to: number;

    experience_type: ExperienceTypeEnum[];

    views: Views; // просмотры

    isArchived?: boolean; // статус архивирования

    userName: string;
    userPhone: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    skype?: string;
    user: User;
}
