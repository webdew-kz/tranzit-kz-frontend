"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { getCountryCode } from '@/shared/lib/getCountryCode'
import { checkEndDate, isEndedDate } from '@/shared/lib/isEndedDate'
import { cn } from '@/shared/lib/utils'
import { AdditionallyEnum, CurrencyEnum, DocumentsEnum, ITransport, LoadingsEnum, LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, TruckTypeEnum } from '@/shared/types/transport.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { addView, removeFromWishlist } from '../../search/actions'
import { convertFromKZT, convertToKZT, getCurrencySymbol } from '@/shared/lib/convertToKZT'

interface TransportSearchItemProps {
	transport: ITransport
	setTransports?: React.Dispatch<React.SetStateAction<ITransport[]>>
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>;
}

const TransportWishItem = memo(
	({ transport, rates, loading, setWishlistLength, setTransports }: TransportSearchItemProps) => {

		const [places, setPlaces] = useState<string[]>([])

		const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.KZT) // валюта по умолчанию - тенге

		const [baseAmountPriceKZT, setBaseAmountPriceKZT] = useState(0); // базовая цена в тенге
		const [baseAmountTariffKZT, setBaseAmountTariffKZT] = useState(0);

		const [amountPrice, setAmountPrice] = useState(0)
		const [amountTariff, setAmountTariff] = useState(0)


		const [pending, startTransition] = useTransition()

		useEffect(() => {
			setPlaces([
				...(transport.placesLoading || []),
				...(transport.placesUnloading || []),
			]);
		}, [transport.placesLoading, transport.placesUnloading]);

		// useEffect(() => {


		// 	if (!loading && rates && transport && transport.price && transport.tariff && transport.currency) {
		// 		setAmountPrice(convertToKZT(Number(transport.price), transport.currency, rates))
		// 		setAmountTariff(convertToKZT(Number(transport.tariff), transport.currency, rates))

		// 		setBaseAmountPriceKZT(convertToKZT(Number(transport.price), transport.currency, rates))
		// 		setBaseAmountTariffKZT(convertToKZT(Number(transport.tariff), transport.currency, rates))
		// 	}

		// }, [rates, transport.tariff, transport.price, transport.currency])

		const handleAddView = async (id: string) => {
			await addView(id)
		}


		const handleRemoveFromWishlist = async () => {
			const res = await removeFromWishlist(transport.id!);
			const current = getWishlist().filter((id) => id !== transport.id!);
			localStorage.setItem("wishlistTransport", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistTransport") || "[]");
			if (setTransports) {
				setTransports(prev => prev.filter(c => c.id !== transport.id!));
			}
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		};


		function getWishlist(): string[] {
			if (typeof window === "undefined") return [];
			const data = localStorage.getItem("wishlistTransport");
			return data ? JSON.parse(data) : [];
		}

		function isInWishlist(transportId: string): boolean {
			return getWishlist().includes(transportId);
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
						<div className=" flex items-center">
							<button type='button' onClick={handleRemoveFromWishlist} className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} fill='#b4802e' />
								<span>Убрать из избранного</span>
							</button>
						</div>
					</div>
					<div className=" w-full flex gap-2  flex-wrap mb-3">
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
								<span className=' font-medium'>{transport?.views?.count}</span>
							</span>
						</span>
					</div>
					<div className=" flex items-start justify-between w-full">
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
						<div>
							{transport.userPhone && (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant='default'
											className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
											onClick={() => transport.id && handleAddView(transport.id)}
										>
											<span className=''>Показать контакты</span>
										</Button>
									</PopoverTrigger>
									<PopoverContent align='end' className='p-5 w-auto'>
										<div className="grid gap-2 justify-start">
											{transport.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${transport.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${transport.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{transport.user.whatsapp && (
												<Button variant='link' asChild>
													<Link
														href={`https://wa.me/${transport.user.whatsapp}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/whatsapp.svg' alt='whatsapp' width={18} height={18} />
														<span>WhatsApp</span>
													</Link>
												</Button>
											)}
											{transport.user.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${transport.user.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{transport.user.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${transport.user.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{transport.user.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${transport.user.telegram}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/telegram.svg' alt='telegram' width={18} height={18} />
														<span>Telegram</span>
													</Link>
												</Button>
											)}
										</div>
									</PopoverContent>
								</Popover>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		)
	})


export default TransportWishItem
