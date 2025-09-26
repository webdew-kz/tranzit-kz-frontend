// 'use client';

// import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { Trash } from 'lucide-react';

// interface Props {
// 	values: string[];
// 	onChange: (values: string[]) => void;
// 	addBtnText?: string;
// 	placeholder?: string;

// }

// const CityInput = ({
// 	index,
// 	value,
// 	onChangeAt,
// 	onRemove,
// 	canRemove,
// 	placeholder = 'Пункт погрузки',

// }: {
// 	index: number;
// 	value: string;
// 	onChangeAt: (index: number, value: string) => void;
// 	onRemove: (index: number) => void;
// 	canRemove: boolean;
// 	placeholder?: string;
// }) => {
// 	const {
// 		ready,
// 		suggestions: { status, data },
// 		setValue,
// 		clearSuggestions,
// 	} = usePlacesAutocomplete({
// 		requestOptions: { types: ["(cities)"] },
// 		debounce: 300,
// 	});

// 	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const val = e.target.value;
// 		setValue(val);

// 		onChangeAt(index, val);


// 	};

// 	const handleSelect = (description: string) => {
// 		// const city = description.split(",")[0].trim(); // берём только первую часть до запятой
// 		const city = description; // берём только первую часть до запятой
// 		setValue(city, false);
// 		clearSuggestions();
// 		onChangeAt(index, city);
// 	};

// 	return (
// 		<div className="relative flex gap-2 items-start">
// 			<div className="w-full relative">
// 				<Input
// 					value={value}
// 					onChange={handleInput}
// 					disabled={!ready}
// 					placeholder={placeholder}
// 					className="input w-full leading-[36px] text-sm"
// 				/>
// 				{status === 'OK' && (
// 					<ul className="absolute bg-background border mt-2 w-full z-10 text-foreground rounded-lg overflow-hidden">
// 						{data
// 							.filter((item) =>
// 								item.types?.includes('locality') ||
// 								item.types?.includes('administrative_area_level_3') // иногда города помечаются так
// 							)
// 							.map(({ place_id, description }) => (
// 								<li
// 									key={place_id}
// 									onClick={() => handleSelect(description)}
// 									className="py-2 px-3 cursor-pointer hover:bg-accent hover:text-foreground text-sm"
// 								>
// 									{description}
// 								</li>
// 							))}
// 					</ul>
// 				)}
// 			</div>
// 			{canRemove && (
// 				<Button
// 					variant="outline"
// 					size="icon"
// 					type="button"
// 					onClick={() => onRemove(index)}
// 				>
// 					<Trash size={16} />
// 				</Button>
// 			)}
// 		</div>
// 	);
// };

// export const MultiCityInput = ({ values, onChange, addBtnText, placeholder }: Props) => {
// 	const addInput = () => {
// 		onChange([...values, '']);
// 	};

// 	const updateAt = (index: number, value: string) => {
// 		const updated = [...values];
// 		updated[index] = value;
// 		onChange(updated);
// 	};

// 	const removeAt = (index: number) => {
// 		if (values.length === 1) return; // минимум один город
// 		const updated = values.filter((_, i) => i !== index);
// 		onChange(updated);
// 	};

// 	return (
// 		<div className='flex flex-col gap-2'>
// 			{values.map((val, i) => (
// 				<CityInput
// 					key={i}
// 					index={i}
// 					value={val}
// 					onChangeAt={updateAt}
// 					onRemove={removeAt}
// 					canRemove={values.length > 1 && i > 0}
// 					placeholder={placeholder}
// 				/>
// 			))}
// 			<Button
// 				variant="link"
// 				type="button"
// 				onClick={addInput}
// 				className='underline decoration-dotted py-0 px-1 text-sm text-(--dark-accent) hover:text-(--light-accent) h-auto'
// 			>{addBtnText}</Button>
// 		</div>
// 	);
// };


'use client';

import React from 'react';
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

interface CityInputProps {
	index: number;
	value: string;
	onChangeAt: (index: number, value: string) => void;
	onRemove: (index: number) => void;
	canRemove: boolean;
	placeholder?: string;
	onSelectMeta: (
		index: number,
		meta: { region: string; country: string }
	) => void;
}

const CityInput = ({
	index,
	value,
	onChangeAt,
	onRemove,
	canRemove,
	placeholder = 'Пункт погрузки',
	onSelectMeta,
}: CityInputProps) => {
	const {
		ready,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: { types: ['(cities)'] },
		debounce: 300,
	});

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setValue(val);
		onChangeAt(index, val);
	};

	// const handleSelect = async (description: string, placeId: string) => {
	// 	setValue(description, false);
	// 	clearSuggestions();
	// 	onChangeAt(index, description);

	// 	const results = await getGeocode({ placeId });
	// 	const components =
	// 		(results[0]?.address_components ??
	// 			[]) as google.maps.GeocoderAddressComponent[];

	// 	// ✅ Собираем все уровни 1–3 в массив
	// 	const regions = components
	// 		.filter(c =>
	// 			c.types.some(t =>
	// 				['administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3'].includes(t)
	// 			)
	// 		)
	// 		.map(c => c.long_name);

	// 	const country =
	// 		components.find(c => c.types.includes('country'))?.long_name || '';

	// 	// передаём массив регионов
	// 	onSelectMeta(index, { region: regions.join(', '), country });
	// };

	const federalCityToRegion: Record<string, string> = {
		// Города федерального значения
		"Москва": "Московская область",
		"Санкт-Петербург": "Ленинградская область",
		"Севастополь": "Крым",

		// Республика Адыгея
		"Майкоп": "Республика Адыгея",

		// Республика Алтай
		"Горно-Алтайск": "Республика Алтай",

		// Республика Башкортостан
		"Уфа": "Республика Башкортостан",

		// Республика Бурятия
		"Улан-Удэ": "Республика Бурятия",

		// Республика Дагестан
		"Махачкала": "Республика Дагестан",

		// Республика Ингушетия
		"Магас": "Республика Ингушетия",

		// Республика Кабардино-Балкария
		"Нальчик": "Республика Кабардино-Балкария",

		// Республика Калмыкия
		"Элиста": "Республика Калмыкия",

		// Республика Карелия
		"Петрозаводск": "Республика Карелия",

		// Республика Коми
		"Сыктывкар": "Республика Коми",

		// Республика Крым
		"Симферополь": "Республика Крым",

		// Республика Марий Эл
		"Йошкар-Ола": "Республика Марий Эл",

		// Республика Мордовия
		"Саранск": "Республика Мордовия",

		// Республика Саха (Якутия)
		"Якутск": "Республика Саха (Якутия)",

		// Республика Северная Осетия — Алания
		"Владикавказ": "Республика Северная Осетия — Алания",

		// Республика Татарстан
		"Казань": "Республика Татарстан",

		// Республика Тыва
		"Кызыл": "Республика Тыва",

		// Республика Удмуртия
		"Ижевск": "Республика Удмуртия",

		// Республика Хакасия
		"Абакан": "Республика Хакасия",

		// Ростовская область
		"Ростов-на-Дону": "Ростовская область",

		// Владимирская область
		"Владимир": "Владимирская область",

		// Волгоградская область
		"Волгоград": "Волгоградская область",

		// Вологодская область
		"Вологда": "Вологодская область",

		// Воронежская область
		"Воронеж": "Воронежская область",

		// Ивановская область
		"Иваново": "Ивановская область",

		// Иркутская область
		"Иркутск": "Иркутская область",

		// Калининградская область
		"Калининград": "Калининградская область",

		// Калужская область
		"Калуга": "Калужская область",

		// Камчатский край
		"Петропавловск-Камчатский": "Камчатский край",

		// Кемеровская область
		"Кемерово": "Кемеровская область",

		// Кировская область
		"Киров": "Кировская область",

		// Костромская область
		"Кострома": "Костромская область",

		// Курганская область
		"Курган": "Курганская область",

		// Курская область
		"Курск": "Курская область",

		// Ленинградская область
		"Гатчина": "Ленинградская область",

		// Липецкая область
		"Липецк": "Липецкая область",

		// Магаданская область
		"Магадан": "Магаданская область",

		// Московская область
		"Красногорск": "Московская область",

		// Мурманская область
		"Мурманск": "Мурманская область",

		// Нижегородская область
		"Нижний Новгород": "Нижегородская область",

		// Новгородская область
		"Великий Новгород": "Новгородская область",

		// Новосибирская область
		"Новосибирск": "Новосибирская область",

		// Омская область
		"Омск": "Омская область",

		// Оренбургская область
		"Оренбург": "Оренбургская область",

		// Орловская область
		"Орёл": "Орловская область",

		// Пензенская область
		"Пенза": "Пензенская область",

		// Псковская область
		"Псков": "Псковская область",

		// Рязанская область
		"Рязань": "Рязанская область",

		// Самарская область
		"Самара": "Самарская область",

		// Саратовская область
		"Саратов": "Саратовская область",

		// Сахалинская область
		"Южно-Сахалинск": "Сахалинская область",

		// Свердловская область
		"Екатеринбург": "Свердловская область",

		// Смоленская область
		"Смоленск": "Смоленская область",

		// Тамбовская область
		"Тамбов": "Тамбовская область",

		// Тверская область
		"Тверь": "Тверская область",

		// Томская область
		"Томск": "Томская область",

		// Тульская область
		"Тула": "Тульская область",

		// Тюменская область
		"Тюмень": "Тюменская область",

		// Ульяновская область
		"Ульяновск": "Ульяновская область",

		// Челябинская область
		"Челябинск": "Челябинская область",

		// Чукотский автономный округ
		"Анадырь": "Чукотский автономный округ",

		// Чувашская Республика
		"Чебоксары": "Чувашская Республика",

		// Ярославская область
		"Ярославль": "Ярославская область",

		// Забайкальский край
		"Чита": "Забайкальский край",

		// Амурская область
		"Благовещенск": "Амурская область",

		// Архангельская область
		"Архангельск": "Архангельская область",

		// Астраханская область
		"Астрахань": "Астраханская область",

		// Белгородская область
		"Белгород": "Белгородская область",

		// Брянская область
		"Брянск": "Брянская область",

		// Краснодарский край
		"Краснодар": "Краснодарский край",

		// Красноярский край
		"Красноярск": "Красноярский край",

		"Алматы": "Алматинская область",
		"Астана": "Акмолинская область",
		"Шымкент": "Туркестанская область",

		// Областные центры
		"Актау": "Мангистауская область",
		"Актобе": "Актюбинская область",
		"Атырау": "Атырауская область",
		"Уральск": "Западно-Казахстанская область",
		"Кокшетау": "Акмолинская область",
		"Костанай": "Костанайская область",
		"Павлодар": "Павлодарская область",
		"Петропавловск": "Северо-Казахстанская область",
		"Жезказган": "Улытауская область",
		"Караганда": "Карагандинская область",
		"Конаев": "Алматинская область",
		"Кызылорда": "Кызылординская область",
		"Талдыкорган": "Жетысуская область",
		"Тараз": "Жамбылская область",
		"Семей": "Абайская область",
		"Туркестан": "Туркестанская область",
		"Усть-Каменогорск": "Восточно-Казахстанская область",
	}




	const handleSelect = async (description: string, placeId: string) => {
		setValue(description, false);
		clearSuggestions();
		onChangeAt(index, description);

		const results = await getGeocode({ placeId });
		const components =
			(results[0]?.address_components ?? []) as google.maps.GeocoderAddressComponent[];

		// Ищем страну
		const country = components.find(c => c.types.includes("country"))?.long_name || "";

		// Ищем город (locality или fallback на административную единицу)
		let city =
			components.find(c => c.types.includes("locality"))?.long_name ||
			components.find(c => c.types.includes("administrative_area_level_1"))?.long_name ||
			"";

		// Ищем регион (administrative_area_level_1 или административная единица)
		let region =
			components.find(c => c.types.includes("administrative_area_level_1"))?.long_name || "";

		// Если город федеральный, подставляем "виртуальную" область
		if (city in federalCityToRegion) {
			region = federalCityToRegion[city];
		}

		// Можно объединить города/районы 1–3 уровня, если нужно
		const otherRegions = components
			.filter(c =>
				c.types.some(t =>
					["administrative_area_level_2", "administrative_area_level_3"].includes(t)
				)
			)
			.map(c => c.long_name);

		// Передаем массив регионов и стран
		onSelectMeta(index, { region: [region, ...otherRegions].filter(Boolean).join(", "), country });
	};


	return (
		<div className="relative flex gap-2 items-start">
			<div className="w-full relative">
				<Input
					value={value}
					onChange={handleInput}
					disabled={!ready}
					placeholder={placeholder}
					className="input w-full leading-[36px] text-sm"
				/>
				{status === 'OK' && (
					<ul className="absolute bg-background border mt-2 w-full z-10 text-foreground rounded-lg overflow-hidden">
						{data
							.filter((item) => item.types?.includes('locality'))
							.map(({ place_id, description }) => (
								<li
									key={place_id}
									onClick={() => handleSelect(description, place_id)}
									className="py-2 px-3 cursor-pointer hover:bg-accent text-sm"
								>
									{description}
								</li>
							))}
					</ul>
				)}
			</div>
			{canRemove && (
				<Button
					variant="outline"
					size="icon"
					type="button"
					onClick={() => onRemove(index)}
				>
					<Trash size={16} />
				</Button>
			)}
		</div>
	);
};

interface MultiCityProps {
	values: string[];
	regions?: string[];
	countries?: string[];
	onChange: (v: string[]) => void;
	onChangeRegion?: (v: string[]) => void;
	onChangeCountry?: (v: string[]) => void;
	addBtn?: boolean
	addBtnText: string;
	placeholder: string;
}

export const MultiCityInput = ({
	values,
	regions = [],          // значение по умолчанию
	countries = [],         // значение по умолчанию
	onChange,
	onChangeRegion,
	onChangeCountry,
	addBtnText,
	placeholder,
}: MultiCityProps) => {
	const addInput = () => {
		onChange([...values, '']);
		onChangeRegion?.([...regions, '']);       // безопасный вызов
		onChangeCountry?.([...countries, '']);    // безопасный вызов
	};

	const updateAt = (index: number, value: string) => {
		const updated = [...values];
		updated[index] = value;
		onChange(updated);
	};

	const removeAt = (index: number) => {
		if (values.length === 1) return;

		onChange(values.filter((_, i) => i !== index));
		onChangeRegion?.(regions.filter((_, i) => i !== index));
		onChangeCountry?.(countries.filter((_, i) => i !== index));
	};

	const handleSelectMeta = (
		index: number,
		meta: { region: string; country: string }
	) => {
		const newRegions = [...regions];
		if (index < newRegions.length) newRegions[index] = meta.region;
		onChangeRegion?.(newRegions);

		const newCountries = [...countries];
		if (index < newCountries.length) newCountries[index] = meta.country;
		onChangeCountry?.(newCountries);
	};

	return (
		<div className="flex flex-col gap-2">
			{values.map((val, i) => (
				<CityInput
					key={i}
					index={i}
					value={val}
					onChangeAt={updateAt}
					onRemove={removeAt}
					canRemove={values.length > 1 && i > 0}
					placeholder={placeholder}
					onSelectMeta={handleSelectMeta}
				/>
			))}
			<Button
				variant="link"
				type="button"
				onClick={addInput}
				className='underline decoration-dotted py-0 px-1 text-sm text-(--dark-accent) hover:text-(--light-accent) h-auto'
			>
				{addBtnText}
			</Button>
		</div>
	);
};
