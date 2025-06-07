/** @format */

import { User } from "./user.type";

/** @format */
export interface Views {
    count: number; // количество просмотров
}

export interface ITrailer {
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления
    views?: Views; // количество просмотров, если есть
    id: string;
    city: string;
    variant: VariantEnum.TRAILER;
    trailerBrand: TrailerBrandEnum;
    typeTechnic: TypeTechnicEnum;
    typeTrailer: TypeTrailerEnum;
    qtyAxis: QtyAxisEnum;
    typeSuspension: TypeSuspensionEnum; // Тип подвески
    typeBrake: TypeBrakeEnum;
    photos: string[];
    weight: number;
    price: number;
    year: number;
    description?: string;
    status?: StatusEnum;
    exist?: ExistEnum;
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
    TRUCK, // грузовик
    TRAILER, // прицеп
    TRACTOR, // тягач
}

export enum TrailerBrandEnum {
    OTHER = "Другой",
    AMT_NV = "AMT N.V.",
    ASIA = "ASIA",
    AVIA = "AVIA",
    BAW = "BAW",
    BEIBEN_NORTH_BENZ = "BEIBEN (NORTH BENZ)",
    BMC = "BMC",
    BYD = "BYD",
    CAMC = "CAMC",
    CHANGAN = "CHANGAN",
    CHEVROLET = "CHEVROLET",
    CLW = "CLW",
    DAEWOO = "DAEWOO",
    DAF = "DAF",
    DAYUN_TRUCK = "DAYUN TRUCK",
    DERRY = "DERRY",
    DESOTO = "DESOTO",
    DFAC = "DFAC",
    DFSK = "DFSK",
    DONGFENG = "DONGFENG",
    EVM = "EVM",
    FARIZON = "FARIZON",
    FAW = "FAW",
    FIAT = "FIAT",
    FIAT_PROFESSIONAL = "FIAT PROFESSIONAL",
    FORD = "FORD",
    FORLAND = "FORLAND",
    FOTON = "FOTON",
    FREIGHTLINER = "FREIGHTLINER",
    FUSO_MITSUBISHI = "FUSO (MITSUBISHI)",
    GAC = "GAC",
    GEELY = "GEELY",
    GMC = "GMC",
    GROZ = "GROZ",
    HINO = "HINO",
    HKTC = "HKTC",
    HONGYAN = "HONGYAN",
    HOWO = "HOWO",
    HYUNDAI = "HYUNDAI",
    HYVA = "HYVA",
    IFA = "IFA",
    INTERNATIONAL = "INTERNATIONAL",
    INTERNATIONAL_WORKSTAR = "INTERNATIONAL WORKSTAR",
    ISUZU = "ISUZU",
    IVECO = "IVECO",
    IVECO_HONGYAN = "IVECO-HONGYAN",
    IVECO_LING_YE = "IVECO-LING YE",
    IVECO_AMT = "IVECO-АМТ",
    JAC = "JAC",
    JBC = "JBC",
    JIEFANG = "JIEFANG",
    JMC = "JMC",
    KAMA = "KAMA",
    KENWORTH = "KENWORTH",
    KIA = "KIA",
    KYC = "KYC",
    LADA_VAZ = "LADA (ВАЗ)",
    LGMG = "LGMG",
    MAN = "MAN",
    MAXUS = "MAXUS",
    MAZDA = "MAZDA",
    MERCEDES_BENZ = "MERCEDES-BENZ",
    MITSUBISHI = "MITSUBISHI",
    NISSAN = "NISSAN",
    NORTH_BENZ = "NORTH-BENZ",
    PETERBILT = "PETERBILT",
    PEUGEOT = "PEUGEOT",
    RENAULT = "RENAULT",
    SANY = "SANY",
    SCANIA = "SCANIA",
    SHACMAN = "SHACMAN",
    SHACMAN_SHAANXI = "SHACMAN (SHAANXI)",
    SHANDONG_KAMA = "SHANDONG KAMA",
    SHINERAY = "SHINERAY",
    SINOTRUK = "SINOTRUK",
    SINOTRUK_SITRAK = "SINOTRUK SITRAK",
    SISU = "SISU",
    SITRAK = "SITRAK",
    SSANGYONG = "SSANGYONG",
    STAR = "STAR",
    STEYR = "STEYR",
    TATA = "TATA",
    TATRA = "TATRA",
    TONLY = "TONLY",
    TOYOTA = "TOYOTA",
    VOLKSWAGEN = "VOLKSWAGEN",
    VOLVO = "VOLVO",
    WAW = "WAW",
    WEICHAI = "WEICHAI",
    WULING = "WULING",
    XCMG = "XCMG",
    XINFEIG = "XINFEIG",
    YUEJIN = "YUEJIN",
    YUTONG = "YUTONG",
    ZOOMLION = "ZOOMLION",
    ZUK = "ZUK",
    BELAZ = "БЕЛАЗ",
    VALDAY = "ВАЛДАЙ",
    GAZ = "ГАЗ",
    GAZ_SAZ = "ГАЗ-САЗ",
    GK_MZSA = "ГК МЗСА",
    ZIL = "ЗИЛ",
    IZH = "ИЖ",
    KAMAZ = "КАМАЗ",
    KRAZ = "КРАЗ",
    MAZ = "МАЗ",
    MAZ_MAN = "МАЗ-МАН",
    MZKT = "МЗКТ",
    NEFAZ = "НЕФАЗ",
    UAZ = "УАЗ",
    URAL = "УРАЛ",
}

export enum TypeTechnicEnum {
    TRAILER = "Прицеп", // Прицеп
    SEMI_TRAILER = "Полуприцеп", // Полуприцеп
}

export enum QtyAxisEnum {
    A1 = "1",
    A2 = "2",
    A3 = "3",
    A4 = "4",
    A5 = "5",
    A6 = "6",
    A7 = "7",
    A8 = "8",
    A9 = "9",
    A10 = "10 и более",
}

export enum TypeSuspensionEnum {
    BALANCE = "Балансированная", // балансированная
    RESSOR = "Рессорная", // рессорная
    PNEUMO = "Пневматическая", // пневматическая
    HYDRAULIC = "Гидравлическая", // гидравлическая
    SEMI_RESSOR = "Полурессорная", // полурессорная
}

export enum TypeBrakeEnum {
    DRUM = "Барабанные", // барабанная
    DISC = "Дисковые", // дисковая
    NO_BRAKE = "Отсутствует", // отсутствует
}

export enum TypeTrailerEnum {
    AVTOVOZ = "Автовоз", // автовоз
    BENZOVOZ = "Бензовоз", // бензовоз
    BITUMOVOZ = "Битумовоз", // битумовоз
    BORTOVOI = "Бортовой", // бортовой
    GAZOVOZ = "Газовоз", // газовоз
    LEGGOVOZ = "Для легкового авто", // для легкового авто
    ZERNOVOZ = "Зерновоз", // зерновоз
    TERMOFURGON = "Термофургон", // термофургон
    KTOVOZ = "Контейнеровоз", // контейнеровоз
    PANELEVOZ = "Панелевоз", // панелевоз
    PISECHEVAYA_CISTERNA = "Пищевая цистерна", // пищевая цистерна
    REFRIJERATOR = "Рефрижератор", // рефрижератор
    SAMOSVAL = "Самосвальный", // самосвальный
    TENT = "Тент", // тент
    TRACTOR = "Тракторный", // тракторный
    TRAL = "Трал (тяжеловоз)", // трал (тяжеловоз)
    CHIMICHESKAYA_CISTERNA = "Химическая цистерна", // химическая цистерна
    CELNOMETALLICHESKIY = "Цельнометаллический", // цельнометаллический
    CEMENTOVOZ = "Цементовоз", // цементовоз
    SHTORNO_BORTOVOI = "Шторно-бортовой", // шторно-бортовой
    SHTORNIY = "Шторный", // шторный
    SHCHEPOVOZ = "Щеповоз", // щеповоз
    DRUGOI = "Другой тип", // другой тип
}

export enum ExistEnum {
    IN_STOCK = "В наличии", // в наличии
    ON_ORDER = "Под заказ", // под заказ
}

export enum StatusEnum {
    NEW = "Новый", // новый
    USED = "С пробегом", // б/у
}
