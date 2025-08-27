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
import { ExperienceTypeEnum, IVacancy, JobEnum, TypeJobEnum } from '@/shared/types/vacancy.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { addToWishlist, addView, removeFromWishlist } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { useUserStore } from '@/shared/store/useUserStore'

interface VacancySearchItemProps {
	vacancy: IVacancy
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
}

const VacancySearchItem = memo(({ vacancy, rates, loading, setWishlistLength, isContact = true, isWishBtn = true }: VacancySearchItemProps) => {
	const { user } = useUserStore()
	const [isWishlist, setIsWishlist] = useState(false)

	useEffect(() => {
		const current = getWishlist();
		if (current.includes(vacancy.id!)) {
			setIsWishlist(true);
		}
	}, [])

	const handleAddView = async (id: string) => {
		const viewedKey = `viewed-${id}`;
		if (localStorage.getItem(viewedKey)) return;

		await addView(id);
		localStorage.setItem(viewedKey, "true");
	};


	const handleToggleWishlist = async () => {
		if (isWishlist) {
			const res = await removeFromWishlist(vacancy.id!);
			const current = getWishlist().filter((id) => id !== vacancy.id!);
			localStorage.setItem("wishlistVacancy", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistVacancy") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			const res = await addToWishlist(vacancy.id!);
			const current = getWishlist();
			if (!current.includes(vacancy.id!)) {
				localStorage.setItem("wishlistVacancy", JSON.stringify([...current, vacancy.id!]));
			}
			const stored = JSON.parse(localStorage.getItem("wishlistVacancy") || "[]");
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
		const data = localStorage.getItem("wishlistVacancy");
		return data ? JSON.parse(data) : [];
	}

	function isInWishlist(vacancyId: string): boolean {
		return getWishlist().includes(vacancyId);
	}

	// const route = places.map((place) => {
	// 	const [city, country] = place.split(",").map((str) => str.trim());
	// 	return `${city} ${getCountryCode(country) ? `(${getCountryCode(country)})` : ''}`;
	// }).join(" → ");
	// console.log(route);

	// const truckTypes = vacancy.truckType?.map((item) => TruckTypeEnum[item as unknown as keyof typeof TruckTypeEnum]).join(", ");

	const message = `Здравствуйте. Данная заявка актуальна?\n\nВакансия: ${vacancy.otherJob ? vacancy.otherJob : vacancy.job}\nГород: ${vacancy.city}\nЗ/П: ${vacancy.salary_at} - ${vacancy.salary_to} \n\nСсылка на вакансию: https://${process.env.DOMAIN}/dashboard/vacancy/${vacancy.id}`
	const link = `https://wa.me/${vacancy.userPhone}?text=${encodeURIComponent(message)}`


	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full items-start lg:items-center mb-2">
					<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">

					</div>
					<div className=" flex items-center">
						{isWishBtn && isInWishlist(vacancy.id!) ? (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} fill='#b4802e' />
								{/* <span>Из избранного</span> */}
							</button>
						) : isWishBtn && (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} />
								{/* <span>В избранное</span> */}
							</button>
						)}
					</div>
				</div>


				<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3">
					<div className=" w-full flex gap-2 flex-wrap">
						<span className="font-medium leading-none uppercase">
							{vacancy.otherJob ? vacancy.otherJob : JobEnum[vacancy.job as unknown as keyof typeof JobEnum]}
						</span>
					</div>
				</div>

				<div className=" flex flex-col lg:flex-row gap-2 w-full lg:justify-between lg:items-center mb-3">

					<div className=" grid gap-2 lg:gap-4">

						<div className="flex items-center gap-2">
							<span>Тип занятости:</span>
							<span className="block">
								{vacancy.typeJob
									?.map((item) => TypeJobEnum[item as unknown as keyof typeof TypeJobEnum])
									.join(', ')}
							</span>
						</div>


						<div className=" flex items-center gap-2">
							<span>Город:</span>
							<span className='  block'>{vacancy.city}</span>
						</div>
					</div>
				</div>

				<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">
					<span className=' flex items-center gap-1'>
						<ArrowBigUp size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Обновлено:</span>
							<span className=' font-medium'>{vacancy.updatedAt && formatRelativeDate(vacancy.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{vacancy.createdAt && formatRelativeDate(vacancy.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-sm'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{vacancy.views.count}</span>
						</span>
					</span>
				</div>

				<div className=" flex items-start justify-between w-full">
					<div>
						{(vacancy.description || vacancy.work_schedule_at || vacancy.work_schedule_to || vacancy.salary_at || vacancy.salary_to || (vacancy.experience_type && vacancy.experience_type.length > 0)) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] lg:max-w-[calc(30vw-3.85rem)] bg-accent'>



									{vacancy.description && (
										<div>
											<div className=" font-medium text-(--dark-accent)">Требования</div>
											<span className=" font-light text-sm">{vacancy.description}</span>

										</div>
									)}

									{(vacancy.work_schedule_at && vacancy.work_schedule_to) && (
										<div>
											<div className=" font-medium text-(--dark-accent)">График работы</div>
											<span className=" font-light text-sm">{`c ${vacancy.work_schedule_at} до ${vacancy.work_schedule_to}`}</span>
										</div>
									)}

									{(vacancy.salary_at || vacancy.salary_to) && (
										<div>
											<div className=" font-medium text-(--dark-accent)">Заработная плата</div>


											<span className="font-light text-sm">
												{vacancy.salary_at && vacancy.salary_to
													? `${vacancy.salary_at} - ${vacancy.salary_to}`
													: vacancy.salary_at
														? `от ${vacancy.salary_at}`
														: `до ${vacancy.salary_to}`}
											</span>
										</div>
									)}

									{vacancy.experience_type && vacancy.experience_type.length > 0 && (
										<div>
											<div className=" font-medium text-(--dark-accent)">Опыт работы</div>
											<span className=" font-light text-sm">
												{vacancy.experience_type.map((item) => ExperienceTypeEnum[item as unknown as keyof typeof ExperienceTypeEnum].toLowerCase()).join(", ")}
											</span>
										</div>
									)}

								</PopoverContent>
							</Popover>
						)}
					</div>
					<div>
						{(vacancy.userPhone && isContact) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='default'
										className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'
										onClick={() => vacancy.id && handleAddView(vacancy.id)}
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
											{vacancy.userPhone && (
												<Button variant='link' asChild>
													<Link
														href={`tel:+${vacancy.userPhone}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Phone size={16} />
														<span>{`+${vacancy.userPhone}`}</span>
													</Link>
												</Button>
											)}
											{vacancy.user.whatsapp && (
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
											{vacancy?.user?.viber && (
												<Button variant='link' asChild>
													<Link
														href={`viber://chat?number=%2B${vacancy?.user?.viber}`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
														<span>Viber</span>
													</Link>
												</Button>
											)}
											{vacancy?.user?.skype && (
												<Button variant='link' asChild>
													<Link
														href={`skype:live.${vacancy?.user?.skype}?chat`}
														target='_blank'
														rel="noopener noreferrer"
														className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
													>
														<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
														<span>Skype</span>
													</Link>
												</Button>
											)}
											{vacancy?.user?.telegram && (
												<Button variant='link' asChild>
													<Link
														href={`https://t.me/${vacancy?.user?.telegram}`}
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


export default VacancySearchItem