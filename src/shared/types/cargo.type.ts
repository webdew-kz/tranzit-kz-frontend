/** @format */

import { User } from "./user.type";

/** @format */
export enum CurrencyEnum {
    KZT = "KZT",
    USD = "USD",
    EUR = "EUR",
    RUB = "RUB",
    CNY = "CNY",
    UZS = "UZS",
    KGS = "KGS",
}
// case "USD":
//     return "доллар";
// case "EUR":
//     return "евро";
// case "CNY":
//     return "юань";
// case "KZT":
//     return "тенге";
// case "RUB":
//     return "рубль";
// case "UZS":
//     return "сум";
// case "KGS":
//     return "сом";

export enum PaymentMethodEnum {
    ANY = "Любой", // любой
    CASH = "Нал", // нал
    CASHLESS = "Безнал", // безнал
    CARD = "Карта", // карта
    COMBINE = "Комбо", // комбинированный
}

export enum PaymentPeriodEnum {
    WHEN_LOADING = "При загрузке", // при загрузке
    WHEN_UNLOADING = "При разгрузке", // при разгрузке
    AFTER_REGISTER = "После регистрации налоговой накладной", // После регистрации налоговой накладной
    ORIGIN_DOCS = "По оригиналам документов", // По оригиналам документов
}

export enum PaymentOtherEnum {
    AUCTION = "Торг", // Торг
    NO_AUCTION = "Без торга", // без торга
    NDS = "НДС", // НДС
    NO_NDS = "Без НДС", // без НДС
    FOR_FUEL = "За топливо", // за топливо
    FAST_PAY = "Быстрая оплата", // быстрая оплата
}

export enum TruckTypeEnum {
    ANY = "Любая фура", // любой
    TENT = "Тент", // тент
    ISOTHERM = "Изотерм", // изотерм
    REFRIGERATOR = "Рефрижератор", // рефрижератор
    PASSENGER_BUS = "Автобус грузопас.", // автобус грузопас.
    LUXURY_BUS = "Автобус люкс", // автобус люкс
    CAR_CARRIER = "Автовоз", // автовоз
    CRANE = "Автокран", // автокран
    FUEL_TANKER = "Бензовоз", // бензовоз
    CONCRETE_MIXER = "Бетоносмеситель", // бетоносмеситель
    BITUM_TANKER = "Битумовоз", // битумовоз
    PLATFORM_BOARD = "Бортовая", // бортовая
    GRAIN_TRUCK = "Зерновоз", // зерновоз
    GRAIN_TIPPER = "Зерновоз самосвал", // зерновоз_самосвал
    EMPTY_CONTAINER = "Контейнер пустой", // контейнер_пустой
    CONTAINER_TRUCK = "Контейнеровоз", // контейнеровоз
    FEED_TRUCK = "Кормовоз", // кормовоз
    TIMBER_TRUCK = "Лесовоз", // лесовоз
    MANIPULATOR = "Манипулятор", // манипулятор
    OIL_TANKER = "Масловоз", // масловоз
    FURNITURE_TRUCK = "Меблевоз", // меблевоз
    METAL_SCRAP_TRUCK = "Металовоз ломовоз", // металовоз_ломовоз
    MINIBUS = "Микроавтобус", // микроавтобус
    FLOUR_TRUCK = "Муковоз", // муковоз
    OVERSIZED = "Негабарит", // негабарит
    OPEN = "Открытая", // открытая
    PANEL_TRUCK = "Панелевоз", // панелевоз
    PLATFORM = "Платформа", // платформа
    POULTRY_TRUCK = "Птицевоз", // птицевоз
    ROLL_TRUCK = "Рулоновоз", // рулоновоз
    TIPPER = "Самосвал", // самосвал
    CATTLE_TRUCK = "Скотовоз", // скотовоз
    SPECIAL_MACHINE = "Спецмашина", // спецмашина
    GLASS_TRUCK = "Стекловоз", // стекловоз
    TRAILER = "Трал", // трал
    TRACTOR = "Тягач", // тягач
    PIPE_TRUCK = "Трубовоз", // трубовоз
    PLASTIC_BODY = "Цельнопластик", // цельнопластик
    CEMENT_TRUCK = "Цементовоз", // цементовоз
    GAS_TANKER = "Цистерна газовая", // цистерна_газовая
    ISOTHERM_TANKER = "Цистерна изотерм", // цистерна_изотерм
    FOOD_TANKER = "Цистерна пищ", // цистерна_пищ
    CHEMICAL_TANKER = "Цистерна хим", // цистерна_хим
    WOOD_CHIP_TRUCK = "Щеповоз", // щеповоз
    TOW_TRUCK = "Эвакуатор", // эвакуатор
    EXCAVATOR = "Экскаватор", // экскаватор
    SQUARE = "Площадка", // площадка
    GAZELLE = "Газель", // газель
    FIVE_TON_TRUCK = "5-тонник", // 5-тонник
}

export enum LoadingTypeEnum {
    ANY = "Любая погр", // любая
    REAR = "Задняя", // задняя
    SIDE = "Боковая", // боковая
    TOP = "Верхняя", // верхняя
    FULL = "Растентовка", // растентовка
}

export enum DocumentsEnum {
    CMR = "CMR", // CMR
    TIR = "TIR", // TIR
    T1 = "T1", // T1
    T2 = "T2", // T2
    EKMT = "EKMT", // EKMT
    SAN_PASSPORT = "Санпаспорт", // Сан паспорт
    SAN_BOOK = "Санкнижка", // Сан книжка
    CUSTOMS_CERT = "Тамож. свид-во", // Таможня
    CUSTOMS_CONTROL = "Тамож. контроль", // Таможенный контроль
    DOZVOL = "Дозвол", // Дозвол
    OVERSIZE_SPECIAL_PERMIT = "Спец. разрешение на негабарит", // спец. разрешение на негабарит
    CATEGORY_C = "Категория C", // категория C
    CATEGORY_D = "Категория D", // категория D
    EORI_CODE = "ЕОРИ код", // ЕОРИ код
    REGISTRATION_CARD = "Учётный талон", // учётный талон
    E_QUEUE = "Электронная очередь", // электронная очередь
    VISA = "Виза", // виза
    POWER_OF_ATTORNEY = "Доверенность", // доверенность
    CARRIER_STAMP = "Печать перевозчика", // печать перевозчика
}

export enum DocumentsAdrEnum {
    ADR1 = "ADR1", // ADR1
    ADR2 = "ADR2", // ADR2
    ADR3 = "ADR3", // ADR3
    ADR4 = "ADR4", // ADR4
    ADR5 = "ADR5", // ADR5
    ADR6 = "ADR6", // ADR6
    ADR7 = "ADR7", // ADR7
    ADR8 = "ADR8", // ADR8
    ADR9 = "ADR9", // ADR9
}

export enum LoadingsEnum {
    ALWAYS = "Постоянно", // постоянно
    WEEKLY = "Еженедельно", // еженедельно
    DAILY = "Ежедневно", // ежедневно
    AROUND_THE_CLOCK = "Круглосуточно", // круглосуточно
    SEAL = "Пломба", // пломба
    SEMI_TRAILER = "Полуприцеп", // полуприцеп
    COUPLING = "Сцепка", // сцепка
    PNEUMATIC_SUSP = "Пневмоход", // пневмоход
    HYDRAULIC_LIFT = "Гидроборт", // гидроборт
    CURTAIN = "Штора", // штора
    PYRAMID = "Пирамида", // пирамида
    FRAME = "Обрешетка", // обрешетка
    MANIPULATOR = "Манипулятор", // манипулятор
    HYDRAULIC_JACK = "Рокла", // рокла
    RAMP = "Рампа", // рампа
}

export enum TermsEnum {
    HOOKS = "Крюки", // крюки
    REMOVABLE_RACKS = "Съемные стойки", // съемные стойки
    HARD_BOARD = "Жесткие борта", // жесткие борта
    WOODEN_FLOOR = "Деревянный пол", // деревянный пол
    HORNS = "Рога", // рога
    MEGA = "МЕГА", // МЕГА
    JUMBO = "ДЖАМБО", // ДЖАМБО
    HATCHES = "Люки", // люки
    FAST_UNLOAD = "Быстрая разгрузка", // быстрая разгрузка
}

export enum TermsPalletsTypeEnum {
    EUR = "EUR 1,2 x 0,8 м", // EUR 1,2 x 0,8 м
    FIN = "FIN 1,2 x 1,0 м", // FIN 1,2 x 1,0 м
    ISO_111 = "ISO 1,1 x 1,1 м", // ISO 1,1 x 1,1 м
    ISO_100 = "ISO 1,0 x 1,0 м", // ISO 1,0 x 1,0 м
    USA = "USA 1,2 x 1,2 м", // USA 1,2 x 1,2 м
    TUR = "TUR 1,15 x 1,15 м", // TUR 1,15 x 1,15 м
    CHI = "CHI 1,14 x 1,14 м", // CHI 1,14 x 1,14 м
}

export enum AdditionallyEnum {
    READY_TO_LOAD = "Груз готов", // груз готов
    ROUND_TRIP = "Кругорейс", // кругорейс
    WITH_FORWARDER = "Экспедитор", // экспедитор
    URGENT = "Срочно", // срочно
    PERISHABLE = "Скоропорт", // скоропорт
    PLATES_NOW = "Номера сейчас", // номера сейчас
    ONLY_CARRIER = "Только перевозчик", // только перевозчик
    TO_WAREHOUSE = "На склад", // на склад
    GPS = "Транспорт с GPS", // транспорт с GPS
    FERRY = "Паром", // паром
    THERMAL_RECORDER = "Терморегистратор", // терморегистратор
}

export interface Views {
    count: number; // количество просмотров
}

export interface ICargo {
    id?: string; // id
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления

    title: string; // название
    price: number; // цена
    currency: CurrencyEnum; // например: "KZT", "USD" и т.д.
    note?: string; // необязательное примечание
    placesLoading: string[]; // места погрузки
    placesUnloading: string[]; // места разгрузки
    distance?: number; // расстояние в км
    tariff?: number; // тариф в тенге за км
    routeLink?: string; // ссылка на маршрут
    weight: number; // Тоннаж
    volume: number; // Объем в м³
    periodDays: number; // например, 1, 2, 3… до 30
    startDate: string; // дата начала
    endDate?: string; // дата окончания

    views: Views; // просмотры

    isArchived?: boolean; // статус архивирования
    archivedDate?: string; // дата архивирования

    truckType: TruckTypeEnum[]; // тип фуры

    loadingType: LoadingTypeEnum[]; // тип загрузки

    paymentMethod: PaymentMethodEnum[]; // способ оплаты
    paymentPeriod?: PaymentPeriodEnum[]; // период оплаты
    paymentOther?: PaymentOtherEnum[]; // другие детали оплаты
    paymentPrepaymentPercent?: string; // предоплата %
    paymentDeferredDays?: string; // отсрочка дней

    optionDocuments?: DocumentsEnum[]; // документы
    optionDocumentsAdr?: DocumentsAdrEnum; // документы ADR

    optionLoadings?: LoadingsEnum[]; // погрузка
    optionLoadingsTimeLoading?: string; // время погрузки
    optionLoadingsTimeUnloading?: string; // время разгрузки
    optionLoadingsDateUnloading?: string; // дата разгрузки
    optionLoadingsPlaceLoading?: string; // место погрузки
    optionLoadingsPlaceUnloading?: string; // место разгрузки
    optionLoadingsBigBag?: string; // биг-бэг

    optionTerms?: TermsEnum[]; // условия
    optionTermsTemperature?: string; // температура
    optionTermsQtyPallets?: string; // количество паллет
    optionTermsCorners?: string; // Уголки
    optionTermsBelts?: string; // ремни
    optionTermsPalletsType?: TermsPalletsTypeEnum; // тип паллет

    optionAdditionally?: AdditionallyEnum[]; // дополнительно

    userName: string;
    userPhone: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    skype?: string;
    user: User;
}

// id        String   @id @default(uuid())
// createdAt DateTime @default(now())
// updatedAt DateTime @updatedAt

// title           String // название
// price           Int // цена
// currency        Currency // например: "KZT", "USD" и т.д.
// note            String? // необязательное примечание
// placesLoading   String[] // места погрузки
// placesUnloading String[] // места разгрузки
// distance        Int? // расстояние в км
// tariff          Int? // тариф в тенге за км
// routeLink       String? // ссылка на маршрут
// weight          Float // Тоннаж
// volume          Float // Объем в м³
// periodDays      Int       @default(5) // например, 1, 2, 3… до 30
// startDate       DateTime // дата начала
// endDate         DateTime? // дата окончания

// isArchived   Boolean?  @default(false) // статус архивирования
// archivedDate DateTime? // дата архивирования

// truckType TruckType[] // тип фуры

// loadingType LoadingType[] // тип загрузки

// paymentMethod            PaymentMethod // способ оплаты
// paymentPeriod            PaymentPeriod[] @default([]) // период оплаты
// paymentOther             PaymentOther[]  @default([]) // другие детали оплаты
// paymentPrepaymentPercent Int? // предоплата %
// paymentDeferredDays      Int? // отсрочка дней

// optionDocuments    Documents[]   @default([]) // документы
// optionDocumentsAdr DocumentsAdr? // документы ADR

// optionLoadings               Loadings[] @default([]) // погрузка
// optionLoadingsTimeLoading    DateTime? // время погрузки
// optionLoadingsTimeUnloading  DateTime? // время разгрузки
// optionLoadingsDateUnloading  DateTime? // дата разгрузки
// optionLoadingsPlaceLoading   String? // место погрузки
// optionLoadingsPlaceUnloading String? // место разгрузки
// optionLoadingsBigBag         String? // биг-бэг

// optionTerms            Terms[]           @default([]) // условия
// optionTermsTemperature String? // температура
// optionTermsQtyPallets  Int? // количество паллет
// optionTermsCorners     String? // Уголки
// optionTermsBelts       String? // ремни
// optionTermsPalletsType TermsPalletsType? // тип паллет

// optionAdditionally Additionally[] @default([]) // дополнительно

// user   User?   @relation("UserCargo", fields: [userId], references: [id], onDelete: Cascade)
// userId String?
