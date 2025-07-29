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
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, Phone, RefreshCcw, SquarePen, Star, Trash, Truck, User, Wallet, Weight, X } from 'lucide-react'
import React, { memo, SetStateAction, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { IReview } from '@/shared/types/review.type'
import { remove } from '../actions'
import Link from 'next/link'

interface MyReviewItemProps {
	reviewInitial: IReview
	selected: boolean
	onToggle: () => void
	setReviews: (value: SetStateAction<IReview[]>) => void
	rates?: any
	loading?: boolean
}

const MyReviewItem = memo(({ reviewInitial, selected, onToggle, setReviews, rates, loading }: MyReviewItemProps) => {

	const router = useRouter()

	const [review, setReview] = useState<IReview>(reviewInitial)

	const [pending, startTransition] = useTransition()

	// const handleActivateReview = async (id: string) => {

	// 	startTransition(async () => {

	// 		try {
	// 			const res = await activateReview({ id })

	// 			toast.success(res.message, {
	// 				position: 'top-center',
	// 			})

	// 			setReview((prev) => ({
	// 				...prev,
	// 				...res.updatedReview,
	// 			}))

	// 			window.location.reload()

	// 		} catch (error) {
	// 			console.error(error)
	// 			toast.error('Ошибка при обновлении вакансии', {
	// 				position: 'top-center',
	// 			})
	// 		}
	// 	})
	// }

	// const handleArchivateReview = async (id: string) => {

	// 	startTransition(async () => {

	// 		try {
	// 			const res = await archivateReview({ id })

	// 			toast.success(res.message, {
	// 				position: 'top-center',
	// 			})

	// 			setReviews(prev => prev.filter(review => review.id !== id))

	// 		} catch (error) {
	// 			console.error(error)
	// 			toast.error('Ошибка при архивации вакансии', {
	// 				position: 'top-center',
	// 			})
	// 		}
	// 	})
	// }

	const handleRemove = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await remove(id)

				toast.success(res.message, {
					position: 'top-center',
				})

				setReviews(prev => prev.filter(review => review.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации вакансии', {
					position: 'top-center',
				})
			}
		})
	}

	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex flex-col lg:flex-row justify-between w-full lg:items-center mb-2">

					<div className=" flex flex-col order-2 lg:order-1 gap-1 lg:flex-row lg:gap-4 mb-3">

						<span className=' flex items-center gap-1'>
							<ArrowBigDown size={16} />
							<span className='truncate block text-sm'>
								<span className=' mr-2 font-light'>Добавлено:</span>
								<span className=' font-medium'>{review.createdAt && formatRelativeDate(review.createdAt)}</span>
							</span>
						</span>
					</div>

					<div className=" flex items-center order-1 lg:order-2 gap-4 justify-end">
						<div className="flex items-center gap-2">
							<Checkbox
								id={review.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={review.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
					</div>
				</div>

				{(review.adminComment && review.adminComment.length) ? (
					<>
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

						<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3">
							<div className=" w-full flex gap-2 flex-wrap">
								<span className="font-medium leading-none uppercase">
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

						<div className=" flex flex-col gap-3 items-start lg:flex-row justify-between w-full">
							<div>

							</div>
							<div className=" flex justify-end gap-2 w-full lg:w-auto">
								<Button
									variant='outline'
									className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
									onClick={() => handleRemove(review.id!)}
								>
									<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
									<span className=' hidden lg:block'>Удалить</span>
								</Button>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3">
							<div className=" w-full flex gap-2 flex-wrap">
								<span className="font-medium leading-none uppercase">
									ИИН/БИН: {review.iin}
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

						<div className=" flex flex-col gap-3 items-start lg:flex-row justify-between w-full">
							<div>

							</div>
							<div className=" flex justify-end gap-2 w-full lg:w-auto">
								<Button
									variant='outline'
									className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
									onClick={() => handleRemove(review.id!)}
								>
									<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
									<span className=' hidden lg:block'>Удалить</span>
								</Button>
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	)
})

export default MyReviewItem