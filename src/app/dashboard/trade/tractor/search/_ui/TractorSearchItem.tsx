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
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Tractor, Wallet, Weight, X, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { addToWishlist, addView, getIsInWishlist, getWishlistByUserId, removeFromWishlist } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { DriveEnum, ExistEnum, ITractor, StatusEnum, SteeringEnum, TransmissionEnum, TractorBrandEnum, TractorWheelEnum, TypeEngineEnum, TypeCabinEnum, CabinSuspensionEnum } from '@/shared/types/tractor.type'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import Loader from '@/shared/components/widgets/Loader'
import { useUserStore } from '@/shared/store/useUserStore'

interface TractorSearchItemProps {
	tractorInitial: ITractor
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
}

const TractorSearchItem = memo(({ tractorInitial, rates, loading, setWishlistLength, isContact = true, isWishBtn = true }: TractorSearchItemProps) => {


	const { user } = useUserStore()
	const [tractor, setTractor] = useState<ITractor>(tractorInitial)
	const [pending, startTransition] = useTransition()
	const [isWishlist, setIsWishlist] = useState(false)

	useEffect(() => {
		const fetchIsInWishlist = async () => {
			startTransition(async () => {
				if (!tractor.id) return;

				const isInWishlist = await getIsInWishlist(tractor?.id);

				console.log(`Tractor ID: ${tractor.id}, Is in wishlist: ${isInWishlist}`);


				setIsWishlist(isInWishlist);

				if (!isInWishlist) {
					const current = getWishlist().filter((id) => id !== tractor.id!);
					localStorage.setItem("wishlistTractors", JSON.stringify(current));
					const stored = JSON.parse(localStorage.getItem("wishlistTractors") || "[]");
					if (setWishlistLength) {
						setWishlistLength(stored.length);
					}
				} else {
					const current = getWishlist();
					if (!current.includes(tractor.id!)) {
						localStorage.setItem("wishlistTractors", JSON.stringify([...current, tractor.id!]));
					}
					const stored = JSON.parse(localStorage.getItem("wishlistTractors") || "[]");
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
			const res = await removeFromWishlist(tractor.id!);
			const current = getWishlist().filter((id) => id !== tractor.id!);
			localStorage.setItem("wishlistTractors", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistTractors") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			const res = await addToWishlist(tractor.id!);
			const current = getWishlist();
			if (!current.includes(tractor.id!)) {
				localStorage.setItem("wishlistTractors", JSON.stringify([...current, tractor.id!]));
			}
			const stored = JSON.parse(localStorage.getItem("wishlistTractors") || "[]");
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
		const data = localStorage.getItem("wishlistTractors")

		return data ? JSON.parse(data) : [];
	}

	const message = `Здравствуйте. Данная заявка актуальна?\n\Марка: ${tractor.tractorBrand}\nЦена: ${tractor.price} тенге\nГод: ${tractor.year}\n\nСсылка на тягач: https://${process.env.DOMAIN}/dashboard/trade/tractor/${tractor.id}`
	const link = `https://wa.me/${tractor.userPhone}?text=${encodeURIComponent(message)}`


	if (pending || !user) {
		return <Loader />
	}


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
						{tractor.photos && tractor.photos.length > 0 ? (
							<>
								<Dialog>
									<DialogTrigger className=' relative w-full aspect-4/3	'>
										<img
											src={`${process.env.SERVER_URL}${tractor.photos[0]}`}
											alt={tractor.photos[0]}
											className="absolute inset-0 w-full h-full object-cover z-0 opacity-[50%]"
										/>
										<span className=' w-[36px] h-[36px] rounded-md absolute left-[50%] top-[50%] translate-[-50%] bg-(--dark-accent) flex justify-center items-center'  >
											<ZoomIn size={16} className='stroke-accent z-10' />
										</span>
									</DialogTrigger>
									<DialogContent className="overflow-y-auto max-h-[100vh] pt-12">
										<DialogTitle className="sr-only">Фотографии тягача</DialogTitle>
										<div className="grid gap-1">
											{tractor.photos.map((photo, index) => (
												<img
													key={index}
													src={`${process.env.SERVER_URL}${photo}`}
													alt={`Tractor photo ${index + 1}`}
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
								<span className=' col-span-2'>{TractorBrandEnum[tractor.tractorBrand as unknown as keyof typeof TractorBrandEnum]}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Цена:</span>
								<span className=' col-span-2'>{`${tractor.price.toLocaleString('ru-RU')} ₸`}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Год:</span>
								<span className=' col-span-2'>{tractor.year}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Город:</span>
								<span className=' col-span-2'>{tractor.city}</span>
							</div>

							{tractor.description && (
								<div className=" grid grid-cols-3  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Описание:</span>
									<span className=' col-span-2'>{tractor.description}</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">
					<span className=' flex items-center gap-1'>
						<ArrowBigUp size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Обновлено:</span>
							<span className=' font-medium'>{tractor.updatedAt && formatRelativeDate(tractor.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{tractor.createdAt && formatRelativeDate(tractor.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{tractor.views?.count}</span>
						</span>
					</span>
				</div>

				<div className=" flex items-center justify-between">
					<div>
						{(tractor.drive || tractor.exist || tractor.status || tractor.mileage || tractor.volumeEngine || tractor.powerEngine || tractor.typeEngine || tractor.steering || tractor.transmission || tractor.tractorWheel || tractor.drive || tractor.cabinSuspension || tractor.typeCabin) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>

									<div className=" flex flex-col text-sm gap-1 md:gap-3">

										{tractor.typeCabin && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип кабины:</span>
												<span className=' col-span-1'>{TypeCabinEnum[tractor.typeCabin as unknown as keyof typeof TypeCabinEnum]}</span>
											</div>
										)}

										{tractor.cabinSuspension && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Подвеска кабины:</span>
												<span className=' col-span-1'>{CabinSuspensionEnum[tractor.cabinSuspension as unknown as keyof typeof CabinSuspensionEnum]}</span>
											</div>
										)}

										{tractor.drive && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Привод:</span>
												<span className=' col-span-1'>{DriveEnum[tractor.drive as unknown as keyof typeof DriveEnum]}</span>
											</div>
										)}

										{tractor.exist && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Наличие:</span>
												<span className=' col-span-1'>{ExistEnum[tractor.exist as unknown as keyof typeof ExistEnum]}</span>
											</div>
										)}

										{tractor.status && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Состояние:</span>
												<span className=' col-span-1'>{StatusEnum[tractor.status as unknown as keyof typeof StatusEnum]}</span>
											</div>
										)}

										{tractor.mileage && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Пробег:</span>
												<span className=' col-span-1'>{`${tractor.mileage.toLocaleString('ru-RU')} км`}</span>
											</div>
										)}

										{tractor.volumeEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Объем двигателя:</span>
												<span className=' col-span-1'>{`${tractor.volumeEngine.toLocaleString('ru-RU')} м³`}</span>
											</div>
										)}

										{tractor.powerEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Мощность двигателя:</span>
												<span className=' col-span-1'>{`${tractor.powerEngine.toLocaleString('ru-RU')} л.с.`}</span>
											</div>
										)}

										{tractor.typeEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип двигателя:</span>
												<span className=' col-span-1'>{TypeEngineEnum[tractor.typeEngine as unknown as keyof typeof TypeEngineEnum]}</span>
											</div>
										)}

										{tractor.steering && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Руль:</span>
												<span className=' col-span-1'>{SteeringEnum[tractor.steering as unknown as keyof typeof SteeringEnum]}</span>
											</div>
										)}

										{tractor.transmission && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Трансмиссия:</span>
												<span className=' col-span-1'>{TransmissionEnum[tractor.transmission as unknown as keyof typeof TransmissionEnum]}</span>
											</div>
										)}


										{tractor.tractorWheel && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Колесная формула:</span>
												<span className=' col-span-1'>{TractorWheelEnum[tractor.tractorWheel as unknown as keyof typeof TractorWheelEnum]}</span>
											</div>
										)}

										{tractor.drive && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип привода:</span>
												<span className=' col-span-1'>{DriveEnum[tractor.drive as unknown as keyof typeof DriveEnum]}</span>
											</div>
										)}

									</div>

								</PopoverContent>
							</Popover>
						)}
					</div>

					<div>
						{(tractor.userPhone && isContact) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='default'
										className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
										onClick={() => tractor.id && handleAddView(tractor.id)}
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
											{tractor.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${tractor.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${tractor.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{tractor?.user?.whatsapp && (
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
											{tractor?.user?.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${tractor?.user?.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{tractor?.user?.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${tractor?.user?.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{tractor?.user?.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${tractor?.user?.telegram}`}
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



export default TractorSearchItem
