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
import { DriveEnum, ExistEnum, ITruck, StatusEnum, SteeringEnum, TransmissionEnum, TruckBrandEnum, TruckWheelEnum, TypeEngineEnum, TypeTruckEnum } from '@/shared/types/truck.type'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'

interface MyTruckItemProps {
	truckInitial: ITruck
	selected: boolean
	onToggle: () => void
	setTrucks: (value: SetStateAction<ITruck[]>) => void

}

const MyTruckArchiveItem = memo(({ truckInitial, selected, onToggle, setTrucks }: MyTruckItemProps) => {

	const router = useRouter()

	const [truck, setTruck] = useState<ITruck>(truckInitial)

	const [pending, startTransition] = useTransition()

	const handleActivate = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activate({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setTrucks(prev => prev.filter(truck => truck.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении груза', {
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

				setTrucks(prev => prev.filter(truck => truck.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации груза', {
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
								id={truck.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={truck.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
					</div>
				</div>

				<div className=" grid md:grid-cols-3 gap-3 md:gap-5  mb-3">
					<div className=" aspect-4/3 relative rounded-lg overflow-hidden">
						{truck.photos && truck.photos.length > 0 ? (
							<>
								<Dialog>
									<DialogTrigger className=' relative w-full aspect-4/3	'>
										<img
											src={`${process.env.SERVER_URL}${truck.photos[0]}`}
											alt={truck.photos[0]}
											className="absolute inset-0 w-full h-full object-cover z-0 opacity-[50%]"
										/>
										<span className=' w-[36px] h-[36px] rounded-md absolute left-[50%] top-[50%] translate-[-50%] bg-(--dark-accent) flex justify-center items-center'  >
											<ZoomIn size={16} className='stroke-accent z-10' />
										</span>
									</DialogTrigger>
									<DialogContent className="overflow-y-auto max-h-[100vh] pt-12">
										<DialogTitle className="sr-only">Фотографии грузовика</DialogTitle>
										<div className="grid gap-1">
											{truck.photos.map((photo, index) => (
												<img
													key={index}
													src={`${process.env.SERVER_URL}${photo}`}
													alt={`Truck photo ${index + 1}`}
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
								<span className=' col-span-2'>{TruckBrandEnum[truck.truckBrand as unknown as keyof typeof TruckBrandEnum]}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Цена:</span>
								<span className=' col-span-2'>{`${truck.price.toLocaleString('ru-RU')} ₸`}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Год:</span>
								<span className=' col-span-2'>{truck.year}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Город:</span>
								<span className=' col-span-2'>{truck.city}</span>
							</div>

							<div className=" grid grid-cols-3  items-center gap-2">
								<span className=' text-muted-foreground col-span-1'>Тип кузова:</span>
								<span className=' col-span-2'>{TypeTruckEnum[truck.typeTruck as unknown as keyof typeof TypeTruckEnum]}</span>
							</div>

							{truck.description && (
								<div className=" grid grid-cols-3  items-center gap-2">
									<span className=' text-muted-foreground col-span-1'>Описание:</span>
									<span className=' col-span-2'>{truck.description}</span>
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
							<span className=' font-medium'>{truck.updatedAt && formatRelativeDate(truck.updatedAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<ArrowBigDown size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Добавлено:</span>
							<span className=' font-medium'>{truck.createdAt && formatRelativeDate(truck.createdAt)}</span>
						</span>
					</span>

					<span className=' flex items-center gap-1'>
						<Eye size={16} />
						<span className='truncate block text-[12px]'>
							<span className=' mr-2 font-light'>Просмотров:</span>
							<span className=' font-medium'>{truck.views?.count}</span>
						</span>
					</span>
				</div>

				<div className=" flex flex-col md:flex-row md:items-center justify-between">
					<div className=" mb-5 md:mb-0">
						{(truck.drive || truck.exist || truck.status || truck.mileage || truck.weight || truck.volumeEngine || truck.powerEngine || truck.typeEngine || truck.steering || truck.transmission || truck.truckWheel || truck.drive) && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='link' className=' text-sm underline text-(--dark-accent) !px-0'>
										Дополнительно
										<ChevronDown size={16} />
									</Button>
								</PopoverTrigger>
								<PopoverContent align='start' className=' max-h-[50vh] overflow-y-auto grid gap-3 w-full max-w-[calc(100vw-3.85rem)] bg-accent'>

									<div className=" flex flex-col text-sm gap-1 md:gap-3">
										{truck.drive && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Привод:</span>
												<span className=' col-span-1'>{DriveEnum[truck.drive as unknown as keyof typeof DriveEnum]}</span>
											</div>
										)}

										{truck.exist && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Наличие:</span>
												<span className=' col-span-1'>{ExistEnum[truck.exist as unknown as keyof typeof ExistEnum]}</span>
											</div>
										)}

										{truck.status && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Состояние:</span>
												<span className=' col-span-1'>{StatusEnum[truck.status as unknown as keyof typeof StatusEnum]}</span>
											</div>
										)}

										{truck.mileage && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Пробег:</span>
												<span className=' col-span-1'>{`${truck.mileage.toLocaleString('ru-RU')} км`}</span>
											</div>
										)}

										{truck.weight && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Вес:</span>
												<span className=' col-span-1'>{`${truck.weight.toLocaleString('ru-RU')} т`}</span>
											</div>
										)}

										{truck.volumeEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Объем двигателя:</span>
												<span className=' col-span-1'>{`${truck.volumeEngine.toLocaleString('ru-RU')} м³`}</span>
											</div>
										)}

										{truck.powerEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Мощность двигателя:</span>
												<span className=' col-span-1'>{`${truck.powerEngine.toLocaleString('ru-RU')} л.с.`}</span>
											</div>
										)}

										{truck.typeEngine && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип двигателя:</span>
												<span className=' col-span-1'>{TypeEngineEnum[truck.typeEngine as unknown as keyof typeof TypeEngineEnum]}</span>
											</div>
										)}

										{truck.steering && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Руль:</span>
												<span className=' col-span-1'>{SteeringEnum[truck.steering as unknown as keyof typeof SteeringEnum]}</span>
											</div>
										)}

										{truck.transmission && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Трансмиссия:</span>
												<span className=' col-span-1'>{TransmissionEnum[truck.transmission as unknown as keyof typeof TransmissionEnum]}</span>
											</div>
										)}


										{truck.truckWheel && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Колесная формула:</span>
												<span className=' col-span-1'>{TruckWheelEnum[truck.truckWheel as unknown as keyof typeof TruckWheelEnum]}</span>
											</div>
										)}

										{truck.drive && (
											<div className=" grid grid-cols-2 items-center gap-2">
												<span className=' text-muted-foreground col-span-1'>Тип привода:</span>
												<span className=' col-span-1'>{DriveEnum[truck.drive as unknown as keyof typeof DriveEnum]}</span>
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
							onClick={() => handleActivate(truck.id!)}
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
							onClick={() => handleRemove(truck.id!)}
						>
							<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Удалить</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/truck/edit/${truck.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/trade/truck/copy/${truck.id}`)}
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




export default MyTruckArchiveItem