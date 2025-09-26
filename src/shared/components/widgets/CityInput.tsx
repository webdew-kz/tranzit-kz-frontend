'use client';

import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

interface CityInputProps {
	value?: string;
	onChange: (value: string) => void;
	onRemove?: () => void;
	canRemove?: boolean;
	placeholder?: string;
}

export const CityInput = ({
	value,
	onChange,
	onRemove,
	canRemove = false,
	placeholder,
}: CityInputProps) => {
	const {
		ready,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		requestOptions: { types: ["(cities)"] },
		// requestOptions: { types: ["(regions)"] },
		debounce: 300,
	});

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setValue(val);
		onChange(val);
	};

	const handleSelect = (description: string) => {
		const city = description;
		setValue(city, false);
		clearSuggestions();
		onChange(city);
	};

	return (
		<div className="relative flex gap-2 items-start">
			<div className="w-full relative">
				<Input
					value={value ?? ''}
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
			{canRemove && onRemove && (
				<Button
					variant="outline"
					size="icon"
					type="button"
					onClick={onRemove}
				>
					<Trash size={16} />
				</Button>
			)}
		</div>
	);
};