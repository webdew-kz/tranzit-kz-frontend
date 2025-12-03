/** @format */

import { Views } from "./cargo.type";
import { User } from "./user.type";

export enum BrokerServiceEnum {
    ADR = "АДР",
    ARENDA_GRUZOVOY_TEHNIKI = "Аренда грузовой техники",
    BRONIROVANIE_BILETA_NA_PORT_MEJDUNARODNOE = "Бронирование билета на порт (международное)",
    BUHGALTERIYA_S_NULYA_OBUCHENIE_ONLAYN_KURS = "Бухгалтерия с нуля (обучение онлайн курс)",
    BUHGALTERSKIE_USLUGI = "Бухгалтерские услуги",
    VESOVOY_KONTROL_I_RENTGEN = "Весовой контроль и рентген",
    DOZVOL = "Дозвол",
    DOROGHNIE_NALOGI_V_EUROPE_I_SNG = "Дорожные налоги в Европе и СНГ",
    EORI_KOD = "ЕОРИ код",
    ZAPOLNENIE_SMR = "Заполнение СМР",
    ZAPOLNENIE_TIR_KORNETA = "Заполнение ТИР корнета",
    ZATAMOJKA_V_KITAE = "Затаможка в Китае",
    ZELENAYA_KARTA_CHIP = "Зелёная карта / ЧИП",
    IBR = "ИБР",
    KAT_DLYA_ZAEZDA_V_KITAY = "Кат для заезда в Китай",
    KARTA_VODITELYA_DLYA_TAHOGRAFA = "Карта водителя для тахографа",
    OBUCHENIE_LOGISTIKA_PO_KAZAHSTANU = "Обучение: Логистика по Казахстану",
    OBUCHENIE_BROKERSKIE_USLUGI = "Обучение брокерские услуги",
    OBUCHENIE_LOGISTIKA_I_GRUZOPEREVOZKI_SNG_EUROPA = "Обучение логистика и грузоперевозки СНГ/Европа",
    OBUCHENIE_TAMOJENNYY_I_TRANSPORTNYY_BROKER = "Обучение таможенный и транспортный брокер",
    OCENKA_RASCHET_RINOCHNOY_STOIMOSTI_POD_KLYUCH = "Оценка / расчёт рыночной стоимости под ключ",
    OCHERED_NA_VYEZD_IZ_KITAYA = "Очередь на выезд из Китая",
    PARKOVKA_V_TAMOZHENNYH_TERMINALAH_EUROPY = "Парковка в таможенных терминалах Европы",
    PEREVOD_DENEG_RK_V_RF_V_RUBLYAH = "Перевод денег РК → РФ (в рублях)",
    PEREVODCHIK_V_KITAE = "Переводчик в Китае",
    POLNYY_PAKET_DOKUMENTOV = "Полный пакет документов",
    POSTANOVKA_NA_BALANS_AVTO = "Постановка на баланс авто",
    PRIGLASHENIE_V_KITAY = "Приглашение в Китай",
    PROHOD_V_UZBEKISTAN = "Проход в Узбекистан",
    RASTAMOJKA_MEJDUNARODNAYA = "Растаможка международная",
    RASTAMOJKA_KAZAHSTAN = "Растаможка Казахстан",
    RASTAMOJKA_ROSSIYA = "Растаможка Россия",
    REZERVACIYA_OCHEREDI_NA_GRANICE_LITVA_LATVIYA = "Резервация очереди на границе (Литва/Латвия)",
    REMONT_GRUZOVOGO_TRANSPORTA = "Ремонт грузового транспорта",
    SVH = "СВХ",
    SERTIFIKAT_SVIDETELSTVO_TAHOGRAFA = "Сертификат / свидетельство тахографа",
    SKLAD_HRANENIYA_V_KITAE = "Склад хранения в Китае",
    SNYATIE_S_BALANSA = "Снятие с баланса",
    SOPROVOJDENIE_NEGABARIT_MEJDUNARODNOE = "Сопровождение негабарита (международное)",
    SPECIALNOE_RAZRESHENIE_MEJDUNARODNOE = "Специальное разрешение (международное)",
    SPECIALNOE_RAZRESHENIE_RK = "Специальное разрешение (РК)",
    STRAHOVANIE_AVTOTRANSPORTA = "Страхование автотранспорта",
    STRAHOVANIE_GRUZA = "Страхование груза",
    T1_T2_TAMOJENNAYA_DEKLARACIYA = "T1/T2 таможенная декларация",
    TAMOJENNOE_SVIDETELSTVO_DOPUSK_PRICEP = "Таможенное свидетельство допуска прицепа",
    TAMOJENNY_KONTROL = "Таможенный контроль",
    TAHOGRAF_USTANOVKA_KALIBROVKA = "Тахограф (установка и калибровка)",
    TEPLYE_BOKSY = "Тёплые боксы",
    TRANZITNAYA_DEKLARACIYA_MEJDUNARODNAYA = "Транзитная декларация (международная)",
    TRANZITNAYA_DEKLARACIYA_GRANICA_KITAY = "Транзитная декларация (граница Китай)",
    USLUGI_IMPORT_EXPORT = "Услуги импорт/экспорт",
    USLUGI_POGRUZKI_V_KITAE = "Услуги погрузки в Китае",
    EPI_GARANT = "ЭПИ гарантия",
    EKOLOGICHESKAYA_SPRAVKA = "Экологическая справка",
    EKOLOGICHESKAYA_SPRAVKA_I_SERTIFIKAT = "Экологическая справка и сертификат",
    EKSPORTNAYA_DEKLARACIYA = "Экспортная декларация",
    EKSPORTNAYA_DEKLARACIYA_GRANICA_KITAY = "Экспортная декларация (граница Китай)",
    ELEKTRONNAYA_OCHERED = "Электронная очередь",
}

export interface IBroker {
    id?: string; // id
    createdAt?: string; // дата создания
    updatedAt?: string; // дата обновления

    city?: string[]; // город
    note?: string; // Коммент
    descr?: string; // Коммент
    brokerService: BrokerServiceEnum; //

    views: Views; // просмотры

    isArchived?: boolean; // статус архивирования
    archivedDate?: string; // дата архивирования

    userName: string;
    userPhone: string;
    whatsapp?: string;
    telegram?: string;
    viber?: string;
    skype?: string;
    user: User;
}
