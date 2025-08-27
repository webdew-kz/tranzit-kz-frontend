"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import Loader from '@/shared/components/widgets/Loader'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { ArrowBigDown, ArrowBigUp, Check, ChevronDown, Copy, Eye, SquarePen, Trash, ZoomIn } from 'lucide-react'
import React, { memo, SetStateAction, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { activate, remove } from '../actions'
import { DriveEnum, ExistEnum, ITractor, StatusEnum, SteeringEnum, TransmissionEnum, TractorBrandEnum, TractorWheelEnum, TypeEngineEnum, TypeCabinEnum, CabinSuspensionEnum } from '@/shared/types/tractor.type'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'

interface MyTractorItemProps {
	tractorInitial: ITractor
	selected: boolean
	onToggle: () => void
	setTractors: (value: SetStateAction<ITractor[]>) => void

}

const MyTractorArchiveItem = memo(({ tractorInitial, selected, onToggle, setTractors }: MyTractorItemProps) => {

	const router = useRouter()

	const [tractor, setTractor] = useState<ITractor>(tractorInitial)

	const [pending, startTransition] = useTransition()

	const handleActivate = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activate({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setTractors(prev => prev.filter(tractor => tractor.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении тягача', {
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

				setTractors(prev => prev.filter(tractor => tractor.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации тягача', {
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
								id={tractor.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={tractor.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
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

				<div className=" flex flex-col md:flex-row md:items-center justify-between">
					<div className=" mb-5 md:mb-0">
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
												<span className=' text-muted-foreground col-span-1'>Вес:</span>
												<span className=' col-span-1'>{TypeCabinEnum[tractor.typeCabin as unknown as keyof typeof TypeCabinEnum]}</span>
											</div>
										)}

										{tractor.cabinSuspension && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Вес:</span>
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

					<div className=" flex gap-2 w-full lg:w-auto" >
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleActivate(tractor.id!)}
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
							onClick={() => handleRemove(tractor.id!)}
						>
							<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Удалить</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/tractor/edit/${tractor.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/tractor/copy/${tractor.id}`)}
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




export default MyTractorArchiveItem