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
// import { ExperienceTypeEnum, IReview, JobEnum, TypeJobEnum } from '@/shared/types/review.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, LockKeyhole, LockKeyholeOpen, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, ShieldCheck, ShieldOff, SquarePen, Star, Truck, Wallet, Weight, X } from 'lucide-react'
import Image from 'next/image'
import React, { memo, useEffect, useState, useTransition } from 'react'
import { lock, removeReview, unlock } from '../actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { IReview } from '@/shared/types/review.type'
import { useUserStore } from '@/shared/store/useUserStore'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRouter } from 'next/navigation'
import useCloudPayments from '@/shared/hooks/useCloudPayments'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface ReviewSearchItemProps {
	review: IReview
	setSearchReviews: (reviews: IReview[] | ((prev: IReview[]) => IReview[])) => void;
	rates?: any
	loading?: boolean
	setWishlistLength?: React.Dispatch<React.SetStateAction<number>>
	isContact?: boolean
	isWishBtn?: boolean
}

const ReviewSearchItem = memo(({ review, setSearchReviews, rates, loading, setWishlistLength, isContact = true, isWishBtn = true }: ReviewSearchItemProps) => {

	const [isWishlist, setIsWishlist] = useState(false)

	const [adminComment, setAdminComment] = useState('')

	const [open, setOpen] = useState(false);

	const price = 5000;

	const router = useRouter()

	useCloudPayments()

	const paymentPublicId = 'pk_9cba1fd1be39c1e60da521409a1c9'

	const { user } = useUserStore()

	const [pending, startTransition] = useTransition()

	const paymentSchema = z.object({
		amount: z.number().min(price),
		reviewId: z.string()
	});


	type IPayment = z.infer<typeof paymentSchema>

	const form = useForm({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			amount: price,
			reviewId: review.id!
		},
	})

	const onSubmit = async (data: IPayment) => {

		startTransition(async () => {

			try {

				if (typeof window !== "undefined" && "tiptop" in window) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const widget = new (window as any).tiptop.Widget(); // <--- Кастомный тип `any`
					widget.pay('charge',
						{
							publicId: paymentPublicId,
							description: 'Удаление отзыва/жалобы на itranzit.kz',
							amount: data.amount,
							currency: 'KZT',
							skin: "modern",
							autoClose: 3,
							data: { myProp: 'myProp value' }
						},
						{
							onSuccess: async function () {
								const res = await removeReview(data.reviewId, data.amount)

								toast.success(res.message, {
									position: 'top-center',
								})

								// Дать время Next.js на переход
								router.refresh()
							},
							onFail: function () {
								toast.error('Ошибка платежа', {
									position: 'top-center',
								})
							},
						}
					);
				} else {
					throw new Error("CloudPayments SDK не загружен");
				}

			} catch (error) {
				console.error(error)
				toast.error('Ошибка платежа', {
					position: 'top-center',
				})
			}
		})

	}

	const onError = (errors: any) => {
		toast.error(errors.message ?? `Минимум ${price} ₸`, {
			position: 'top-center',
		})
		console.error(errors);

	};

	const handleToggleBlock = async (reviewId: string) => {
		if (review.isBlocked) {
			const res = await unlock(reviewId);

			setSearchReviews((prev: IReview[]) =>
				prev.map((r) => r.id === reviewId ? { ...r, isBlocked: false, adminComment: '' } : r)
			);

			setAdminComment('')

			toast.success(res.message, {
				position: "top-center",
			});
		} else {
			setOpen(true)
		}

		setIsWishlist(!isWishlist);
	};

	const handleSubmit = async (reviewId: string) => {
		const res = await lock(reviewId, adminComment);

		setSearchReviews((prev: IReview[]) =>
			prev.map((r) => r.id === reviewId ? { ...r, isBlocked: true, adminComment } : r)
		);

		setAdminComment('')

		toast.success(res.message, {
			position: "top-center",
		});
	};

	const link = `https://wa.me/${review.user?.phone}`


	if (loading || !review) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full items-start lg:items-center mb-2">
					<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4 mb-3">

						<span className=' flex items-center gap-1'>
							<ArrowBigDown size={16} />
							<span className='truncate block text-sm'>
								<span className=' mr-2 font-light'>Добавлено:</span>
								<span className=' font-medium'>{review.createdAt && formatRelativeDate(review.createdAt)}</span>
							</span>
						</span>
					</div>
					<div className=" flex items-center">
						{user?.role === 'ADMIN' && (
							<>
								<button
									type='button'
									onClick={() => {
										if (review.isBlocked) {
											handleToggleBlock(review.id!)
										} else {
											setOpen(true) // Открываем диалог только если ещё не заблокирован
										}
									}}
									className="flex items-center gap-1 cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4"
								>
									{review.isBlocked ? <LockKeyhole size={16} /> : <LockKeyholeOpen size={16} />}
								</button>

								{/* Диалог только для блокировки */}
								<Dialog open={open} onOpenChange={setOpen}>
									<DialogContent className="sm:max-w-md">
										<DialogHeader>
											<DialogTitle>Причина блокировки</DialogTitle>
										</DialogHeader>

										<Textarea
											value={adminComment}
											onChange={(e) => setAdminComment(e.target.value)}
											placeholder="Введите причину блокировки"
											rows={4}
											className="mt-2"
										/>

										<DialogFooter className="mt-4">
											<Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
											<Button
												onClick={async () => {
													await handleSubmit(review.id!)
													setOpen(false)
												}}
											>
												Заблокировать
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</>
						)}

					</div>
				</div>


				{(review.adminComment && review.adminComment.length) ? (
					<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3 text-(--dark-accent)">
						<div className=" w-full flex gap-2 flex-wrap">
							<span className="font-medium leading-none text-center uppercase">
								Отзыв заблокирован администратором
							</span>
						</div>
						<div className=" w-full flex gap-2 flex-wrap">
							<span className=" leading-none ">
								Причина блокировки: {review.adminComment}
							</span>
						</div>
					</div>
				) : (
					<>
						<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3">
							<div className=" w-full flex gap-2 flex-wrap">
								<span className="font-medium leading-none">
									Телефон или ИИН/БИН: {review.iin}
								</span>
							</div>
						</div>

						<div className=" flex flex-col lg:flex-row gap-2 w-full lg:justify-between lg:items-center mb-3">

							<div className=" grid gap-2 lg:gap-4">

								<div className="flex gap-2">
									<span>ФИО/Компания:</span>
									<span className="block">
										{review.title}
									</span>
								</div>

								<div className=" flex gap-2">
									<span>Отзыв:</span>
									<span className='block'>{review.description}</span>
								</div>

								<div className=" flex items-center gap-2">
									<span>Рейтинг:</span>
									<span className='flex items-center gap-1'>
										<Star size={16} fill='#b4802e' />
										{review.value}
									</span>
								</div>

								<div className=" flex gap-2">
									<span>Теги:</span>
									<span className="flex flex-wrap gap-2">
										{review.tags?.map((tag, index) => (
											<span key={index} className="p-2 border rounded-2xl text-xs">
												{tag}
											</span>
										))}
									</span>

								</div>
							</div>
						</div>

						<div className=" flex items-center justify-between w-full">
							<form
								onSubmit={form.handleSubmit(onSubmit, onError)}
							>
								<Button
									type='submit'
									variant='outline'
									className=' w-full sm:w-auto'
									disabled={pending}
								>
									Удалить за {price} ₸
								</Button>
							</form>
							<div>
								{(review.user?.phone || review.user?.whatsapp) && (
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant='default'
												className=' group border border-(--dark-accent) bg-(--dark-accent) hover:bg-transparent hover:text-(--dark-accent)'

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
													{review.user?.phone && (
														<Button variant='link' asChild>
															<Link
																href={`tel:+${review.user?.phone}`}
																target='_blank'
																rel="noopener noreferrer"
																className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
															>
																<Phone size={16} />
																<span>{`+${review.user?.phone}`}</span>
															</Link>
														</Button>
													)}
													{review.user?.phone && (
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
													{review?.user?.viber && (
														<Button variant='link' asChild>
															<Link
																href={`viber://chat?number=%2B${review?.user?.viber}`}
																target='_blank'
																rel="noopener noreferrer"
																className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
															>
																<Image src='/icons/viber.svg' alt='viber' width={18} height={18} />
																<span>Viber</span>
															</Link>
														</Button>
													)}
													{review?.user?.skype && (
														<Button variant='link' asChild>
															<Link
																href={`skype:live.${review?.user?.skype}?chat`}
																target='_blank'
																rel="noopener noreferrer"
																className=' text-sm text-muted-foreground flex gap-2 justify-start items-center !px-0'
															>
																<Image src='/icons/skype.svg' alt='skype' width={18} height={18} />
																<span>Skype</span>
															</Link>
														</Button>
													)}
													{review?.user?.telegram && (
														<Button variant='link' asChild>
															<Link
																href={`https://t.me/${review?.user?.telegram}`}
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
					</>
				)}
			</CardContent>
		</Card>
	)
})


export default ReviewSearchItem