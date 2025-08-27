"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { getCountryCode } from '@/shared/lib/getCountryCode'
import { checkEndDate, isEndedDate } from '@/shared/lib/isEndedDate'
import { cn } from '@/shared/lib/utils'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { addToWishlist, addView, getIsInWishlist, removeFromWishlist } from '../../search/actions'
import { convertFromKZT, convertToKZT, getCurrencySymbol } from '@/shared/lib/convertToKZT'
import { IParts, StatusEnum, PartsBrandEnum } from '@/shared/types/parts.type'
import Loader from '@/shared/components/widgets/Loader'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'

interface PartsSearchItemProps {
	partsInitial: IParts
	setPartss?: React.Dispatch<React.SetStateAction<IParts[]>>
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>;
}

const PartsWishItem = memo(
	({ partsInitial, rates, loading, setWishlistLength, setPartss }: PartsSearchItemProps) => {

		const [parts, setParts] = useState<IParts>(partsInitial)
		const [pending, startTransition] = useTransition()
		const [isWishlist, setIsWishlist] = useState(false)

		useEffect(() => {
			const fetchIsInWishlist = async () => {
				startTransition(async () => {
					if (!parts.id) return;

					const isInWishlist = await getIsInWishlist(parts?.id);

					setIsWishlist(isInWishlist);

					if (!isInWishlist) {
						const current = getWishlist().filter((id) => id !== parts.id!);
						localStorage.setItem("wishlistPartss", JSON.stringify(current));
						const stored = JSON.parse(localStorage.getItem("wishlistPartss") || "[]");
						if (setWishlistLength) {
							setWishlistLength(stored.length);
						}
					} else {
						const current = getWishlist();
						if (!current.includes(parts.id!)) {
							localStorage.setItem("wishlistPartss", JSON.stringify([...current, parts.id!]));
						}
						const stored = JSON.parse(localStorage.getItem("wishlistPartss") || "[]");
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


		const handleRemoveFromWishlist = async () => {
			const res = await removeFromWishlist(parts.id!);
			const current = getWishlist().filter((id) => id !== parts.id!);
			localStorage.setItem("wishlistPartss", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistPartss") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
			if (setPartss) {
				setPartss(prevPartss => prevPartss.filter(t => t.id !== parts.id));
			}

			setIsWishlist(!isWishlist);
		};


		function getWishlist(): string[] {
			if (typeof window === "undefined") return [];
			const data = localStorage.getItem("wishlistPartss")

			return data ? JSON.parse(data) : [];
		}

		const message = `Здравствуйте. Данная заявка актуальна?\n\Марка: ${parts.brand}\nЦена: ${parts.price} тенге\nНазвание: ${parts.title}\n\nСсылка на запчасти: https://${process.env.DOMAIN}/dashboard/trade/parts/${parts.id}`
		const link = `https://wa.me/${parts.userPhone}?text=${encodeURIComponent(message)}`


		if (pending) {
			return <Loader />
		}

		if (!parts?.id) return null;

		return (
			<Card className='p-0 border-1 border-(--dark-accent)'>
				<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>

					<div className=" flex justify-between w-full md:items-center mb-3">
						<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4">

						</div>
						<div className=" flex">
							<button type='button' onClick={handleRemoveFromWishlist} className="flex gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={24} fill='#b4802e' />
								{/* <span>Из избранного</span> */}
							</button>
						</div>
					</div>

					<div className=" grid md:grid-cols-3 gap-3 md:gap-5  mb-3">
						<div className=" aspect-4/3 relative rounded-lg overflow-hidden">
							{parts.photos && parts.photos.length > 0 ? (
								<>
									<Dialog>
										<DialogTrigger className=' relative w-full aspect-4/3	'>
											<img
												src={`${process.env.SERVER_URL}${parts.photos[0]}`}
												alt={parts.photos[0]}
												className="absolute inset-0 w-full h-full object-cover z-0 opacity-[50%]"
											/>
											<span className=' w-[36px] h-[36px] rounded-md absolute left-[50%] top-[50%] translate-[-50%] bg-(--dark-accent) flex justify-center items-center'  >
												<ZoomIn size={16} className='stroke-accent z-10' />
											</span>
										</DialogTrigger>
										<DialogContent className="overflow-y-auto max-h-[100vh] pt-12">
											<DialogTitle className="sr-only">Фотографии запчасти</DialogTitle>
											<div className="grid gap-1">
												{parts.photos.map((photo, index) => (
													<img
														key={index}
														src={`${process.env.SERVER_URL}${photo}`}
														alt={`Parts photo ${index + 1}`}
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

								<div className=" grid grid-cols-3  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Название:</span>
									<span className=' col-span-2'>{parts.title}</span>
								</div>

								<div className=" grid grid-cols-3 items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Марка:</span>
									<span className=' col-span-2'>{PartsBrandEnum[parts.brand as unknown as keyof typeof PartsBrandEnum]}</span>
								</div>

								<div className=" grid grid-cols-3  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Цена:</span>
									<span className=' col-span-2'>{`${parts.price.toLocaleString('ru-RU')} ₸`}</span>
								</div>

								<div className=" grid grid-cols-3  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Город:</span>
									<span className=' col-span-2'>{parts.city}</span>
								</div>

								{parts.description && (
									<div className=" grid grid-cols-3  items-center gap-2">
										<span className=' text-muted-foreground col-span-1'>Описание:</span>
										<span className=' col-span-2'>{parts.description}</span>
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
								<span className=' font-medium'>{parts.updatedAt && formatRelativeDate(parts.updatedAt)}</span>
							</span>
						</span>

						<span className=' flex items-center gap-1'>
							<ArrowBigDown size={16} />
							<span className='truncate block text-[12px]'>
								<span className=' mr-2 font-light'>Добавлено:</span>
								<span className=' font-medium'>{parts.createdAt && formatRelativeDate(parts.createdAt)}</span>
							</span>
						</span>

						<span className=' flex items-center gap-1'>
							<Eye size={16} />
							<span className='truncate block text-[12px]'>
								<span className=' mr-2 font-light'>Просмотров:</span>
								<span className=' font-medium'>{parts.views?.count}</span>
							</span>
						</span>
					</div>

					<div className=" flex items-center justify-between">
						<div>
							{(parts.isDelivery || parts.status) && (
								<Popover>
									<PopoverTrigger asChild>
										<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
											Дополнительно
											<ChevronDown size={16} />
										</Button>
									</PopoverTrigger>
									<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>

										<div className=" flex flex-col text-sm gap-1 md:gap-3">
											{parts.isDelivery && (
												<div className=" grid grid-cols-2 items-center gap-2">
													<span className=' text-muted-foreground col-span-1'>Доставка:</span>
													<span className=' col-span-1'>{parts.isDelivery ? 'Есть' : 'Нет'}</span>
												</div>
											)}

											{parts.status && (
												<div className=" grid grid-cols-2 items-center gap-2">
													<span className=' text-muted-foreground col-span-1'>Состояние:</span>
													<span className=' col-span-1'>{StatusEnum[parts.status as unknown as keyof typeof StatusEnum]}</span>
												</div>
											)}

										</div>

									</PopoverContent>
								</Popover>
							)}
						</div>

						<div>
							{(parts.userPhone) && (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant='default'
											className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
											onClick={() => parts.id && handleAddView(parts.id)}
										>
											<span className=''>Показать контакты</span>
										</Button>
									</PopoverTrigger>
									<PopoverContent align='end' className='p-5 break-words max-w-xs'>
										<div className="grid gap-2 justify-start">
											{parts.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${parts.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${parts.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{parts?.user?.whatsapp && (
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
											{parts?.user?.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${parts?.user?.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{parts?.user?.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${parts?.user?.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{parts?.user?.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${parts?.user?.telegram}`}
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


export default PartsWishItem
