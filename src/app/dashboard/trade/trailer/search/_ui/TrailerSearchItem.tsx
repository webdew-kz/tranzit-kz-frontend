"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { ArrowBigDown, ArrowBigUp, ChevronDown, Eye, Phone, Star, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { addToWishlist, addView, getIsInWishlist, removeFromWishlist } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { ExistEnum, ITrailer, StatusEnum, TrailerBrandEnum, TypeTrailerEnum, QtyAxisEnum, TypeSuspensionEnum, TypeBrakeEnum, TypeTechnicEnum } from '@/shared/types/trailer.type'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import Loader from '@/shared/components/widgets/Loader'
import { useUserStore } from '@/shared/store/useUserStore'

interface TrailerSearchItemProps {
	trailerInitial: ITrailer
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
}

const TrailerSearchItem = memo(({ trailerInitial, rates, loading, setWishlistLength, isContact = true, isWishBtn = true }: TrailerSearchItemProps) => {


	const { user } = useUserStore()
	const [trailer, setTrailer] = useState<ITrailer>(trailerInitial)
	const [pending, startTransition] = useTransition()
	const [isWishlist, setIsWishlist] = useState(false)

	useEffect(() => {
		const fetchIsInWishlist = async () => {
			startTransition(async () => {
				if (!trailer.id) return;

				const isInWishlist = await getIsInWishlist(trailer?.id);

				console.log(`Trailer ID: ${trailer.id}, Is in wishlist: ${isInWishlist}`);


				setIsWishlist(isInWishlist);

				if (!isInWishlist) {
					const current = getWishlist().filter((id) => id !== trailer.id!);
					localStorage.setItem("wishlistTrailers", JSON.stringify(current));
					const stored = JSON.parse(localStorage.getItem("wishlistTrailers") || "[]");
					if (setWishlistLength) {
						setWishlistLength(stored.length);
					}
				} else {
					const current = getWishlist();
					if (!current.includes(trailer.id!)) {
						localStorage.setItem("wishlistTrailers", JSON.stringify([...current, trailer.id!]));
					}
					const stored = JSON.parse(localStorage.getItem("wishlistTrailers") || "[]");
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
			const res = await removeFromWishlist(trailer.id!);
			const current = getWishlist().filter((id) => id !== trailer.id!);
			localStorage.setItem("wishlistTrailers", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistTrailers") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			const res = await addToWishlist(trailer.id!);
			const current = getWishlist();
			if (!current.includes(trailer.id!)) {
				localStorage.setItem("wishlistTrailers", JSON.stringify([...current, trailer.id!]));
			}
			const stored = JSON.parse(localStorage.getItem("wishlistTrailers") || "[]");
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
		const data = localStorage.getItem("wishlistTrailers")

		return data ? JSON.parse(data) : [];
	}

	const message = `Здравствуйте. Данная заявка актуальна?\n\Марка: ${trailer.trailerBrand}\nЦена: ${trailer.price} тенге\nГод: ${trailer.year}\n\nСсылка на прицеп: https://${process.env.DOMAIN}/dashboard/trade/trailer/${trailer.id}`
	const link = `https://wa.me/${trailer.userPhone}?text=${encodeURIComponent(message)}`


	if (pending) {
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
						{trailer.photos && trailer.photos.length > 0 ? (
							<>
								<Dialog>
									<DialogTrigger className=' relative w-full aspect-4/3	'>
										<img
											src={`${process.env.SERVER_URL}${trailer.photos[0]}`}
											alt={trailer.photos[0]}
											className="absolute inset-0 w-full h-full object-cover z-0 opacity-[50%]"
										/>
										<span className=' w-[36px] h-[36px] rounded-md absolute left-[50%] top-[50%] translate-[-50%] bg-(--dark-accent) flex justify-center items-center'  >
											<ZoomIn size={16} className='stroke-accent z-10' />
										</span>
									</DialogTrigger>
									<DialogContent className="overflow-y-auto max-h-[100vh] pt-12">
										<DialogTitle className="sr-only">Фотографии прицепа</DialogTitle>
										<div className="grid gap-1">
											{trailer.photos.map((photo, index) => (
												<img
													key={index}
													src={`${process.env.SERVER_URL}${photo}`}
													alt={`Trailer photo ${index + 1}`}
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
						<div className=" flex flex-col text-[16px] gap-1 md:gap-3">
							<div className=" grid grid-cols-2 items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Марка:</span>
								<span className=' col-span-1 truncate'>{TrailerBrandEnum[trailer.trailerBrand as unknown as keyof typeof TrailerBrandEnum]}</span>
							</div>

							<div className=" grid grid-cols-2  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Цена:</span>
								<span className=' col-span-1 truncate'>{`${trailer.price.toLocaleString('ru-RU')} ₸`}</span>
							</div>

							<div className=" grid grid-cols-2  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Год:</span>
								<span className=' col-span-1 truncate'>{trailer.year}</span>
							</div>

							<div className=" grid grid-cols-2  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Город:</span>
								<span className=' col-span-1 truncate'>{trailer.city}</span>
							</div>

							<div className=" grid grid-cols-2  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Тип техники:</span>
								<span className=' col-span-1 truncate'>{TypeTechnicEnum[trailer.typeTechnic as unknown as keyof typeof TypeTechnicEnum]}</span>
							</div>

							<div className=" grid grid-cols-2  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Тип прицепа:</span>
								<span className=' col-span-1 truncate'>{TypeTrailerEnum[trailer.typeTrailer as unknown as keyof typeof TypeTrailerEnum]}</span>
							</div>

							{trailer.description && (
								<div className=" grid grid-cols-2  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Описание:</span>
									<span className=' col-span-1 truncate'>{trailer.description}</span>
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
							<span className=' font-medium'>{trailer.updatedAt && formatRelativeDate(trailer.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{trailer.createdAt && formatRelativeDate(trailer.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{trailer.views?.count}</span>
						</span>
					</span>
				</div>

				<div className=" flex items-center justify-between">
					<div>
						{(trailer.exist || trailer.status || trailer.weight || trailer.qtyAxis || trailer.typeSuspension || trailer.typeBrake) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>

									<div className=" flex flex-col text-sm gap-1 md:gap-3">

										{trailer.exist && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Наличие:</span>
												<span className=' col-span-1'>{ExistEnum[trailer.exist as unknown as keyof typeof ExistEnum]}</span>
											</div>
										)}

										{trailer.status && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Состояние:</span>
												<span className=' col-span-1'>{StatusEnum[trailer.status as unknown as keyof typeof StatusEnum]}</span>
											</div>
										)}

										{trailer.weight && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Вес:</span>
												<span className=' col-span-1'>{`${trailer.weight.toLocaleString('ru-RU')} т`}</span>
											</div>
										)}

										{trailer.qtyAxis && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Кол-во осей:</span>
												<span className=' col-span-1'>{QtyAxisEnum[trailer.qtyAxis as unknown as keyof typeof QtyAxisEnum]}</span>
											</div>
										)}

										{trailer.typeSuspension && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип подвески:</span>
												<span className=' col-span-1'>{TypeSuspensionEnum[trailer.typeSuspension as unknown as keyof typeof TypeSuspensionEnum]}</span>
											</div>
										)}

										{trailer.typeBrake && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип тормозов:</span>
												<span className=' col-span-1'>{TypeBrakeEnum[trailer.typeBrake as unknown as keyof typeof TypeBrakeEnum]}</span>
											</div>
										)}

									</div>

								</PopoverContent>
							</Popover>
						)}
					</div>

					<div>
						{(trailer.userPhone && isContact) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='default'
										className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
										onClick={() => trailer.id && handleAddView(trailer.id)}
									>
										<span className=''>Показать контакты</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent align='end' className='p-5 w-auto'>

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
											{trailer.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${trailer.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${trailer.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{trailer?.user?.whatsapp && (
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
											{trailer?.user?.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${trailer?.user?.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{trailer?.user?.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${trailer?.user?.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{trailer?.user?.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${trailer?.user?.telegram}`}
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



export default TrailerSearchItem
