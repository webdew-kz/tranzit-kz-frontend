"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { convertFromKZT, convertToKZT, getCurrencySymbol } from '@/shared/lib/convertToKZT'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { getCountryCode } from '@/shared/lib/getCountryCode'
import { checkEndDate, isEndedDate } from '@/shared/lib/isEndedDate'
import { cn } from '@/shared/lib/utils'
import { AdditionallyEnum, CurrencyEnum, DocumentsEnum, ICargo, LoadingsEnum, LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, TruckTypeEnum } from '@/shared/types/cargo.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { addToWishlist, addView, removeFromWishlist } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { useUserStore } from '@/shared/store/useUserStore'

interface CargoSearchItemProps {
	cargo: ICargo
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
}

const CargoSearchItem = memo(({ cargo, rates, loading, setWishlistLength, isContact = true, isWishBtn = true }: CargoSearchItemProps) => {


	const { user } = useUserStore()
	const [places, setPlaces] = useState<string[]>([])


	const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.KZT) // валюта по умолчанию - тенге

	const [baseAmountPriceKZT, setBaseAmountPriceKZT] = useState(0); // базовая цена в тенге
	const [baseAmountTariffKZT, setBaseAmountTariffKZT] = useState(0);

	const [amountPrice, setAmountPrice] = useState(0)
	const [amountTariff, setAmountTariff] = useState(0)


	const [pending, startTransition] = useTransition()
	const [isWishlist, setIsWishlist] = useState(false)

	useEffect(() => {
		const current = getWishlist();
		if (current.includes(cargo.id!)) {
			setIsWishlist(true);
		}
	}, [])

	useEffect(() => {
		setPlaces([...cargo.placesLoading, ...cargo.placesUnloading]);
	}, [cargo.placesLoading, cargo.placesUnloading]);

	useEffect(() => {

		if (!loading && rates && cargo && cargo.price && cargo.tariff && cargo.currency) {
			setAmountPrice(convertToKZT(Number(cargo.price), cargo.currency, rates))
			setAmountTariff(convertToKZT(Number(cargo.tariff), cargo.currency, rates))

			setBaseAmountPriceKZT(convertToKZT(Number(cargo.price), cargo.currency, rates))
			setBaseAmountTariffKZT(convertToKZT(Number(cargo.tariff), cargo.currency, rates))
		}

	}, [rates, cargo.tariff, cargo.price, cargo.currency])

	const handleAddView = async (id: string) => {
		const viewedKey = `viewed-${id}`;
		if (localStorage.getItem(viewedKey)) return;

		await addView(id);
		localStorage.setItem(viewedKey, "true");
	};


	const handleToggleWishlist = async () => {
		if (isWishlist) {
			const res = await removeFromWishlist(cargo.id!);
			const current = getWishlist().filter((id) => id !== cargo.id!);
			localStorage.setItem("wishlist", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			const res = await addToWishlist(cargo.id!);
			const current = getWishlist();
			if (!current.includes(cargo.id!)) {
				localStorage.setItem("wishlist", JSON.stringify([...current, cargo.id!]));
			}
			const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		}

		setIsWishlist(!isWishlist);
	};


	function getWishlist(): string[] {
		if (typeof window === "undefined") return [];
		const data = localStorage.getItem("wishlist");
		return data ? JSON.parse(data) : [];
	}

	function isInWishlist(cargoId: string): boolean {
		return getWishlist().includes(cargoId);
	}

	const route = places.map((place) => {
		const [city, country] = place.split(",").map((str) => str.trim());
		return `${city} ${getCountryCode(country) ? `(${getCountryCode(country)})` : ''}`;
	}).join(" → ");
	console.log(route);

	const truckTypes = cargo.truckType?.map((item) => TruckTypeEnum[item as unknown as keyof typeof TruckTypeEnum]).join(", ");

	const message = `Здравствуйте. Данная заявка актуальна?\n\nГруз: ${cargo.title}\nМаршрут: ${route}\nЦена: ${cargo.price} ${getCurrencySymbol(cargo.currency)}\nТип фуры: ${truckTypes}\n\nСсылка на груз: https://${process.env.DOMAIN}/dashboard/cargo/${cargo.id}`
	const link = `https://wa.me/${cargo.userPhone}?text=${encodeURIComponent(message)}`


	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	if (user?.isBlocked) return null

	return (
		<Card className={cn(isEndedDate(cargo.endDate!) && '!text-muted-foreground', 'p-0 border-1 border-(--dark-accent) ')}>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full items-center mb-2">
					<div className=" font-medium flex gap-2 items-center">
						<CalendarDays size={16} />
						<span className='text-nowrap'>{cargo.endDate && checkEndDate(cargo.startDate, cargo.endDate)}</span>
					</div>
					<div className=" flex items-center">
						{isWishBtn && isInWishlist(cargo.id!) ? (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} fill='#b4802e' />
								<span>Убрать из избранного</span>
							</button>
						) : isWishBtn && (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} />
								<span>Добавить в избранное</span>
							</button>
						)}
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
					<a
						href={cargo.routeLink}
						target='_blank'
						className=' text-sm text-nowrap text-(--dark-accent) underline underline-offset-3'
					>Посмотреть маршрут</a>
				</div>
				<div className=" flex flex-col lg:flex-row gap-2 w-full lg:justify-between lg:items-center mb-3">

					<div className=" grid gap-2 lg:flex lg:gap-4">
						<div className=" flex items-center gap-2">
							<Box size={16} />
							<span className=' truncate block'>{cargo.title}</span>
						</div>

						<div className=" flex items-center gap-2 max-w-full">
							<HandCoins size={16} />
							{cargo.paymentMethod && cargo.paymentMethod.map((item, index) => (
								<span className=' truncate block' key={index} >{PaymentMethodEnum[item as unknown as keyof typeof PaymentMethodEnum]}</span>
							))}
						</div>
					</div>

					{(cargo.distance && amountTariff && amountPrice) ? (

						<div className=" grid grid-cols-2 lg:flex gap-2 lg:gap-4 items-center flex-wrap justify-center">
							<div className=" flex gap-2 items-center">
								{Number(cargo.distance) > 0 && (
									<>
										<MoveHorizontal size={16} />
										<span className='truncate block'>{`${cargo.distance?.toLocaleString('ru-RU')} км`}</span>
									</>
								)}
							</div>
							<div className=" flex gap-2 items-center">
								{Number(amountTariff) > 0 && (
									<>
										<BanknoteArrowUp size={16} />
										<span className='truncate block'>{`${Number(amountTariff?.toFixed(2))?.toLocaleString('ru-RU')} ${getCurrencySymbol(currency)}/км`}</span>
									</>
								)}
							</div>
							<div className=" flex gap-2 items-center">
								{Number(amountPrice) > 0 && (
									<>
										<Wallet size={16} />
										<span className='truncate block'>{`${Number(amountPrice?.toFixed(2)).toLocaleString('ru-RU')} ${getCurrencySymbol(currency)}`}</span>
									</>
								)}
							</div>
							<Select
								onValueChange={(currency) => convertFromKZT(baseAmountPriceKZT, setAmountPrice, baseAmountTariffKZT, setAmountTariff, currency, rates, (value) => setCurrency(value as CurrencyEnum))}
							>
								<SelectTrigger className=" w-full lg:w-auto">
									<SelectValue placeholder="Валюта" />
								</SelectTrigger>
								<SelectContent align='end'>
									{Object.entries(CurrencyEnum).map(([key, currency]) => (
										<SelectItem key={key} value={currency}>
											{currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : null}
				</div>

				<div className="mb-3 flex flex-col gap-2 ">
					<div className="grid gap-2 lg:flex lg:gap-4">

						<div className="grid grid-cols-2 lg:flex items-center gap-2">
							<div className=" flex items-center gap-2">
								<Weight size={16} />
								{cargo.weight && (
									<span className='truncate block'>{`${cargo.weight} тонн`}</span>
								)}
							</div>

							<div className=" flex items-center gap-2">
								<Move3d size={16} />
								{cargo.volume && (
									<span className='truncate block'>{`${cargo.volume} м`}<span className=' align-super text-xs'>3</span></span>
								)}
							</div>
						</div>
						<div className=" flex items-center gap-2 ">
							<Container size={16} />
							{cargo.loadingType && cargo.loadingType.map((item, index) => (
								<span className=' truncate block' key={index} >{LoadingTypeEnum[item as unknown as keyof typeof LoadingTypeEnum]}</span>
							))}
						</div>

						<div className=" flex items-center gap-2 flex-wrap">
							<Truck size={16} />
							{cargo.truckType && cargo.truckType.map((item, index) => (
								<span className=' truncate block' key={index} >{TruckTypeEnum[item as unknown as keyof typeof TruckTypeEnum]}</span>
							))}
						</div>


					</div>
					{cargo.note && (
						<div className=" flex items-center gap-2">
							<MessageCircleMore size={16} className=' shrink-0' />
							<span className=' ' >{cargo.note}</span>
						</div>
					)}
				</div>

				<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">
					<span className=' flex items-center gap-1'>
						<ArrowBigUp size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Обновлено:</span>
							<span className=' font-medium'>{cargo.updatedAt && formatRelativeDate(cargo.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{cargo.createdAt && formatRelativeDate(cargo.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{cargo?.views?.count}</span>
						</span>
					</span>
				</div>
				<div className=" flex items-start justify-between w-full">
					<div>
						{((cargo.paymentPeriod && cargo.paymentPeriod.length > 0) || (cargo.paymentOther && cargo.paymentOther.length > 0) || cargo.paymentPrepaymentPercent || cargo.paymentDeferredDays || (cargo.optionDocuments && cargo.optionDocuments.length > 0) || cargo.optionDocumentsAdr || (cargo.optionLoadings && cargo.optionLoadings.length > 0) || cargo.optionLoadingsBigBag || cargo.optionLoadingsDateUnloading || cargo.optionLoadingsPlaceLoading || cargo.optionLoadingsPlaceUnloading || cargo.optionLoadingsTimeLoading || cargo.optionLoadingsTimeUnloading || (cargo.optionTerms && cargo.optionTerms.length > 0) || cargo.optionTermsBelts || cargo.optionTermsCorners || cargo.optionTermsPalletsType || cargo.optionTermsQtyPallets || cargo.optionTermsTemperature || (cargo.optionAdditionally && cargo.optionAdditionally.length > 0)) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>

									{((cargo.paymentPeriod && cargo.paymentPeriod?.length > 0) || (cargo.paymentOther && cargo.paymentOther?.length > 0) || cargo.paymentPrepaymentPercent || cargo.paymentDeferredDays) && (
										<div >
											<div className="mb-1 font-medium text-(--dark-accent)">Детали оплаты</div>
											{cargo.paymentPeriod && cargo.paymentPeriod.length > 0 && (
												<span className=" font-light text-sm">
													{cargo.paymentPeriod
														.map((item) => PaymentPeriodEnum[item as unknown as keyof typeof PaymentPeriodEnum].toLowerCase())
														.join(" | ")}
												</span>
											)}
											{cargo.paymentOther && cargo.paymentOther.length > 0 && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Дополнительно:</span>
													<span className=" font-light">
														{cargo.paymentOther.map((item) => PaymentOtherEnum[item as unknown as keyof typeof PaymentOtherEnum].toLowerCase())
															.join(" | ")}
													</span>
												</div>
											)}
											{cargo.paymentPrepaymentPercent && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Предоплата:</span>
													<span className=" font-light">{`${cargo.paymentPrepaymentPercent}%`}</span>
												</div>
											)}
											{cargo.paymentDeferredDays && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Отсрочка:</span>
													<span className=" font-light">{`${cargo.paymentDeferredDays} дней`}</span>
												</div>
											)}
										</div>
									)}

									{((cargo.optionDocuments && cargo.optionDocuments.length > 0) || cargo.optionDocumentsAdr) && (
										<div>
											<div className="mb-1 font-medium text-(--dark-accent)">Документы</div>
											{cargo.optionDocuments && cargo.optionDocuments.length > 0 && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Тип:</span>
													<span className=" font-light">
														{cargo.optionDocuments.map((item) => DocumentsEnum[item as unknown as keyof typeof DocumentsEnum].toUpperCase())
															.join(", ")}
													</span>
												</div>
											)}
											{cargo.optionDocumentsAdr && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>ADR:</span>
													<span className=" font-light">{`${cargo.optionDocumentsAdr.toUpperCase()}`}</span>
												</div>
											)}
										</div>
									)}


									{((cargo.optionLoadings && cargo.optionLoadings.length > 0) || cargo.optionLoadingsTimeLoading || cargo.optionLoadingsTimeUnloading || cargo.optionLoadingsPlaceLoading || cargo.optionLoadingsPlaceUnloading || cargo.optionLoadingsBigBag || cargo.optionLoadingsDateUnloading) && (
										<div>
											<div className=" font-medium text-(--dark-accent)">Погрузка</div>
											{cargo.optionLoadings && cargo.optionLoadings.length > 0 && (
												<span className=" font-light text-sm">
													{cargo.optionLoadings.map((item) => LoadingsEnum[item as unknown as keyof typeof LoadingsEnum].toLowerCase())
														.join(", ")}
												</span>
											)}
											{cargo.optionLoadingsDateUnloading && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Дата разгрузки:</span>
													<span className=" font-light">{`${new Date(cargo.optionLoadingsDateUnloading).toLocaleDateString('ru-RU')}`}</span>
												</div>
											)}
											{cargo.optionLoadingsTimeLoading && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Время погрузки:</span>
													<span className=" font-light">{`${cargo.optionLoadingsTimeLoading}`}</span>
												</div>
											)}
											{cargo.optionLoadingsTimeUnloading && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Время разгрузки:</span>
													<span className=" font-light">{`${cargo.optionLoadingsTimeUnloading}`}</span>
												</div>
											)}
											{cargo.optionLoadingsPlaceLoading && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Место погрузки:</span>
													<span className=" font-light">{`${cargo.optionLoadingsPlaceLoading}`}</span>
												</div>
											)}
											{cargo.optionLoadingsPlaceUnloading && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Место разгрузки:</span>
													<span className=" font-light">{`${cargo.optionLoadingsPlaceUnloading}`}</span>
												</div>
											)}
											{cargo.optionLoadingsBigBag && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Биг-бэг:</span>
													<span className=" font-light">{`${cargo.optionLoadingsBigBag}`}</span>
												</div>
											)}
										</div>
									)}

									{((cargo.optionTerms && cargo.optionTerms.length > 0) || cargo.optionTermsTemperature || cargo.optionTermsQtyPallets || cargo.optionTermsCorners || cargo.optionTermsBelts || cargo.optionTermsPalletsType) && (
										<div>
											<div className=" font-medium text-(--dark-accent)">Условия</div>
											{cargo.optionTerms && cargo.optionTerms.length > 0 && (
												<span className=" font-light text-sm">
													{cargo.optionTerms.map((item) => TermsEnum[item as unknown as keyof typeof TermsEnum].toLowerCase())
														.join(", ")}
												</span>
											)}
											{cargo.optionTermsTemperature && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Температура:</span>
													<span className=" font-light">{`${cargo.optionTermsTemperature}`}</span>
												</div>
											)}
											{cargo.optionTermsQtyPallets && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Количество паллет:</span>
													<span className=" font-light">{`${cargo.optionTermsQtyPallets}`}</span>
												</div>
											)}
											{cargo.optionTermsCorners && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Уголки:</span>
													<span className=" font-light">{`${cargo.optionTermsCorners}`}</span>
												</div>
											)}
											{cargo.optionTermsBelts && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Ремни:</span>
													<span className=" font-light">{`${cargo.optionTermsBelts}`}</span>
												</div>
											)}
											{cargo.optionTermsPalletsType && (
												<div className=" flex gap-2 flex-wrap text-sm">
													<span className=' text-muted-foreground'>Тип паллет:</span>
													<span className=" font-light">
														{TermsPalletsTypeEnum[cargo.optionTermsPalletsType as unknown as keyof typeof TermsPalletsTypeEnum]}
													</span>
												</div>
											)}
										</div>
									)}
									{cargo.optionAdditionally && cargo.optionAdditionally.length > 0 && (
										<div>
											<div className=" font-medium text-(--dark-accent)">Дополнительно</div>
											{cargo.optionAdditionally && cargo.optionAdditionally.length > 0 && (
												<span className=" font-light text-sm">
													{cargo.optionAdditionally.map((item) => AdditionallyEnum[item as unknown as keyof typeof AdditionallyEnum].toLowerCase()).join(", ")}
												</span>
											)}
										</div>
									)}

								</PopoverContent>
							</Popover>
						)}
					</div>
					<div>
						{(cargo.userPhone && isContact) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='default'
										className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
										onClick={() => {
											if (!user?.isRegistered || !cargo?.id) return;
											handleAddView(cargo.id);
										}}
									>
										<span className=''>Показать контакты</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent align='end' className='p-5 break-words max-w-xs'>
									{!user?.isRegistered ? (
										<div className="grid gap-2 justify-start">
											<span >Доступ к контактам доступен по абонентской плате — 1000 тенге в месяц.</span>
											<Button
												className=' bg-(--dark-accent)'
												asChild
											>
												<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
											</Button>
										</div>
									) : (
										<div className="grid gap-2 justify-start">
											{cargo.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${cargo.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${cargo.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{cargo.user.phone && (
												<Button variant='link' asChild>
													<Link
														href={link}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/whatsapp.svg' alt='whatsapp' width={18} height={18} />
														<span>WhatsApp</span>
													</Link>
												</Button>
											)}
											{cargo?.user?.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${cargo?.user?.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{cargo?.user?.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${cargo?.user?.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{cargo?.user?.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${cargo?.user?.telegram}`}
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
									)}
								</PopoverContent>
							</Popover>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
})


export default CargoSearchItem