// components/ui/multi-select.tsx
'use client'

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Command, CommandGroup, CommandItem } from '../ui/command'
import { Checkbox } from '../ui/checkbox'
import { cn } from '@/shared/lib/utils'

interface MultiSelectProps<T extends string> {
	options: Record<string, string> // { TENT: "Тент", ... }
	value: T[]
	onChange: (value: T[]) => void
	placeholder?: string
}

export function MultiSelect<T extends string>({
	options,
	value,
	onChange,
	placeholder = "Выбрать",
}: MultiSelectProps<T>) {
	const [open, setOpen] = useState(false)
	const triggerRef = useRef<HTMLButtonElement>(null)
	const [contentWidth, setContentWidth] = useState<number | undefined>(undefined)

	useEffect(() => {
		if (triggerRef.current) {
			setContentWidth(triggerRef.current.offsetWidth)
		}
	}, [triggerRef.current, open])

	const toggleValue = (val: T) => {
		if (value.includes(val)) {
			onChange(value.filter(v => v !== val))
		} else {
			onChange([...value, val])
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-between"
					ref={triggerRef}
				>
					<span
						className={cn(
							"block truncate font-normal",
							value.length === 0 && "text-muted-foreground"
						)}
					>
						{value.length > 0
							? value.map(v => options[v]).join(", ")
							: placeholder}
					</span>

					<ChevronDown className="ml-2 h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				style={{ width: contentWidth }}
				className="w-full p-0 max-h-60 overflow-y-auto"
				align="end"
			>
				<Command>
					<CommandGroup>
						{Object.entries(options).map(([key, label]) => (
							<CommandItem
								key={key}
								onSelect={() => toggleValue(key as T)}
								className="flex justify-between items-center cursor-pointer"
							>
								<span className="block truncate">{label}</span>
								<Checkbox
									checked={value.includes(key as T)}
									onCheckedChange={() => toggleValue(key as T)}
								/>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>

	)
}
