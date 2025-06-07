/** @format */

import { User } from "./user.type";

/** @format */
export interface Views {
    count: number; // количество просмотров
}

export interface ITractor {
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления
    views?: Views; // количество просмотров, если есть
    id: string;
    city: string;
    variant: VariantEnum.TRACTOR; // Assuming VariantEnum is a string
    photos: string[];
    year: number;
    price: number;
    status?: StatusEnum; // Assuming StatusEnum is a string
    exist?: ExistEnum; // Assuming ExistEnum is a string
    mileage?: number;

    tractorBrand: TractorBrandEnum;
    description?: string;
    volumeEngine?: number;
    powerEngine?: number;
    typeEngine?: TypeEngineEnum; // Assuming TypeEngineEnum is a string
    drive?: DriveEnum; // Assuming DriveEnum is a string
    transmission?: TransmissionEnum; // Assuming TransmissionEnum is a string
    steering?: SteeringEnum; // Assuming SteeringEnum is a string
    tractorWheel?: TractorWheelEnum; // Assuming TractorWheelEnum is a string
    typeCabin?: TypeCabinEnum; // Тип кабины: одинарная, двойная, тройная
    cabinSuspension?: CabinSuspensionEnum; // Подвеска кабины
    viewsId?: string;
    userId?: string;
    userName?: string;
    userPhone?: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    skype?: string;

    user: User;
}

export enum TypeCabinEnum {
    SEAT_2_WITHOUT_BED = "2-х местная без спального места", // 2-х местная без спального места
    SEAT_2_WITH_1_BED = "2-х местная с 1 спальным местом", // 2-х местная с 1 спальным местом
    SEAT_2_WITH_2_BEDS = "2-х местная с 2 спальными местами", // 2-х местная с 2 спальными местами
    SEAT_3_WITHOUT_BED = "3-х местная без спального места", // 3-х местная без спального места
    SEAT_3_WITH_1_BED = "3-х местная с 1 спальным местом", // 3-х местная с 1 спальным местом
}

export enum CabinSuspensionEnum {
    BALANCE = "Балансированная", // балансированная
    RESSOR = "Рессора", // рессора
    PNEUMO = "Пневмо", // пневмо
    HYDRAULIC = "Гидравлическая", // гидравлическая
    SEMI_RESSOR = "Полурессора", // полурессора
}

export enum VariantEnum {
    TRUCK, // грузовик
    TRAILER, // прицеп
    TRACTOR, // тягач
}

export enum TractorBrandEnum {
    AMT_NV = "AMT N.V.",
    BAIC = "BAIC",
    BEIBEN_NORTH_BENZ = "Beiben (North Benz)",
    CAMC = "CAMC",
    CHENGLONG = "ChengLong",
    DAF = "DAF",
    DAEWOO = "Daewoo",
    DAYUN = "Dayun",
    DONGFENG = "Dongfeng",
    DOOSAN = "Doosan",
    ERF_MAN_TRUCK = "ERF (MAN Truck)",
    FAW = "FAW",
    FORD = "Ford",
    FOTON = "Foton",
    FREIGHTLINER = "Freightliner",
    FUSO_MITSUBISHI = "Fuso (Mitsubishi)",
    HINO = "Hino",
    HOWO = "Howo",
    HYUNDAI = "Hyundai",
    IVECO = "IVECO",
    IVECO_HONGYAN = "IVECO–Hongyan",
    IVECO_LING_YE = "IVECO–Ling Ye",
    INTERNATIONAL = "International",
    ISUZU = "Isuzu",
    IVECO_AMT = "Iveco-AMT",
    JAC = "JAC",
    KALMAR = "Kalmar",
    KENWORTH = "Kenworth",
    MAN = "MAN",
    MACK = "Mack",
    MAGIRUS = "Magirus",
    MERCEDES_BENZ = "Mercedes-Benz",
    NISSAN = "Nissan",
    PETERBILT = "Peterbilt",
    RENAULT = "Renault",
    SANY = "Sany",
    SCANIA = "Scania",
    SHACMAN_SHAANXI = "Shacman (Shaanxi)",
    SINOTRUK_HANIA = "Sinotruk Hania",
    SINOTRUK_SITRAK = "Sinotruk Sitrak",
    SISU = "Sisu",
    SKODA_LIAZ = "Skoda LIAZ",
    STERLING = "Sterling",
    STEYR = "Steyr",
    TATRA = "Tatra",
    TERBERG = "Terberg",
    TESLA = "Tesla",
    TIANHONG = "Tianhong",
    RUSICH_KZKT = "Русич (КЗКТ)",
    TONAR = "Тонар",
    URAL = "Урал",
    YAROVIT_MOTORS = "ЯРОВИТ МОТОРС",
    TITAN = "Titan",
    VOLKSWAGEN = "Volkswagen",
    VOLVO = "Volvo",
    WESTERN_STAR = "Western Star",
    XCMG = "XCMG",
    YOUNGMAN = "Youngman",
    BZKT = "БЗКТ",
    VALDAY = "Валдай",
    GAZ = "ГАЗ",
    GK_MZSA = "ГК МЗСА",
    ZIL = "ЗиЛ",
    KAMAZ = "КамАЗ",
    KRAZ = "КрАЗ",
    MAZ = "МАЗ",
    MAZ_MAN = "МАЗ-МАН",
    MZKT = "МЗКТ",
    OTHER = "Другой",
}

export enum ExistEnum {
    IN_STOCK = "В наличии", // в наличии
    ON_ORDER = "Под заказ", // под заказ
}

export enum StatusEnum {
    NEW = "Новый", // новый
    USED = "С пробегом", // б/у
}

export enum DriveEnum {
    FRONT_WHEEL_DRIVE = "Передний привод", // передний привод
    REAR_WHEEL_DRIVE = "Задний привод", // задний привод
    ALL_WHEEL_DRIVE = "Полный привод", // полный привод
    FULL_TIME_ALL_WHEEL_DRIVE = "Постоянный полный привод", // постоянный полный привод
    PART_TIME_ALL_WHEEL_DRIVE = "Подключаемый полный привод", // подключаемый полный привод
    REAR_WHEEL_DRIVE_WITH_FRONT_WHEEL = "Задний привод с передним подключаемым", // задний привод с передним подключаемым
}

export enum TransmissionEnum {
    AUTOMATIC = "Автоматическая", // автоматическая
    MECHANICAL = "Механическая", // механическая
    SEMI_AUTOMATIC = "Полуавтоматическая", // полуавтоматическая
}

export enum TractorWheelEnum {
    W4X2 = "4х2", // 4х2
    W4X4 = "4х4", // 4х4
    W6X2 = "6х2", // 6х2
    W6X4 = "6х4", // 6х4
    W8X2 = "8х2", // 8х2
    W8X4 = "8х4", // 8х4
    W8X6 = "8х6", // 8х6
    W8X8 = "8х8", // 8х8
    OTHER = "Другое", // другое
}

export enum TypeEngineEnum {
    DIESEL = "Дизель", // дизель
    GAS = "Газ", // газ
    GASOLINE = "Бензин", // бензин
    ELECTRIC = "Электрический", // электрический
    HYBRID = "Гибридный", // гибридный
    DIESEL_ON_GAS = "Дизель на газу", // дизель на газу
    GASOLINE_ON_GAS = "Бензин на газу", // бензин на газу
}

export enum SteeringEnum {
    LEFT = "Левый", // левый
    RIGHT = "Правый", // правый
}
