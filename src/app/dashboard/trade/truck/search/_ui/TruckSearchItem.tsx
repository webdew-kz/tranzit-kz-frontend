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
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { addToWishlist, addView, getIsInWishlist, getWishlistByUserId, removeFromWishlist } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { DriveEnum, ExistEnum, ITruck, StatusEnum, SteeringEnum, TransmissionEnum, TruckBrandEnum, TruckWheelEnum, TypeEngineEnum, TypeTruckEnum } from '@/shared/types/truck.type'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import Loader from '@/shared/components/widgets/Loader'
import { useUserStore } from '@/shared/store/useUserStore'

interface TruckSearchItemProps {
	truckInitial: ITruck
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
}

const TruckSearchItem = memo(({ truckInitial, rates, loading, setWishlistLength, isContact = true, isWishBtn = true }: TruckSearchItemProps) => {
	const { user } = useUserStore()
	const [truck, setTruck] = useState<ITruck>(truckInitial)
	const [pending, startTransition] = useTransition()
	const [isWishlist, setIsWishlist] = useState(false)

	useEffect(() => {
		const fetchIsInWishlist = async () => {
			startTransition(async () => {
				if (!truck.id) return;

				const isInWishlist = await getIsInWishlist(truck?.id);

				console.log(`Truck ID: ${truck.id}, Is in wishlist: ${isInWishlist}`);


				setIsWishlist(isInWishlist);

				if (!isInWishlist) {
					const current = getWishlist().filter((id) => id !== truck.id!);
					localStorage.setItem("wishlistTrucks", JSON.stringify(current));
					const stored = JSON.parse(localStorage.getItem("wishlistTrucks") || "[]");
					if (setWishlistLength) {
						setWishlistLength(stored.length);
					}
				} else {
					const current = getWishlist();
					if (!current.includes(truck.id!)) {
						localStorage.setItem("wishlistTrucks", JSON.stringify([...current, truck.id!]));
					}
					const stored = JSON.parse(localStorage.getItem("wishlistTrucks") || "[]");
					if (setWishlistLength) {
						setWishlistLength(stored.length);
					}
				}
			})
		}

		fetchIsInWishlist()
	}, [])



	const handleAddView = async (id: string) => {
		const viewedKey = `viewed-${id}`;
		if (localStorage.getItem(viewedKey)) return;

		await addView(id);
		localStorage.setItem(viewedKey, "true");
	};


	const handleToggleWishlist = async () => {
		if (isWishlist) {
			const res = await removeFromWishlist(truck.id!);
			const current = getWishlist().filter((id) => id !== truck.id!);
			localStorage.setItem("wishlistTrucks", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistTrucks") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			const res = await addToWishlist(truck.id!);
			const current = getWishlist();
			if (!current.includes(truck.id!)) {
				localStorage.setItem("wishlistTrucks", JSON.stringify([...current, truck.id!]));
			}
			const stored = JSON.parse(localStorage.getItem("wishlistTrucks") || "[]");
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
		const data = localStorage.getItem("wishlistTrucks")

		return data ? JSON.parse(data) : [];
	}

	const message = `Здравствуйте. Данная заявка актуальна?\n\Марка: ${truck.truckBrand}\nЦена: ${truck.price} тенге\nГод: ${truck.year}\n\nСсылка на грузовик: https://${process.env.DOMAIN}/dashboard/trade/truck/${truck.id}`
	const link = `https://wa.me/${truck.userPhone}?text=${encodeURIComponent(message)}`


	if (pending || !user) {
		return <Loader />
	}
	if (user?.isBlocked) return null

	return (
		<Card className='p-0 border-1 border-(--dark-accent)'>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>

				<div className=" flex justify-between w-full md:items-center mb-3">
					<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4">

					</div>
					<div className=" flex">
						{(isWishBtn && isWishlist) ? (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={24} fill='#b4802e' />
								{/* <span>Из избранного</span> */}
							</button>
						) : isWishBtn && (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={24} />
								{/* <span>В избранное</span> */}
							</button>
						)}
					</div>
				</div>

				<div className=" grid md:grid-cols-3 gap-3 md:gap-5  mb-3">
					<div className=" aspect-4/3 relative rounded-lg overflow-hidden">
						{truck.photos && truck.photos.length > 0 ? (
							<>
								<Dialog>
									<DialogTrigger className=' relative w-full aspect-4/3	'>
										<img
											src={`${process.env.SERVER_URL}${truck.photos[0]}`}
											alt={truck.photos[0]}
											className="absolute inset-0 w-full h-full object-cover z-0 opacity-[50%]"
										/>
										<span className=' w-[36px] h-[36px] rounded-md absolute left-[50%] top-[50%] translate-[-50%] bg-(--dark-accent) flex justify-center items-center'  >
											<ZoomIn size={16} className='stroke-accent z-10' />
										</span>
									</DialogTrigger>
									<DialogContent className="overflow-y-auto max-h-[100vh] pt-12">
										<DialogTitle className="sr-only">Фотографии грузовика</DialogTitle>
										<div className="grid gap-1">
											{truck.photos.map((photo, index) => (
												<img
													key={index}
													src={`${process.env.SERVER_URL}${photo}`}
													alt={`Truck photo ${index + 1}`}
													className="w-full h-auto object-cover"
												/>
											))}
										</div>
										<DialogFooter>
											<DialogClose asChild>
												<Button className=' bg-(--dark-accent)'>Закрыть</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>

							</>
						) : (
							<img src="/images/no_image.jpg" alt='no_image' className=' absolute inset-0 w-full h-full object-cover z-0' />
						)}
					</div>
					<div className=" grid  md:col-span-2 md:py-5 items-center">
						<div className=" flex flex-col text-[18px] gap-1 md:gap-3">
							<div className=" grid grid-cols-3 items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Марка:</span>
								<span className=' col-span-2'>{TruckBrandEnum[truck.truckBrand as unknown as keyof typeof TruckBrandEnum]}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Цена:</span>
								<span className=' col-span-2'>{`${truck.price.toLocaleString('ru-RU')} ₸`}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Год:</span>
								<span className=' col-span-2'>{truck.year}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Город:</span>
								<span className=' col-span-2'>{truck.city}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Тип кузова:</span>
								<span className=' col-span-2'>{TypeTruckEnum[truck.typeTruck as unknown as keyof typeof TypeTruckEnum]}</span>
							</div>

							{/* {truck.description && (
								<div className=" grid grid-cols-3  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Описание:</span>
									<span className=' col-span-2'>{truck.description}</span>
								</div>
							)} */}

							{user?.isRegistered ? (
								truck.description && (
									<div className=" grid grid-cols-3  items-center gap-2">
										<span className=' text-muted-foreground col-span-1'>Описание:</span>
										<span className=' col-span-2'>{truck.description}</span>
									</div>
								)
							) : null}
						</div>
					</div>
				</div>

				<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">
					<span className=' flex items-center gap-1'>
						<ArrowBigUp size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Обновлено:</span>
							<span className=' font-medium'>{truck.updatedAt && formatRelativeDate(truck.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{truck.createdAt && formatRelativeDate(truck.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{truck.views?.count}</span>
						</span>
					</span>
				</div>

				<div className=" flex items-center justify-between">
					<div>
						{(truck.drive || truck.exist || truck.status || truck.mileage || truck.weight || truck.volumeEngine || truck.powerEngine || truck.typeEngine || truck.steering || truck.transmission || truck.truckWheel || truck.drive) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>

									<div className=" flex flex-col text-sm gap-1 md:gap-3">
										{truck.drive && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Привод:</span>
												<span className=' col-span-1'>{DriveEnum[truck.drive as unknown as keyof typeof DriveEnum]}</span>
											</div>
										)}

										{truck.exist && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Наличие:</span>
												<span className=' col-span-1'>{ExistEnum[truck.exist as unknown as keyof typeof ExistEnum]}</span>
											</div>
										)}

										{truck.status && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Состояние:</span>
												<span className=' col-span-1'>{StatusEnum[truck.status as unknown as keyof typeof StatusEnum]}</span>
											</div>
										)}

										{truck.mileage && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Пробег:</span>
												<span className=' col-span-1'>{`${truck.mileage.toLocaleString('ru-RU')} км`}</span>
											</div>
										)}

										{truck.weight && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Вес:</span>
												<span className=' col-span-1'>{`${truck.weight.toLocaleString('ru-RU')} т`}</span>
											</div>
										)}

										{truck.volumeEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Объем двигателя:</span>
												<span className=' col-span-1'>{`${truck.volumeEngine.toLocaleString('ru-RU')} м³`}</span>
											</div>
										)}

										{truck.powerEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Мощность двигателя:</span>
												<span className=' col-span-1'>{`${truck.powerEngine.toLocaleString('ru-RU')} л.с.`}</span>
											</div>
										)}

										{truck.typeEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип двигателя:</span>
												<span className=' col-span-1'>{TypeEngineEnum[truck.typeEngine as unknown as keyof typeof TypeEngineEnum]}</span>
											</div>
										)}

										{truck.steering && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Руль:</span>
												<span className=' col-span-1'>{SteeringEnum[truck.steering as unknown as keyof typeof SteeringEnum]}</span>
											</div>
										)}

										{truck.transmission && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Трансмиссия:</span>
												<span className=' col-span-1'>{TransmissionEnum[truck.transmission as unknown as keyof typeof TransmissionEnum]}</span>
											</div>
										)}


										{truck.truckWheel && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Колесная формула:</span>
												<span className=' col-span-1'>{TruckWheelEnum[truck.truckWheel as unknown as keyof typeof TruckWheelEnum]}</span>
											</div>
										)}

										{truck.drive && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип привода:</span>
												<span className=' col-span-1'>{DriveEnum[truck.drive as unknown as keyof typeof DriveEnum]}</span>
											</div>
										)}

									</div>

								</PopoverContent>
							</Popover>
						)}
					</div>

					<div>
						{(truck.userPhone && isContact) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='default'
										className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
										onClick={() => truck.id && handleAddView(truck.id)}
									>
										<span className=''>Показать контакты</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent align='end' className='p-5 break-words max-w-xs'>
									{!user?.isRegistered ? (
										<div className="grid gap-2 justify-start">
											<span >Доступ к контактам доступен по абонентской плате.</span>
											<Button
												className=' bg-(--dark-accent)'
												asChild
											>
												<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
											</Button>
										</div>
									) : (
										<div className="grid gap-2 justify-start">
											{truck.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${truck.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${truck.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{truck?.user?.whatsapp && (
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
											{truck?.user?.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${truck?.user?.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{truck?.user?.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${truck?.user?.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{truck?.user?.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${truck?.user?.telegram}`}
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



export default TruckSearchItem
