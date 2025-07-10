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
// import { AdditionallyEnum, CurrencyEnum, DocumentsEnum, IParts, LoadingsEnum, LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, PartsTypeEnum } from '@/shared/types/parts.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, EllipsisVertical, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, RefreshCcw, SquarePen, Truck, Wallet, Weight, X, ZoomIn } from 'lucide-react'
import React, { memo, SetStateAction, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { activate, archivate } from '../actions'
import { useRouter } from 'next/navigation'
import { IParts, StatusEnum, PartsBrandEnum } from '@/shared/types/parts.type'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
// import { CurrencyEnum } from '@/shared/types/parts.type'

interface MyPartsItemProps {
	partsInitial: IParts
	selected: boolean
	onToggle: () => void
	setPartss: (value: SetStateAction<IParts[]>) => void
	loading?: boolean
}

const MyPartsItem = memo(({ partsInitial, selected, onToggle, setPartss, loading }: MyPartsItemProps) => {

	const router = useRouter()

	const [parts, setParts] = useState<IParts>(partsInitial)

	const [pending, startTransition] = useTransition()

	const handleActivate = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activate({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setPartss((prev) => {
					const prevPartss = prev.filter(parts => parts.id !== id)

					return [res.parts, ...prevPartss]
				});

				setParts(res.parts)

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении объявления', {
					position: 'top-center',
				})
			}
		})
	}

	const handleArchivate = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await archivate({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setPartss(prev => prev.filter(parts => parts.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации объявления', {
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
				<div className=" flex justify-between w-full md:items-center mb-3">
					<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4">
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
					<div>
						<div className="flex items-center gap-2">
							<Checkbox
								id={parts.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={parts.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
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

				<div className=" flex flex-col md:flex-row md:items-center justify-between">
					<div className=" mb-5 md:mb-0">
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

					<div className=" flex gap-2 w-full lg:w-auto">
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleActivate(parts.id!)}
							disabled={pending}
						>
							<RefreshCcw
								size={16}
								className='stroke-background group-hover:stroke-(--dark-accent)'
							/>
							<span className='hidden lg:block'>Повторить</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleArchivate(parts.id!)}
							disabled={pending}
						>
							<X size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Снять</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/parts/edit/${parts.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>
						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/parts/copy/${parts.id}`)}
						>
							<Copy size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Копировать</span>
						</Button>
					</div>
				</div>

			</CardContent>
		</Card>
	)
})


export default MyPartsItem