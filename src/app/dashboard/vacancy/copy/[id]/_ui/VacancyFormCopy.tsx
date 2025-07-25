"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useEffect, useState, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { ExperienceTypeEnum, JobEnum, TypeJobEnum } from '@/shared/types/vacancy.type';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { TimePicker } from '@/shared/components/widgets/TimePicker';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { useUserStore } from '@/shared/store/useUserStore';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addVacancy } from '../../../add/actions';
import Loader from '@/shared/components/widgets/Loader';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { cn } from '@/shared/lib/utils';

interface IVacancyFormCopyProps {
	vacancyId: string
}

export default function VacancyFormCopy({ vacancyId }: IVacancyFormCopyProps) {

	const [vacancy, setVacancy] = useState<IVacancy>({} as IVacancy)

	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('accessToken')

			const res = await fetch(`${process.env.SERVER_URL}/vacancy/${vacancyId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			})

			if (!res.ok) {
				console.log(res.statusText);
				router.push('/not-found')
			}

			const data = await res.json()

			setVacancy(data)

		}

		fetchData()
	}, [])

	const { user } = useUserStore()

	const [pending, startTransition] = useTransition()

	const vacancySchema = z.object({
		job: z.enum(Object.keys(JobEnum) as [keyof typeof JobEnum], { message: 'Выберите вакансию' }),
		otherJob: z.string().optional(),
		typeJob: z.array(z.enum(Object.keys(TypeJobEnum) as [keyof typeof TypeJobEnum])).min(1, { message: 'Выберите хотя бы один тип занятости' }),
		city: z.string().min(1, { message: 'Укажите город' }),
		description: z.string().optional(),
		work_schedule_at: z.string().optional(),
		work_schedule_to: z.string().optional(),
		salary_at: z.number().positive().optional(),
		salary_to: z.number().positive().optional(),
		experience_type: z.array(z.enum(Object.keys(ExperienceTypeEnum) as [keyof typeof ExperienceTypeEnum])).optional(),

		userName: z.string().min(1),
		userPhone: z.string().min(5),

		skype: z.string().nullable().default(''),
		telegram: z.string().nullable().default(''),
		viber: z.string().nullable().default(''),
		whatsapp: z.string().nullable().default('')
	});


	type IVacancy = z.infer<typeof vacancySchema>

	const form = useForm({
		resolver: zodResolver(vacancySchema),
		defaultValues: {
			job: 'DRIVER',
			otherJob: undefined,
			typeJob: [],
			city: undefined,
			description: undefined,
			work_schedule_at: undefined,
			work_schedule_to: undefined,
			salary_at: undefined,
			salary_to: undefined,
			experience_type: undefined,

			userName: user?.name!,
			userPhone: user?.phone!,

			whatsapp: user?.whatsapp,
			telegram: user?.telegram,
			viber: user?.viber,
			skype: user?.skype,
		},
	})


	useEffect(() => {
		if (vacancy) {
			form.reset({
				...(vacancy.job != null && { job: vacancy.job }),
				...(vacancy.typeJob != null && { typeJob: vacancy.typeJob }),
				...(vacancy.otherJob != null && { otherJob: vacancy.otherJob }),
				...(vacancy.city != null && { city: vacancy.city }),
				...(vacancy.description != null && { description: vacancy.description }),
				...(vacancy.work_schedule_at != null && { work_schedule_at: vacancy.work_schedule_at }),
				...(vacancy.work_schedule_to != null && { work_schedule_to: vacancy.work_schedule_to }),
				...(vacancy.salary_at != null && { salary_at: vacancy.salary_at }),
				...(vacancy.salary_to != null && { salary_to: vacancy.salary_to }),
				...(vacancy.experience_type != null && { experience_type: vacancy.experience_type }),
				...(vacancy.userName != null && { userName: vacancy.userName }),
				...(vacancy.userPhone != null && { userPhone: vacancy.userPhone }),
				...(vacancy.whatsapp != null && { whatsapp: vacancy.whatsapp }),
			},)
		}
	}, [vacancy, form])

	useEffect(() => {
		if (user?.name) {
			form.setValue('userName', user.name);
		}
		if (user?.phone) {
			form.setValue('userPhone', user.phone);
		}
	}, [user, form]);



	const onSubmit = async (data: IVacancy) => {

		startTransition(async () => {

			try {
				const res = await addVacancy(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				router.push('/dashboard/vacancy/my')
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении вакансии', {
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

	if (!vacancyId) {
		return <Loader />
	}

	const job = useWatch({
		control: form.control,
		name: 'job',
	})

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Копировать вакансию</CardTitle>
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
									value={String(field.value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Вакансия' />
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
									value={field.value}
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

													<h3 className=' mb-2 font-bold text-muted-foreground'>Требования</h3>
													<Input
														type='text'
														placeholder="Укажите требования сотрудника"
														className='text-sm'
														required
														{...form.register('description')}

													/>
												</div>

												<div className=" flex flex-col gap-2">
													<h3 className=' mb-2 font-bold text-muted-foreground'>График работы</h3>
													<Controller
														control={form.control}
														name='work_schedule_at'
														render={({ field }) => (
															<TimePicker
																value={field.value}
																onChange={field.onChange}
																text="С"
															/>
														)}
													/>

													<Controller
														control={form.control}
														name='work_schedule_to'
														render={({ field }) => (
															<TimePicker
																value={field.value}
																onChange={field.onChange}
																text="До"
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
														required
														{...form.register('salary_at', { valueAsNumber: true })}
													/>

													<Input
														type='number'
														placeholder="до"
														className='text-sm'
														required
														{...form.register('salary_to', { valueAsNumber: true })}
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


					<div className="grid md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Input
							type="text"
							placeholder="Имя"
							className="text-sm"

							{...form.register('userName')}
						/>

						<Input
							type="text"
							placeholder="Телефон"
							className="text-sm"

							{...form.register('userPhone')}
						/>

						<Input
							type="text"
							placeholder="Whatsapp (необязательно)"
							className="text-sm"
							{...form.register('whatsapp')}
						/>

						{/* <Input
							type="text"
							placeholder="Telegram"
							className="text-sm"

							{...form.register('telegram')}
						/>

						<Input
							type="text"
							placeholder="Viber"
							className="text-sm"

							{...form.register('viber')}
						/>

						<Input
							type="text"
							placeholder="Skype"
							className="text-sm"

							{...form.register('skype')}
						/> */}
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) md:col-start-2 w-full'
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Сохранить вакансию</>) : "Сохранить вакансию"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
