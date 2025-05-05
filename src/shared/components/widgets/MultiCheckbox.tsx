
// import { ChevronDown } from "lucide-react"
// import { useState } from "react"
// import { CommandGroup, CommandItem, Command } from '../ui/command'
// import { Checkbox } from '../ui/checkbox'
// import { cn } from '@/shared/lib/utils'
// import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select'

// interface EnumOptionProps<T extends string> {
// 	title: string
// 	options: Record<string, string> // {KEY: "Label"}
// 	selected: T[]
// 	onChange: (value: T[]) => void
// 	className?: string
// }

// export default function MultiCheckbox<T extends string>({
// 	title,
// 	options,
// 	selected,
// 	onChange,
// 	className
// }: EnumOptionProps<T>) {
// 	const toggle = (v: T) => {
// 		onChange(
// 			selected.includes(v)
// 				? selected.filter((i) => i !== v)
// 				: [...selected, v]
// 		)
// 	}

// 	return (
// 		<Command className={cn(className)}>
// 			<span className=" text-[18px] font-medium text-muted-foreground mb-2">{title}</span>
// 			<CommandGroup className=' p-0'>
// 				{Object.entries(options).map(([key, label]) => (
// 					<CommandItem
// 						key={key}
// 						onSelect={() => toggle(key as T)}
// 						className="flex justify-between items-center cursor-pointer p-0 mb-1 last:mb-0 text-sm hover:!bg-transparent data-[selected]:!bg-transparent focus:!bg-transparent"
// 					>
// 						<span className='block truncate'>{label}</span>
// 						<Checkbox
// 							checked={selected.includes(key as T)}
// 							onCheckedChange={() => toggle(key as T)}
// 						/>
// 					</CommandItem>
// 				))}
// 			</CommandGroup>
// 		</Command>
// 	)
// }
import { ChevronDown } from "lucide-react"
import { CommandGroup, CommandItem, Command } from "../ui/command"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"
import { cn } from "@/shared/lib/utils"
import { Label } from '../ui/label'

interface EnumOptionProps<T extends string> {
	options: Record<string, string>
	selected: T[]
	onChange: (value: T[]) => void
	className?: string
}

export default function MultiCheckbox<T extends string>({
	options,
	selected,
	onChange,
	className,
}: EnumOptionProps<T>) {
	const toggle = (val: T) => {
		onChange(
			selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
		)
	}

	return (
		<>
			{Object.entries(options).map(([key, label]) => (
				<div
					key={key}
					onSelect={() => toggle(key as T)}
					className={cn(className, 'flex items-center gap-3 cursor-pointer p-0 mb-2 last:mb-0 text-sm hover:!bg-transparent data-[selected]:!bg-transparent focus:!bg-transparent break-inside-avoid')}
				>
					<Checkbox
						id={key}
						checked={selected.includes(key as T)}
						onCheckedChange={() => toggle(key as T)}
					/>
					<Label htmlFor={key} className='truncate cursor-pointer'>{label}</Label>
				</div>
			))}
		</>
	)
}
