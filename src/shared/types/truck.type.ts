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
    DAYUN_TRUCK = "Dayun Truck",
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
