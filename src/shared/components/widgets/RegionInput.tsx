'use client';

import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

interface Props {
	values: string[];
	onChange: (values: string[]) => void;
	addBtnText?: string;
	placeholder?: string;
	addBtn?: boolean
}

const RegionInput = ({
	index,
	value,
	onChangeAt,
	onRemove,
	canRemove,
	placeholder = 'Пункт погрузки',
}: {
	index: number;
	value: string;
	onChangeAt: (index: number, value: string) => void;
	onRemove: (index: number) => void;
	canRemove: boolean;
	placeholder?: string;
}) => {
	const {
		ready,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: { types: ["(regions)"] },
		debounce: 300,
	});

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setValue(val);

		onChangeAt(index, val);


	};

	const handleSelect = (description: string) => {
		// const city = description.split(",")[0].trim(); // берём только первую часть до запятой
		const city = description; // берём только первую часть до запятой
		setValue(city, false);
		clearSuggestions();
		onChangeAt(index, city);
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
						{data.map(({ place_id, description }) => (
							<li
								key={place_id}
								onClick={() => handleSelect(description)}
								className="py-2 px-3 cursor-pointer hover:bg-accent hover:text-foreground text-sm"
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

export const MultiRegionInput = ({ values, onChange, addBtnText, placeholder, addBtn = true }: Props) => {
	const addInput = () => {
		onChange([...values, '']);
	};

	const updateAt = (index: number, value: string) => {
		const updated = [...values];
		updated[index] = value;
		onChange(updated);
	};

	const removeAt = (index: number) => {
		if (values.length === 1) return; // минимум один город
		const updated = values.filter((_, i) => i !== index);
		onChange(updated);
	};

	return (
		<div className='flex flex-col gap-2'>
			{values.map((val, i) => (
				<RegionInput
					key={i}
					index={i}
					value={val}
					onChangeAt={updateAt}
					onRemove={removeAt}
					canRemove={values.length > 1 && i > 0}
					placeholder={placeholder}
				/>
			))}
			{addBtn && (
				<Button
					variant="link"
					type="button"
					onClick={addInput}
					className='underline decoration-dotted py-0 px-1 text-sm text-(--dark-accent) hover:text-(--light-accent) h-auto'
				>{addBtnText}</Button>
			)}
		</div>
	);
};
