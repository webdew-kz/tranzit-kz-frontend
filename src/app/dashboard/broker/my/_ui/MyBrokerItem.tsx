"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import Loader from '@/shared/components/widgets/Loader'
import { convertFromKZT, convertToKZT, getCurrencySymbol } from '@/shared/lib/convertToKZT'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { getCountryCode } from '@/shared/lib/getCountryCode'
import { checkEndDate, isEndedDate } from '@/shared/lib/isEndedDate'
import { cn } from '@/shared/lib/utils'
import { BrokerServiceEnum, IBroker } from '@/shared/types/broker.type'
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowUp, BanknoteArrowUp, Box, CalendarDays, Check, ChevronDown, Container, Copy, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, RefreshCcw, SquarePen, Truck, Wallet, Weight, X } from 'lucide-react'
import React, { memo, SetStateAction, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { activateBroker, archivateBroker } from '../actions'
import { useRouter } from 'next/navigation'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'

interface MyBrokerItemProps {
	brokerInitial: IBroker
	selected: boolean
	onToggle: () => void
	setBrokers: (value: SetStateAction<IBroker[]>) => void
	rates?: any
	loading?: boolean
}

const MyBrokerItem = memo(({ brokerInitial, selected, onToggle, setBrokers, rates, loading }: MyBrokerItemProps) => {

	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)

	const [broker, setBroker] = useState<IBroker>(brokerInitial)

	const [places, setPlaces] = useState<string[]>([])

	const [pending, startTransition] = useTransition()

	useEffect(() => {
		setPlaces([...broker.brokerService]);
	}, [broker.brokerService]);

	const handleActivateBroker = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activateBroker({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setBroker((prev) => ({
					...prev,
					...res.updatedBroker,
				}))

				window.location.reload()

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении услуги', {
					position: 'top-center',
				})
			}
		})
	}

	const handleArchivateBroker = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await archivateBroker({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setBrokers(prev => prev.filter(broker => broker.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации услуги', {
					position: 'top-center',
				})
			}
		})
	}

	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}


	const filteredPlaces = places.filter(p => p && p.trim() !== '');
	const limitedPlaces = filteredPlaces.length > 4 ? filteredPlaces.slice(0, 4) : filteredPlaces;
	const rest = filteredPlaces.slice(4);

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>

				<div className=" flex justify-between w-full items-center mb-2">
					<div className=" font-medium flex gap-2 items-center">
						{/* <CalendarDays size={16} />
						<span className='text-nowrap'>{broker.endDate && checkEndDate(broker.startDate, broker.endDate)}</span> */}
					</div>
					<div className=" flex items-center gap-4 justify-end">
						<div className="flex items-center gap-2">
							<Checkbox
								id={broker.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={broker.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
					</div>
				</div>

				{broker.note && (
					<div className="flex items-center gap-2">
						<span>{broker.note}</span>
					</div>
				)}

				{broker.descr && (
					<div className="flex items-center gap-2">
						<span>{broker.descr}</span>
					</div>
				)}

				{broker.city && (
					<div className="flex items-center gap-2">
						<span>{broker.city}</span>
					</div>
				)}


				<div className='grid gap-1 mb-2'>
					{limitedPlaces.map((place, index) => (
						<div className="flex items-center gap-2 w-full text-xs" key={index}>
							<Check size={14} className="shrink-0" />
							<span>{BrokerServiceEnum[place as unknown as keyof typeof BrokerServiceEnum]}</span>
						</div>
					))}
				</div>

				<Collapsible className='sm:hidden flex flex-col gap-2' open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger className='flex gap-2 items-center justify-center'>
						<span>{isOpen ? "Скрыть" : "Подробнее"}</span>
						{isOpen ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
					</CollapsibleTrigger>
					<CollapsibleContent className='flex flex-col justify-between gap-2'>

						{rest.length > 0 && (
							<div className="flex flex-col md:flex-row gap-2 md:flex-wrap border-b border-(--dark-accent) mb-2 pb-2">
								{rest.map((place, index) => (
									<div className="flex items-center gap-1 w-full text-xs" key={index}>
										<Check size={14} className="shrink-0" />
										<span>
											{BrokerServiceEnum[place as unknown as keyof typeof BrokerServiceEnum]}
										</span>
									</div>
								))}
							</div>
						)}

						<div className="flex flex-col gap-1 lg:flex-row lg:gap-4 mb-2">
							<span className=' flex items-center gap-1'>
								<ArrowBigUp size={16} />
								<span className='truncate block text-sm'>
									<span className=' mr-2 font-light'>Обновлено:</span>
									<span className=' font-medium'>{broker.updatedAt && formatRelativeDate(broker.updatedAt)}</span>
								</span>
							</span>

							<span className=' flex items-center gap-1'>
								<ArrowBigDown size={16} />
								<span className='truncate block text-sm'>
									<span className=' mr-2 font-light'>Добавлено:</span>
									<span className=' font-medium'>{broker.createdAt && formatRelativeDate(broker.createdAt)}</span>
								</span>
							</span>

							<span className=' flex items-center gap-1'>
								<Eye size={16} />
								<span className='truncate block text-sm'>
									<span className=' mr-2 font-light'>Просмотров:</span>
									<span className=' font-medium'>{broker.views.count}</span>
								</span>
							</span>
						</div>

						<div className="flex flex-col gap-2 items-start lg:flex-row justify-between w-full">
							<div></div>
							<div className=" flex gap-2 w-full lg:w-auto">
								<Button
									variant='default'
									className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
									onClick={() => handleActivateBroker(broker.id!)}
									disabled={pending}
								>
									<RefreshCcw
										size={16}
										className='stroke-background group-hover:stroke-(--dark-accent)'
									/>
									<span className='hidden lg:block'>Повторить</span>
								</Button>

								<Button
									variant='outline'
									className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
									onClick={() => handleArchivateBroker(broker.id!)}
									disabled={pending}
								>
									<X size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
									<span className=' hidden lg:block'>Снять</span>
								</Button>
								<Button
									variant='outline'
									className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
									onClick={() => router.push(`/dashboard/broker/edit/${broker.id}`)}
								>
									<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
									<span className=' hidden lg:block'>Редактировать</span>
								</Button>
								<Button
									variant='outline'
									className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
									onClick={() => router.push(`/dashboard/broker/copy/${broker.id}`)}
								>
									<Copy size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
									<span className=' hidden lg:block'>Копировать</span>
								</Button>
							</div>
						</div>
					</CollapsibleContent>
				</Collapsible>

				<div className=" hidden sm:flex flex-col gap-1 lg:flex-row lg:gap-4 mb-2">
					<span className=' flex items-center gap-1'>
						<ArrowBigUp size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Обновлено:</span>
							<span className=' font-medium'>{broker.updatedAt && formatRelativeDate(broker.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{broker.createdAt && formatRelativeDate(broker.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{broker.views.count}</span>
						</span>
					</span>
				</div>

				<div className=" hidden sm:flex flex-col gap-2 items-start lg:flex-row justify-between w-full">
					<div></div>
					<div className=" flex gap-2 w-full lg:w-auto">
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleActivateBroker(broker.id!)}
							disabled={pending}
						>
							<RefreshCcw
								size={16}
								className='stroke-background group-hover:stroke-(--dark-accent)'
							/>
							<span className='hidden lg:block'>Повторить</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleArchivateBroker(broker.id!)}
							disabled={pending}
						>
							<X size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Снять</span>
						</Button>
						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/broker/edit/${broker.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>
						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/broker/copy/${broker.id}`)}
						>
							<Copy size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Копировать</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
})


export default MyBrokerItem