/** @format */

import { User } from "./user.type";

/** @format */
export interface Views {
    count: number; // количество просмотров
}

export interface IParts {
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления
    views?: Views; // количество просмотров, если есть

    id: string;
    city: string;
    photos: string[];
    price: number;

    title?: string;
    description?: string;
    brand?: PartsBrandEnum;
    isDelivery: boolean;
    isArchived: boolean;

    status?: StatusEnum; // Assuming StatusEnum is a string

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

export enum VariantEnum {
    PARTS, // грузовик
    TRAILER, // прицеп
    TRACTOR, // тягач
}

export enum PartsBrandEnum {
    OTHER = "Другой",
    ASTRA = "ASTRA",
    AVIA = "Avia",
    BAW = "BAW",
    BEIBEN_NORTH_BENZ = "Beiben (North Benz)",
    BMC = "BMC",
    BYD = "BYD",
    CAMC = "CAMC",
    CATERPILLAR = "Caterpillar",
    CHAMELEON = "Chameleon",
    CHANGAN = "Changan",
    CHEVROLET = "Chevrolet",
    CLW = "CLW",
    DAF = "DAF",
    DAEWOO = "Daewoo",
    DAYUN = "Dayun",
    DAYUN_PARTS = "Dayun Parts",
    DESOTO = "DeSoto",
    DERRY = "Derry",
    DFAC = "Dfac",
    DONGFENG = "Dongfeng",
    EVM = "EVM",
    FAW = "FAW",
    FARIZON = "Farizon",
    FIAT = "Fiat",
    FIAT_PROFESSIONAL = "Fiat Professional",
    FORD = "Ford",
    FORLAND = "Forland",
    FOTON = "Foton",
    FREIGHTLINER = "Freightliner",
    FUSO_MITSUBISHI = "Fuso (Mitsubishi)",
    GAC = "GAC",
    GEELY = "Geely",
    GMC = "GMC",
    GROZ = "Groz",
    HINO = "Hino",
    HONDA = "Honda",
    HONGYAN = "Hongyan",
    HOWO = "Howo",
    HYUNDAI = "Hyundai",
    HYVA = "Hyva",
    IFA = "IFA",
    INTERNATIONAL = "International",
    INTERNATIONAL_WORKSTAR = "International WorkStar",
    ISUZU = "Isuzu",
    IVECO = "IVECO",
    IVECO_HONGYAN = "IVECO-Hongyan",
    JAC = "JAC",
    JBC = "JBC",
    JIEFANG = "Jiefang",
    JINPENG = "Jinpeng",
    JMC = "JMC",
    KAMA = "Kama",
    KENWORTH = "Kenworth",
    KIA = "Kia",
    KYC = "KYC",
    LADA = "LADA (ВАЗ)",
    LGMG = "LGMG",
    MAN = "MAN",
    MAZDA = "Mazda",
    MEILLER_KIPPER = "Meiller Kipper",
    MERCEDES_BENZ = "Mercedes-Benz",
    MITSUBISHI = "Mitsubishi",
    NISSAN = "Nissan",
    NORTH_BENZ = "North-Benz",
    OPEL = "Opel",
    PEUGEOT = "Peugeot",
    RENAULT = "Renault",
    ROBUR = "Robur",
    SANY = "Sany",
    SCANIA = "Scania",
    SHAANXI = "Shaanxi",
    SHACMAN = "Shacman",
    SHACMAN_SHAANXI = "Shacman (Shaanxi)",
    SHANDONG_KAMA = "Shandong KAMA",
    SHINERAY = "Shineray",
    SINOTRUK = "Sinotruk",
    SINOTRUK_SITRAK = "Sinotruk Sitrak",
    SITRAK = "Sitrak",
    SSANGYONG = "SsangYong",
    STAR = "Star",
    STEYR = "Steyr",
    TATA = "TATA",
    TATRA = "Tatra",
    TONLY = "Tonly",
    TOYOTA = "Toyota",
    VOLKSWAGEN = "Volkswagen",
    VOLVO = "Volvo",
    WEICHAI = "Weichai",
    WULING = "Wuling",
    XCMG = "XCMG",
    XINFEIG = "XINFEIG",
    YUEJIN = "Yuejin",
    YUTONG = "Yutong",
    ZOOMLION = "Zoomlion",
}

export enum StatusEnum {
    NEW = "Новый", // новый
    USED = "Б/у", // б/у
}
