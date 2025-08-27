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
import { AdditionallyEnum, CurrencyEnum, DocumentsEnum, ITransport, LoadingsEnum, LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, TruckTypeEnum } from '@/shared/types/transport.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, RefreshCcw, SquarePen, Truck, Wallet, Weight, X } from 'lucide-react'
import React, { memo, SetStateAction, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { activateTransport, archivateTransport } from '../actions'
import { useRouter } from 'next/navigation'

interface MyTransportItemProps {
	transportInitial: ITransport
	selected: boolean
	onToggle: () => void
	setTransports: (value: SetStateAction<ITransport[]>) => void
	rates?: any
	loading?: boolean
}

const MyTransportItem = memo(({ transportInitial, selected, onToggle, setTransports, rates, loading }: MyTransportItemProps) => {

	const router = useRouter()

	const [transport, setTransport] = useState<ITransport>(transportInitial)

	const [places, setPlaces] = useState<string[]>([])

	const [pending, startTransition] = useTransition()

	const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.KZT) // валюта по умолчанию - тенге

	const [baseAmountPriceKZT, setBaseAmountPriceKZT] = useState(0); // базовая цена в тенге
	const [baseAmountTariffKZT, setBaseAmountTariffKZT] = useState(0);

	const [amountPrice, setAmountPrice] = useState(0)
	const [amountTariff, setAmountTariff] = useState(0)



	useEffect(() => {
		setPlaces([...transport.placesLoading, ...transport.placesUnloading]);
	}, [transport.placesLoading, transport.placesUnloading]);

	// useEffect(() => {

	// 	if (!loading && rates && transport && transport.price && transport.tariff && transport.currency) {
	// 		setAmountPrice(convertToKZT(Number(transport.price), transport.currency, rates))
	// 		setAmountTariff(convertToKZT(Number(transport.tariff), transport.currency, rates))

	// 		setBaseAmountPriceKZT(convertToKZT(Number(transport.price), transport.currency, rates))
	// 		setBaseAmountTariffKZT(convertToKZT(Number(transport.tariff), transport.currency, rates))
	// 	}

	// }, [rates, transport.tariff, transport.price, transport.currency])

	const handleActivateTransport = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activateTransport({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				window.location.reload()

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении транспорта', {
					position: 'top-center',
				})
			}
		})
	}

	const handleArchivateTransport = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await archivateTransport({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setTransports(prev => prev.filter(transport => transport.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации транспорта', {
					position: 'top-center',
				})
			}
		})
	}

	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	return (
		<Card className={cn(isEndedDate(transport.endDate!) && '!text-muted-foreground', 'p-0 border-1 border-(--dark-accent) ')}>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full items-center mb-2">
					<div className=" font-medium flex gap-2 items-center">
						<CalendarDays size={16} />
						<span className='text-nowrap'>{transport.endDate && checkEndDate(transport.startDate, transport.endDate)}</span>
					</div>
					<div className=" flex items-center gap-4 justify-end">
						<div className="flex items-center gap-2">
							<Checkbox
								id={transport.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={transport.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3">
					<div className=" w-full flex gap-2 flex-wrap">
						{places.length > 0 && places.map((place, index) => {
							const [city, country] = place.split(",").map((str) => str.trim());

							return (
								<span key={`${city}-${country}-${index}`} className="flex items-center gap-3 ">
									<span className="font-medium leading-none uppercase">
										{`${city} ${getCountryCode(country) ? `(${getCountryCode(country)})` : ''}`}
									</span>
									{index < places.length - 1 && <MoveRight size={16} />}
								</span>
							);
						})}
					</div>
				</div>
				{/* <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:justify-between">
					<div className="grid grid-cols-2 gap-2 lg:flex lg:gap-4">
						<div className=" flex items-center gap-2 max-w-[200px]">
							<Truck size={16} />
							{transport.truckType && transport.truckType.map((item, index) => (
								<span className=' truncate block' key={index} >{TruckTypeEnum[item as unknown as keyof typeof TruckTypeEnum]}</span>
							))}
						</div>

						<div className=" flex items-center gap-2 max-w-[200px]">
							<Container size={16} />
							{transport.loadingType && transport.loadingType.map((item, index) => (
								<span className=' truncate block' key={index} >{LoadingTypeEnum[item as unknown as keyof typeof LoadingTypeEnum]}</span>
							))}
						</div>

						<div className=" flex items-center gap-2">
							<Weight size={16} />
							{transport.weight && (
								<span className='truncate block'>{`${transport.weight} тонн`}</span>
							)}
						</div>

						<div className=" flex items-center gap-2">
							<Move3d size={16} />
							{transport.volume && (
								<span className='truncate block'>{`${transport.volume} м`}<span className=' align-super text-xs'>3</span></span>
							)}
						</div>
					</div>
					{transport.note && (
						<div className=" flex items-center gap-2 max-w-[200px]">
							<MessageCircleMore size={16} />
							<span className=' truncate block' >{transport.note}</span>
						</div>
					)}
				</div> */}

				<div className="mb-3 flex flex-col gap-2 ">
					<div className="grid gap-2 lg:flex lg:gap-4">

						<div className="grid grid-cols-2 lg:flex items-center gap-2">
							<div className=" flex items-center gap-2">
								<Weight size={16} />
								{transport.weight && (
									<span className='truncate block'>{`${transport.weight} тонн`}</span>
								)}
							</div>

							<div className=" flex items-center gap-2">
								<Move3d size={16} />
								{transport.volume && (
									<span className='truncate block'>{`${transport.volume} м`}<span className=' align-super text-xs'>3</span></span>
								)}
							</div>
						</div>

						<div className=" flex items-center gap-2 ">
							<Container size={16} />
							{transport.loadingType && transport.loadingType.map((item, index) => (
								<span className=' truncate block' key={index} >{LoadingTypeEnum[item as unknown as keyof typeof LoadingTypeEnum]}</span>
							))}
						</div>

						<div className=" flex items-center gap-2 flex-wrap">
							<Truck size={16} />
							{transport.truckType && transport.truckType.map((item, index) => (
								<span className=' truncate block' key={index} >{TruckTypeEnum[item as unknown as keyof typeof TruckTypeEnum]}</span>
							))}
						</div>


					</div>
					{transport.note && (
						<div className=" flex items-center gap-2">
							<MessageCircleMore size={16} className=' shrink-0' />
							<span className=' ' >{transport.note}</span>
						</div>
					)}
				</div>
				<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">
					<span className=' flex items-center gap-1'>
						<ArrowBigUp size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Обновлено:</span>
							<span className=' font-medium'>{transport.updatedAt && formatRelativeDate(transport.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{transport.createdAt && formatRelativeDate(transport.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{transport.views.count}</span>
						</span>
					</span>
				</div>
				<div className=" flex flex-col gap-3 items-start lg:flex-row justify-between w-full">
					<div>
						{((transport.optionDocuments && transport.optionDocuments.length > 0) || transport.optionDocumentsAdr) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>



									{((transport.optionDocuments && transport.optionDocuments.length > 0) || transport.optionDocumentsAdr) && (
										<div>
											<div className="mb-1 font-medium text-(--dark-accent)">Документы</div>
											{transport.optionDocuments && transport.optionDocuments.length > 0 && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Тип:</span>
													<span className=" font-light">
														{transport.optionDocuments.map((item) => DocumentsEnum[item as unknown as keyof typeof DocumentsEnum].toUpperCase())
															.join(", ")}
													</span>
												</div>
											)}
											{transport.optionDocumentsAdr && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>ADR:</span>
													<span className=" font-light">{`${transport.optionDocumentsAdr.toUpperCase()}`}</span>
												</div>
											)}
										</div>
									)}




								</PopoverContent>
							</Popover>
						)}
					</div>
					<div className=" flex gap-2 w-full lg:w-auto">
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleActivateTransport(transport.id!)}
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
							onClick={() => handleArchivateTransport(transport.id!)}
							disabled={pending}
						>
							<X size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Снять</span>
						</Button>
						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/transport/edit/${transport.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>
						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/transport/copy/${transport.id}`)}
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


export default MyTransportItem