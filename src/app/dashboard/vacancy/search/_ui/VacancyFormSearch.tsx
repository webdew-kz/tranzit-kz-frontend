"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useTransition } from 'react';
import { ExperienceTypeEnum, IVacancy, JobEnum, TypeJobEnum } from '@/shared/types/vacancy.type'
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useVacancySearchStore } from '@/shared/store/useVacancySearchStore';
import { findManyByFilter } from '../actions';
import { useUserStore } from '@/shared/store/useUserStore';
import { cn } from '@/shared/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { useVacancyStore } from '@/shared/store/useVacancyStore';

export default function VacancyFormSearch() {

	const { user } = useUserStore()

	const { setSearchVacancys } = useVacancySearchStore()

	const { vacancys, setVacancys } = useVacancyStore()

	const [pending, startTransition] = useTransition()

	const vacancySchema = z.object({
		job: z.enum(Object.keys(JobEnum) as [keyof typeof JobEnum], { message: 'Выберите вакансию' }).optional(),
		otherJob: z.string().optional(),
		typeJob: z.array(z.enum(Object.keys(TypeJobEnum) as [keyof typeof TypeJobEnum])).optional(),
		city: z.string().optional(),
		description: z.string().optional(),
		work_schedule_at: z.string().optional(),
		work_schedule_to: z.string().optional(),
		salary_at: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
		salary_to: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
		experience_type: z.array(z.enum(Object.keys(ExperienceTypeEnum) as [keyof typeof ExperienceTypeEnum])).optional(),
	});

	type IVacancy = z.infer<typeof vacancySchema>

	const form = useForm({
		resolver: zodResolver(vacancySchema),
		defaultValues: {
			job: undefined,
			otherJob: undefined,
			typeJob: [],
			city: undefined,
			description: undefined,
			work_schedule_at: undefined,
			work_schedule_to: undefined,
			salary_at: undefined,
			salary_to: undefined,
			experience_type: undefined
		},
	})

	const onSubmit = async (data: IVacancy) => {

		startTransition(async () => {

			try {
				const res = await findManyByFilter(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				setSearchVacancys(res.vacancys)
				setVacancys([])
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при поиске вакансии', {
					position: 'top-center',
				})
			}
		})

	}

	const onError = (errors: any) => {
		toast.error(errors.message ?? 'Некорректные данные', {
			position: 'top-center',
		})
		console.error(errors);

	};

	const job = useWatch({
		control: form.control,
		name: 'job',
	})

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Поиск вакансий</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className={cn('grid w-full gap-3 md:gap-5 items-start', job === 'OTHER' ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
						<Controller
							control={form.control}
							name="job"
							render={({ field }) => (
								<Select
									onValueChange={(value) => field.onChange(value)}
									value={field.value ?? ""}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Выберите вакансию' />
									</SelectTrigger>
									<SelectContent className="bg-background max-h-60 overflow-y-auto">
										{Object.entries(JobEnum).map(([key, value]) => (
											<SelectItem
												key={key}
												value={key}
											>{value}</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

						{job === 'OTHER' && (
							<Input
								type='text'
								placeholder="Укажите вакансию"
								className='text-sm'
								required
								{...form.register('otherJob')}
							/>
						)}

						<Controller
							control={form.control}
							name="city"
							render={({ field }) => (
								<CityInput
									value={field.value}
									onChange={field.onChange}
									placeholder="Город"
									onRemove={() => { }}
									canRemove={false}
								/>
							)}
						/>

						<Controller
							control={form.control}
							name="typeJob"
							render={({ field }) => (

								<MultiSelect
									options={TypeJobEnum}
									value={field.value || []}
									onChange={field.onChange}
									placeholder="Тип занятости"
								/>
							)}
						/>
					</div>

					<div className="grid grid-cols-3 w-full">
						<div className=" col-start-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="link" className="w-full underline decoration-dotted text-(--dark-accent) hover:text-(--light-accent)">
										Дополнительные параметры
									</Button>
								</DialogTrigger>
								<DialogContent className="flex flex-col max-h-[100vh] max-w-[100vw] lg:max-w-[30vw] bg-background p-0">

									<div className="p-4">
										<DialogHeader>
											<DialogTitle className="text-lg text-muted-foreground text-center">
												Дополнительные параметры
											</DialogTitle>
										</DialogHeader>
									</div>

									<div className="overflow-y-auto p-6 pt-4 flex-1 ">
										<div className="grid">

											<div className=" flex flex-col gap-4">
												{/* <h2 className='font-bold text-lg text-(--dark-accent)'>Детали оплаты</h2> */}
												<div className=" flex flex-col gap-2">
													<h3 className=' mb-2 font-bold text-muted-foreground'>Опыт работы</h3>
													<Controller
														name="experience_type"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={ExperienceTypeEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

												</div>

												<div className=" flex flex-col gap-2">
													<h3 className=' mb-2 font-bold text-muted-foreground'>Заработная плата </h3>
													<Input
														type='number'
														placeholder="от"
														className='text-sm'
														{...form.register('salary_at')}
													/>

													<Input
														type='number'
														placeholder="до"
														className='text-sm'
														{...form.register('salary_to')}
													/>
												</div>
											</div>


										</div>

										<div className=" w-full pt-4 flex justify-center pb-8">
											<DialogClose asChild>
												<Button type="button" variant="secondary" className=' w-full max-w-[450px] bg-(--dark-accent) text-background'>
													Сохранить
												</Button>

											</DialogClose>
										</div>
									</div>
								</DialogContent>
							</Dialog>

						</div>
					</div>


					<div className="grid sm:grid-cols-2 md:grid-cols-6  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти вакансию</>) : "Найти вакансию"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
