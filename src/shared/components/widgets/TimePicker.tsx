

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const minutes = ["00", "15", "30", "45"]

export function TimePicker({
	value,
	onChange,
	text
}: {
	value?: string
	onChange: (val: string) => void
	text?: string
}) {
	const [selectedHour, setHour] = useState(value?.split(":")[0] || "")
	const [selectedMinute, setMinute] = useState(value?.split(":")[1] || "")

	const updateTime = (h: string, m: string) => {
		const time = `${h}:${m}`
		onChange(time)
	}

	return (
		<div className="flex flex-col xl:flex-row gap-1 xl:gap-2 xl:justify-between">
			<span className='text-sm'>{text}</span>
			<div className="grid grid-cols-2 gap-2 w-full xl:w-auto">
				<Select
					value={selectedHour}
					onValueChange={(h) => {
						setHour(h)
						updateTime(h, selectedMinute || "00")
					}}
				>
					<SelectTrigger className='w-full xl:w-20'>
						<SelectValue placeholder="00" />
					</SelectTrigger>
					<SelectContent className=' max-h-60 overflow-y-auto'>
						{hours.map((h) => (
							<SelectItem key={h} value={h}>
								{h}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={selectedMinute}
					onValueChange={(m) => {
						setMinute(m)
						updateTime(selectedHour || "00", m)
					}}
				>
					<SelectTrigger className='w-full xl:w-20'>
						<SelectValue placeholder="00" />
					</SelectTrigger>
					<SelectContent className=' max-h-60 overflow-y-auto'>
						{minutes.map((m) => (
							<SelectItem key={m} value={m}>
								{m}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
