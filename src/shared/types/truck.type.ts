/** @format */

import { User } from "./user.type";

/** @format */
export interface Views {
    count: number; // количество просмотров
}

export interface ITruck {
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления
    views?: Views; // количество просмотров, если есть
    id: string;
    city: string;
    variant: VariantEnum.TRUCK; // Assuming VariantEnum is a string
    truckBrandId: string;
    truckBrandModelId: string;
    truckBrand: TruckBrandEnum; // Assuming TruckBrandEnum is an object with id and name
    photos: string[];
    typeTruck: TypeTruckEnum; // Assuming TypeTruckEnum is a string
    weight: number;
    price: number;
    year: number;
    description?: string;
    mileage?: number;
    volumeEngine?: number;
    powerEngine?: number;
    typeEngine?: TypeEngineEnum; // Assuming TypeEngineEnum is a string
    status?: StatusEnum; // Assuming StatusEnum is a string
    exist?: ExistEnum; // Assuming ExistEnum is a string
    drive?: DriveEnum; // Assuming DriveEnum is a string
    transmission?: TransmissionEnum; // Assuming TransmissionEnum is a string
    steering?: SteeringEnum; // Assuming SteeringEnum is a string
    truckWheel?: TruckWheelEnum; // Assuming TruckWheelEnum is a string
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

export interface ITruckBrand {
    id: string;
    name: TruckBrandEnum; // Assuming TruckBrandEnum is a string
    models: ITruckBrandModel[];
    trades?: ITruck[];
}

export interface ITruckBrandModel {
    id: string;
    name: TruckBrandModelEnum; // название модели грузовика
    brandId: string;
    trades?: ITruck[]; // Assuming trades is an array of trucks related to this model
}

export enum VariantEnum {
    TRUCK, // грузовик
    TRAILER, // прицеп
    TRACTOR, // тягач
}

export enum TruckBrandEnum {
    OTHER = "Другое",
    CARGOBULL = "Cargobull",
    SCHMITZ = "Schmitz",
    AMT_NV = "AMT N.V.",
    ASHOK_LEYLAND = "ASHOK LEYLAND",
    ASTRA = "Astra",
    AVIA = "Avia",
    BAIC = "BAIC",
    BAW = "BAW",
    BMC = "BMC",
    BYD = "BYD",
    BEDFORD = "Bedford",
    BEIBEN_NORTH_BENZ = "Beiben (North Benz)",
    BUCHER = "Bucher",
    C_AND_C_TRUCKS = "C&C Trucks",
    CAMC = "CAMC",
    CANMAX = "Canmax",
    CHAMELEON = "Chameleon",
    CHANGAN = "Changan",
    CHEVROLET = "Chevrolet",
    CHENGLONG = "ChengLong",
    CLW = "CLW",
    DAF = "DAF",
    DMI = "DMI",
    DAIHATSU = "Daihatsu",
    DAEWOO = "Daewoo",
    DAYUN = "Dayun",
    DEVELON = "Develon",
    DESOTO = "DeSoto",
    DODGE = "Dodge",
    DONGFENG = "Dongfeng",
    DONGYANG = "Dongyang",
    DOOSAN = "Doosan",
    ERF_MAN_TRUCK = "ERF (MAN Truck)",
    FAW = "FAW",
    FASSI = "Fassi",
    FOTON = "Foton",
    FORD = "Ford",
    FORLAND = "Forland",
    FREIGHTLINER = "Freightliner",
    FUSO_MITSUBISHI = "Fuso (Mitsubishi)",
    GMC = "GMC",
    GAZ = "ГАЗ",
    GAZ_SAZ = "ГАЗ-САЗ",
    GK_MZSA = "ГК МЗСА",
    GINAF = "Ginaf",
    GREAT_WALL = "Great Wall",
    HKTC = "HKTC",
    HINO = "Hino",
    HOWO = "Howo",
    HYUNDAI = "Hyundai",
    HYVA = "Hyva",
    IFA = "IFA",
    INMAN = "ИНМАН",
    INTERNATIONAL = "International",
    ISUZU = "Isuzu",
    IVECO = "IVECO",
    IVECO_HONGYAN = "IVECO-Hongyan",
    IVECO_LING_YE = "IVECO-Ling Ye",
    IVECO_AMT = "Iveco-AMT",
    JAC = "JAC",
    JBC = "JBC",
    JMC = "JMC",
    KANGLIM = "Kanglim",
    KAZ = "КАЗ",
    KALMAR = "Kalmar",
    KAMAZ = "КамАЗ",
    KENWORTH = "Kenworth",
    KIA = "Kia",
    KRAZ = "КрАЗ",
    LEEO = "Leeo",
    LGMG = "LGMG",
    LOVOL = "Lovol",
    MAN = "MAN",
    MACK = "Mack",
    MAGIRUS = "Magirus",
    MAXUS = "Maxus",
    MAZDA = "Mazda",
    MAZ = "МАЗ",
    MAZ_MAN = "МАЗ-МАН",
    MERCEDES_BENZ = "Mercedes-Benz",
    MITSUBISHI = "Mitsubishi",
    MWM = "MWM",
    MUDAN = "Mudan",
    NAVECO = "Naveco",
    NEXTEM = "Nextem",
    NISSAN = "Nissan",
    PETERBILT = "Peterbilt",
    PEUGEOT = "Peugeot",
    PRAGA = "Praga",
    RENAULT = "Renault",
    ROBUR = "Robur",
    RUSICH_KZKT = "Русич (КЗКТ)",
    SAIC = "SAIC",
    SAMSUNG = "Samsung",
    SANY = "Sany",
    SAURER = "Saurer",
    SCANIA = "Scania",
    SESPEL = "Сеспель",
    SHACMAN_SHAANXI = "Shacman (Shaanxi)",
    SHANDONG_KAMA = "Shandong KAMA",
    SHENYE = "Shenye",
    SHIFENG = "ShiFeng",
    SIDA_STEYR = "Sida Steyr",
    SILANT = "Silant",
    SINOTRUK_HANIA = "Sinotruk Hania",
    SINOTRUK_SITRAK = "Sinotruk Sitrak",
    SISU = "Sisu",
    SKODA = "Skoda",
    SKODA_LIAZ = "Skoda LIAZ",
    SKYWELL = "Skywell",
    STAR = "Star",
    STEYR = "Steyr",
    STERLING = "Sterling",
    STUDEBAKER = "Studebaker",
    TAM = "TAM",
    TATA = "TATA",
    TATRA = "Tatra",
    TERBERG = "Terberg",
    TESLA = "Tesla",
    TITAN = "Titan",
    TIEMA = "Tiema",
    TIANHONG = "Tianhong",
    TOYOTA = "Toyota",
    TONAR = "Тонар",
    TREKOL = "Трэккол",
    URAL = "Урал",
    VALDAI = "Валдай",
    VOLKSWAGEN = "Volkswagen",
    VOLVO = "Volvo",
    WAW = "WAW",
    WEICHAI = "Weichai",
    WESTERN_STAR = "Western Star",
    XCMG = "XCMG",
    XINFEIG = "XINFEIG",
    YOUNGMAN = "Youngman",
    YUCHAI = "Yuchai",
    YUEJIN = "Yuejin",
    YUTONG = "Yutong",
    ZIS = "ЗИС",
    ZUK = "Zuk",
    ZIL = "ЗиЛ",
    BZKT = "БЗКТ",
    BELAZ = "БелАЗ",
    BURLAK = "Бурлак",
    VVAZ = "ВвАЗ",
    VEZDEHODY_GVA = "Вездеходы ГВА",
    KHANT = "ХАНТ",
    YAROVIT_MOTORS = "ЯРОВИТ МОТОРС",
    NEFAZ = "НефАЗ",
    MZKT = "МЗКТ",
    AMUR = "АМУР",
}

export enum TruckBrandModelEnum {
    ANY = "Любая модель", // любая модель грузовика
    // Add specific truck brand models here if needed
}

export enum TypeTruckEnum {
    AVTOVOZ = "Автовоз", // автовоз
    AVTOCISTERNA = "Автоцистерна", // автоцистерна
    BORTOVOI = "Бортовой", // бортовой
    REFRIJERATOR = "Рефрижератор", // рефрижератор
    SAMOSVAL = "Самосвал", // самосвал
    TENT = "Тент", // тент
    TERMOFURGON = "Термофургон", // термофургон
    DRUGOI = "Другой", // другой
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

export enum TruckWheelEnum {
    W4X2 = "4х2", // 4х2
    W4X4 = "4х4", // 4х4
    W6X2 = "6х2", // 6х2
    W6X4 = "6х4", // 6х4
    W6X6 = "6х6", // 6х6
    W8X2 = "8х2", // 8х2
    W8X4 = "8х4", // 8х4
    W8X6 = "8х6", // 8х6
    W8X8 = "8х8", // 8х8
    W10X2 = "10х2", // 10х2
    W10X4 = "10х4", // 10х4
    W10X6 = "10х6", // 10х6
    W10X8 = "10х8", // 10х8
    W10X10 = "10х10", // 10х10
    W12X4 = "12х4", // 12х4
    W12X8 = "12х8", // 12х8
    OTHER = "Другой", // другой
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
