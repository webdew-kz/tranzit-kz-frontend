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

	const handleSelect = async (description: string, placeId: string) => {
		setValue(description, false);
		clearSuggestions();
		onChangeAt(index, description);

		const results = await getGeocode({ placeId });
		const components =
			(results[0]?.address_components ??
				[]) as google.maps.GeocoderAddressComponent[];

		// ✅ Собираем все уровни 1–3 в массив
		const regions = components
			.filter(c =>
				c.types.some(t =>
					['administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3'].includes(t)
				)
			)
			.map(c => c.long_name);

		const country =
			components.find(c => c.types.includes('country'))?.long_name || '';

		// передаём массив регионов
		onSelectMeta(index, { region: regions.join(', '), country });
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
