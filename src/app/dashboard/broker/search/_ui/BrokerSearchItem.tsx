"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { BrokerServiceEnum, IBroker } from '@/shared/types/broker.type'
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowDownUp, ArrowUp, BanknoteArrowUp, Box, CalendarDays, Check, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, Share, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { addToWishlist, addView, removeFromWishlist } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { useUserStore } from '@/shared/store/useUserStore'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'

interface BrokerSearchItemProps {
	broker: IBroker
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
	isRegistered?: boolean
}

const BrokerSearchItem = memo(({ broker, rates, loading, setWishlistLength, isContact = true, isWishBtn = true, isRegistered }: BrokerSearchItemProps) => {


	const { user } = useUserStore()
	const [places, setPlaces] = useState<string[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [isWishlist, setIsWishlist] = useState(false)

	useEffect(() => {
		const current = getWishlist();
		if (current.includes(broker.id!)) {
			setIsWishlist(true);
		}
	}, [])

	useEffect(() => {
		setPlaces([...broker.brokerService]);
	}, [broker.brokerService]);

	const handleAddView = async (id: string) => {
		const viewedKey = `viewed-${id}`;
		if (localStorage.getItem(viewedKey)) return;

		await addView(id);
		localStorage.setItem(viewedKey, "true");
	};


	const handleToggleWishlist = async () => {
		if (isWishlist) {
			const res = await removeFromWishlist(broker.id!);
			const current = getWishlist().filter((id) => id !== broker.id!);
			localStorage.setItem("wishlistBroker", JSON.stringify(current));
			const stored = JSON.parse(localStorage.getItem("wishlistBroker") || "[]");
			if (setWishlistLength) {
				setWishlistLength(stored.length);
			}
			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			const res = await addToWishlist(broker.id!);
			const current = getWishlist();
			if (!current.includes(broker.id!)) {
				localStorage.setItem("wishlistBroker", JSON.stringify([...current, broker.id!]));
			}
			const stored = JSON.parse(localStorage.getItem("wishlistBroker") || "[]");
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
		const data = localStorage.getItem("wishlistBroker");
		return data ? JSON.parse(data) : [];
	}

	function isInWishlist(brokerId: string): boolean {
		return getWishlist().includes(brokerId);
	}

	const message = `Здравствуйте. Данное услугу актуально?\n\nОписание: ${broker.note}\n\nСсылка на услугу: https://${process.env.DOMAIN}/dashboard/broker/${broker.id}`
	const link = `https://wa.me/${broker.userPhone}?text=${encodeURIComponent(message)}`

	const wamsg = `https://${process.env.DOMAIN}/dashboard/broker/${broker.id}`


	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	if (user?.isBlocked) return null

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full items-center mb-2">
					<div>
					</div>
					<div className=" flex items-center">
						{isWishBtn && isInWishlist(broker.id!) ? (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} fill='#b4802e' />
								<span>Из избранного</span>
							</button>
						) : isWishBtn && (
							<button
								type='button'
								onClick={handleToggleWishlist}
								className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								<Star size={16} />
								<span>В избранное</span>
							</button>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<span>{broker.city}</span>
				</div>

				{broker.note && (
					<div className="flex items-center gap-2">
						<span>{broker.note}</span>
					</div>
				)}

				<Collapsible className='sm:hidden flex flex-col gap-2' open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger className='flex gap-2 items-center justify-center'>
						<span>{isOpen ? "Скрыть" : "Подробнее"}</span>
						{isOpen ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
					</CollapsibleTrigger>
					<CollapsibleContent className='flex flex-col justify-between gap-1'>

						<div className=" w-full flex flex-col md:flex-row gap-2 md:flex-wrap border-b border-(--dark-accent) mb-2 pb-2">
							{places.length > 0 && places.filter(p => p && p.trim() !== '').map((place, index) => (
								<div className="flex items-center gap-2 w-full text-xs" key={index}>
									<Check size={14} className=' shrink-0' />
									<span>{BrokerServiceEnum[place as unknown as keyof typeof BrokerServiceEnum]}</span>
								</div>
							))}
						</div>

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

						<div className="flex w-full gap-2">
							<div className='flex-1'></div>
							<div className='flex gap-1'>
								{(broker.userPhone && isContact) && (
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant='default'
												className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent) !px-2'
												onClick={() => {
													if (!user?.isRegistered || !broker?.id || !isRegistered) return;
													handleAddView(broker.id);
												}}
											>
												<span className=''>Показать контакты</span>
											</Button>
										</PopoverTrigger>
										<PopoverContent align='end' className='p-5 break-words max-w-xs'>
											{(!user?.isRegistered) ? (
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
													{broker.userPhone && (
														<Button variant='link' asChild>
															<Link
																href={`tel:+${broker.userPhone}`}
																target='_blank'
																rel="noopener noreferrer"
																className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
															>
																<Phone size={16} />
																<span>{`+${broker.userPhone}`}</span>
															</Link>
														</Button>
													)}
													{broker.userPhone && (
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
													{broker?.user?.viber && (
														<Button variant='link' asChild>
															<Link
																href={`viber://chat?number=%2B${broker?.user?.viber}`}
																target='_blank'
																rel="noopener noreferrer"
																className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
															>
																<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
																<span>Viber</span>
															</Link>
														</Button>
													)}
													{broker?.user?.skype && (
														<Button variant='link' asChild>
															<Link
																href={`skype:live.${broker?.user?.skype}?chat`}
																target='_blank'
																rel="noopener noreferrer"
																className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
															>
																<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
																<span>Skype</span>
															</Link>
														</Button>
													)}
													{broker?.user?.telegram && (
														<Button variant='link' asChild>
															<Link
																href={`https://t.me/${broker?.user?.telegram}`}
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
							{(user?.isRegistered) && (
								<Button
									variant='default'
									className='bg-(--dark-accent) '
									asChild
								>
									<Link
										href={`https://wa.me/?text=${wamsg}`}
										target="_blank"
										rel="noopener noreferrer"
										className='flex gap-3 items-center justify-start'
									>
										<Share stroke='#fff' />
									</Link>
								</Button>
							)}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</CardContent>
		</Card>
	)
})


export default BrokerSearchItem