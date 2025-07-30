import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { ArrowBigDown, ArrowBigUp, Check, ChevronDown, Copy, Eye, RefreshCcw, SquarePen, Trash, X, ZoomIn } from 'lucide-react'
import React, { memo, SetStateAction, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { ExistEnum, ITrailer, QtyAxisEnum, StatusEnum, TrailerBrandEnum, TypeBrakeEnum, TypeSuspensionEnum, TypeTechnicEnum, TypeTrailerEnum } from '@/shared/types/trailer.type'
import { activate, remove } from '../actions'

interface MyTrailerItemProps {
	trailerInitial: ITrailer
	selected: boolean
	onToggle: () => void
	setTrailers: (value: SetStateAction<ITrailer[]>) => void

}

const MyTrailerArchiveItem = memo(({ trailerInitial, selected, onToggle, setTrailers }: MyTrailerItemProps) => {

	const router = useRouter()

	const [trailer, setTrailer] = useState<ITrailer>(trailerInitial)

	const [pending, startTransition] = useTransition()

	const handleActivate = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activate({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setTrailers(prev => prev.filter(trailer => trailer.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении прицепа', {
					position: 'top-center',
				})
			}
		})
	}

	const handleRemove = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await remove(id)

				toast.success(res.message, {
					position: 'top-center',
				})

				setTrailers(prev => prev.filter(trailer => trailer.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации прицепа', {
					position: 'top-center',
				})
			}
		})
	}

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full md:items-center mb-3">
					<div className=" flex flex-col gap-1 lg:flex-row lg:gap-4">

					</div>
					<div>
						<div className="flex items-center gap-2">
							<Checkbox
								id={trailer.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={trailer.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
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

				<div className=" flex flex-col md:flex-row md:items-center justify-between">
					<div className=" mb-5 md:mb-0">
						{(trailer.exist || trailer.status || trailer.weight) && (
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

					<div className=" flex gap-2 w-full lg:w-auto" >
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleActivate(trailer.id!)}
							disabled={pending}
						>
							<Check
								size={16}
								className='stroke-background group-hover:stroke-(--dark-accent)'
							/>
							<span className='hidden lg:block'>Активировать</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleRemove(trailer.id!)}
						>
							<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Удалить</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/trailer/edit/${trailer.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/trailer/copy/${trailer.id}`)}
						>
							<Copy size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Копировать</span>
						</Button>
					</div >
				</div>

			</CardContent>
		</Card>
	)
})




export default MyTrailerArchiveItem