'use client'

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useState } from "react"
import { cn } from "@/shared/lib/utils"

import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar" // из shadcn/ui

interface DatePickerProps {
	value?: string // ISO
	onChange: (value: string | undefined) => void
	placeholder?: string
	className?: string
}

export function DatePicker({ value, onChange, placeholder = "Выберите дату", className }: DatePickerProps) {
	const [open, setOpen] = useState(false)

	const handleSelect = (date?: Date) => {
		onChange(date ? date.toISOString() : undefined)
		if (date) setOpen(false)
	}

	const formatted = value ? format(new Date(value), "dd.MM.yyyy", { locale: ru }) : null

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className={cn("w-full justify-between text-left font-normal", !value && "text-muted-foreground", className)}
				>
					{formatted || placeholder}
					<CalendarIcon size={16} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0 bg-background mt-2 rounded-lg">
				<Calendar
					locale={ru}
					mode="single"
					selected={value ? new Date(value) : undefined}
					onSelect={handleSelect}
				// initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
