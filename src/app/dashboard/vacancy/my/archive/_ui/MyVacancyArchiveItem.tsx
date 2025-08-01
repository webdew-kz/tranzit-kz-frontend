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
import { ExperienceTypeEnum, IVacancy, JobEnum, TypeJobEnum } from '@/shared/types/vacancy.type'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, Check, ChevronDown, Container, Copy, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, SquarePen, Trash, Truck, Wallet, Weight, X } from 'lucide-react'
import React, { memo, SetStateAction, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { activateVacancy } from '../../actions'
import { remove } from '../actions'

interface MyVacancyItemProps {
	vacancyInitial: IVacancy
	selected: boolean
	onToggle: () => void
	setVacancys: (value: SetStateAction<IVacancy[]>) => void
	rates?: any
	loading?: boolean

}

const MyVacancyArchiveItem = memo(({ vacancyInitial, selected, onToggle, setVacancys, rates, loading }: MyVacancyItemProps) => {

	const router = useRouter()

	const [vacancy, setVacancy] = useState<IVacancy>(vacancyInitial)

	const [places, setPlaces] = useState<string[]>([])

	const [pending, startTransition] = useTransition()

	// useEffect(() => {
	// 	setPlaces([...vacancy.placesLoading, ...vacancy.placesUnloading]);
	// }, [vacancy.placesLoading, vacancy.placesUnloading]);

	// useEffect(() => {

	// 	if (!loading && rates && vacancy && vacancy.price && vacancy.tariff && vacancy.currency) {
	// 		setAmountPrice(convertToKZT(Number(vacancy.price), vacancy.currency, rates))
	// 		setAmountTariff(convertToKZT(Number(vacancy.tariff), vacancy.currency, rates))

	// 		setBaseAmountPriceKZT(convertToKZT(Number(vacancy.price), vacancy.currency, rates))
	// 		setBaseAmountTariffKZT(convertToKZT(Number(vacancy.tariff), vacancy.currency, rates))
	// 	}

	// }, [rates, vacancy.tariff, vacancy.price, vacancy.currency])

	const handleActivateVacancy = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await activateVacancy({ id })

				toast.success(res.message, {
					position: 'top-center',
				})

				setVacancy((prev) => ({
					...prev,
					...res.updatedVacancy,
				}))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при обновлении вакансии', {
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

				setVacancys(prev => prev.filter(vacancy => vacancy.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при архивации вакансии', {
					position: 'top-center',
				})
			}
		})
	}

	if (loading) {
		return <Loader />
	}

	return (
		<Card className='p-0 border-1 border-(--dark-accent)'>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex flex-col lg:flex-row justify-between w-full lg:items-center mb-2">

					<div className=""></div>

					<div className=" flex items-center  gap-4 justify-end">
						<div className="flex items-center gap-2">
							<Checkbox
								id={vacancy.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={vacancy.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div>
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

				<div className=" flex flex-col gap-3 items-start lg:flex-row justify-between w-full">
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
					<div className=" flex gap-2 w-full lg:w-auto">
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => handleActivateVacancy(vacancy.id!)}
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
							onClick={() => handleRemove(vacancy.id!)}
						>
							<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Удалить</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/vacancy/edit/${vacancy.id}`)}
						>
							<SquarePen size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Редактировать</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/4)] lg:max-w-auto'
							onClick={() => router.push(`/dashboard/vacancy/copy/${vacancy.id}`)}
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


export default MyVacancyArchiveItem