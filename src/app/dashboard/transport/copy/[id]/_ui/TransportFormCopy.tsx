"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useEffect, useState, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { AdditionallyEnum, CurrencyEnum, DocumentsAdrEnum, DocumentsEnum, ITransport, LoadingsEnum, LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, TruckTypeEnum } from '@/shared/types/transport.type';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { TimePicker } from '@/shared/components/widgets/TimePicker';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { useUserStore } from '@/shared/store/useUserStore';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addTransport } from '../../../add/actions';
import Loader from '@/shared/components/widgets/Loader';

interface ITransportFormCopyProps {
	transportId: string
}

export default function TransportFormCopy({ transportId }: ITransportFormCopyProps) {

	const [transport, setTransport] = useState<ITransport>({} as ITransport)

	const router = useRouter()

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('accessToken')

			const res = await fetch(`${process.env.SERVER_URL}/transport/${transportId}`, {
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

			setTransport(data)

		}

		fetchData()
	}, [])

	const { user } = useUserStore()

	const [pending, startTransition] = useTransition()

	const transportSchema = z.object({
		// title: z.string().min(1),
		// price: z.number().int().nonnegative(),
		// currency: z.enum(Object.keys(CurrencyEnum) as [keyof typeof CurrencyEnum]),

		note: z.string().optional(),

		placesLoading: z.array(z.string()).min(1),
		placesUnloading: z.array(z.string()).min(1),
		weight: z.number().positive(),
		volume: z.number().positive(),
		periodDays: z.number().int().min(1).max(30),
		startDate: z.string(),

		truckType: z.array(z.enum(Object.keys(TruckTypeEnum) as [keyof typeof TruckTypeEnum])).min(1),
		loadingType: z.array(z.enum(Object.keys(LoadingTypeEnum) as [keyof typeof LoadingTypeEnum])).min(1),

		// paymentMethod: z.array(z.enum(Object.keys(PaymentMethodEnum) as [keyof typeof PaymentMethodEnum])).min(1),
		// paymentPeriod: z.array(z.enum(Object.keys(PaymentPeriodEnum) as [keyof typeof PaymentPeriodEnum])).optional(),
		// paymentOther: z.array(z.enum(Object.keys(PaymentOtherEnum) as [keyof typeof PaymentOtherEnum])).optional(),
		// paymentPrepaymentPercent: z.string().optional(),
		// paymentDeferredDays: z.string().optional(),

		optionDocuments: z.array(z.enum(Object.keys(DocumentsEnum) as [keyof typeof DocumentsEnum])).optional(),
		optionDocumentsAdr: z.enum(Object.keys(DocumentsAdrEnum) as [keyof typeof DocumentsAdrEnum]).optional(),

		// optionLoadings: z.array(z.enum(Object.keys(LoadingsEnum) as [keyof typeof LoadingsEnum])).optional(),
		// optionLoadingsTimeLoading: z.string().optional(),
		// optionLoadingsTimeUnloading: z.string().optional(),
		// optionLoadingsDateUnloading: z.string().optional(),
		// optionLoadingsPlaceLoading: z.string().optional(),
		// optionLoadingsPlaceUnloading: z.string().optional(),
		// optionLoadingsBigBag: z.string().optional(),

		// optionTerms: z.array(z.enum(Object.keys(TermsEnum) as [keyof typeof TermsEnum])).optional(),
		// optionTermsTemperature: z.string().optional(),
		// optionTermsQtyPallets: z.string().optional(),
		// optionTermsCorners: z.string().optional(),
		// optionTermsBelts: z.string().optional(),
		// optionTermsPalletsType: z.enum(Object.keys(TermsPalletsTypeEnum) as [keyof typeof TermsPalletsTypeEnum]).optional(),

		// optionAdditionally: z.array(z.enum(Object.keys(AdditionallyEnum) as [keyof typeof AdditionallyEnum])).optional(),

		userName: z.string().min(1),
		userPhone: z.string().min(5),
		whatsapp: z.string().nullable().default('')
	});


	type ITransport = z.infer<typeof transportSchema>

	const form = useForm({
		resolver: zodResolver(transportSchema),
		defaultValues: {
			// title: '',
			// price: undefined,
			// currency: CurrencyEnum.KZT,
			note: undefined,

			placesLoading: [""],
			placesUnloading: [""],
			weight: undefined,
			volume: undefined,
			periodDays: 5,
			startDate: new Date().toISOString(),

			truckType: [],
			loadingType: [],

			// paymentMethod: [],
			// paymentPeriod: [],
			// paymentOther: [],
			// paymentPrepaymentPercent: undefined,
			// paymentDeferredDays: undefined,

			optionDocuments: [],
			optionDocumentsAdr: undefined,

			// optionLoadings: [],
			// optionLoadingsTimeLoading: undefined,
			// optionLoadingsTimeUnloading: undefined,
			// optionLoadingsDateUnloading: undefined,
			// optionLoadingsPlaceLoading: "",
			// optionLoadingsPlaceUnloading: "",
			// optionLoadingsBigBag: "",

			// optionTerms: [],
			// optionTermsTemperature: "",
			// optionTermsQtyPallets: undefined,
			// optionTermsCorners: "",
			// optionTermsBelts: "",
			// optionTermsPalletsType: undefined,

			// optionAdditionally: [],

			userName: '',
			userPhone: '',
			whatsapp: ''
		},
	})


	useEffect(() => {
		if (transport) {
			form.reset({
				// ...(transport.title != null && { title: transport.title }),
				// ...(transport.price != null && { price: transport.price }),
				// ...(transport.currency != null && { currency: transport.currency }),
				...(transport.note != null && { note: transport.note }),
				...(transport.placesLoading != null && { placesLoading: transport.placesLoading }),
				...(transport.placesUnloading != null && { placesUnloading: transport.placesUnloading }),
				...(transport.weight != null && { weight: transport.weight }),
				...(transport.volume != null && { volume: transport.volume }),
				...(transport.periodDays != null && { periodDays: transport.periodDays }),
				...(transport.startDate != null && { startDate: transport.startDate }),
				...(transport.truckType != null && { truckType: transport.truckType }),
				...(transport.loadingType != null && { loadingType: transport.loadingType }),
				// ...(transport.paymentMethod != null && { paymentMethod: transport.paymentMethod }),
				// ...(transport.paymentPeriod != null && { paymentPeriod: transport.paymentPeriod }),
				// ...(transport.paymentOther != null && { paymentOther: transport.paymentOther }),
				// ...(transport.paymentPrepaymentPercent != null && { paymentPrepaymentPercent: transport.paymentPrepaymentPercent }),
				// ...(transport.paymentDeferredDays != null && { paymentDeferredDays: transport.paymentDeferredDays }),
				...(transport.optionDocuments != null && { optionDocuments: transport.optionDocuments }),
				...(transport.optionDocumentsAdr != null && { optionDocumentsAdr: transport.optionDocumentsAdr }),
				// ...(transport.optionLoadings != null && { optionLoadings: transport.optionLoadings }),
				// ...(transport.optionLoadingsTimeLoading != null && { optionLoadingsTimeLoading: transport.optionLoadingsTimeLoading }),
				// ...(transport.optionLoadingsTimeUnloading != null && { optionLoadingsTimeUnloading: transport.optionLoadingsTimeUnloading }),
				// ...(transport.optionLoadingsDateUnloading != null && { optionLoadingsDateUnloading: transport.optionLoadingsDateUnloading }),
				// ...(transport.optionLoadingsPlaceLoading != null && { optionLoadingsPlaceLoading: transport.optionLoadingsPlaceLoading }),
				// ...(transport.optionLoadingsPlaceUnloading != null && { optionLoadingsPlaceUnloading: transport.optionLoadingsPlaceUnloading }),
				// ...(transport.optionLoadingsBigBag != null && { optionLoadingsBigBag: transport.optionLoadingsBigBag }),
				// ...(transport.optionTerms != null && { optionTerms: transport.optionTerms }),
				// ...(transport.optionTermsTemperature != null && { optionTermsTemperature: transport.optionTermsTemperature }),
				// ...(transport.optionTermsQtyPallets != null && { optionTermsQtyPallets: transport.optionTermsQtyPallets }),
				// ...(transport.optionTermsCorners != null && { optionTermsCorners: transport.optionTermsCorners }),
				// ...(transport.optionTermsBelts != null && { optionTermsBelts: transport.optionTermsBelts }),
				// ...(transport.optionTermsPalletsType != null && { optionTermsPalletsType: transport.optionTermsPalletsType }),
				// ...(transport.optionAdditionally != null && { optionAdditionally: transport.optionAdditionally }),
				...(transport.userName != null && { userName: transport.userName }),
				...(transport.userPhone != null && { userPhone: transport.userPhone }),
				...(transport.whatsapp != null && { whatsapp: transport.whatsapp }),
			},)
		}
	}, [transport, form])

	useEffect(() => {
		if (user?.name) {
			form.setValue('userName', user.name);
		}
		if (user?.phone) {
			form.setValue('userPhone', user.phone);
		}
		if (user?.whatsapp) {
			form.setValue('whatsapp', user.whatsapp);
		}
	}, [user, form]);



	const onSubmit = async (data: ITransport) => {

		startTransition(async () => {

			try {
				const res = await addTransport(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				router.push('/dashboard/transport/my')
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении груза', {
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

	if (!transportId) {
		return <Loader />
	}

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Копировать груз</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className="grid sm:grid-cols-2 w-full gap-3 md:gap-5 items-start">
						<Controller
							control={form.control}
							name="placesLoading"
							render={({ field }) => (
								<MultiCityInput
									values={field.value}
									onChange={field.onChange}
									placeholder="Пункт погрузки"
									addBtnText="Добавить пункт погрузки"
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="placesUnloading"
							render={({ field }) => (

								<MultiCityInput
									values={field.value}
									onChange={field.onChange}
									addBtnText="Добавить пункт разгрузки"
									placeholder='Пункт разгрузки'
								/>
							)}
						/>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-3 md:gap-5 items-start">

						<Controller
							control={form.control}
							name="truckType"
							render={({ field }) => (


								<MultiSelect
									options={TruckTypeEnum}
									value={field.value}
									onChange={field.onChange}
									placeholder="Тип фуры"
								/>
							)}
						/>

						<Controller
							control={form.control}
							name='loadingType'
							render={({ field }) => (

								<MultiSelect
									options={LoadingTypeEnum}
									value={field.value}
									onChange={field.onChange}
									placeholder="Тип погрузки"
								/>
							)}
						/>


						<Input
							type='number'
							required
							placeholder="Тоннаж"
							className='text-sm'
							{...form.register('weight', { valueAsNumber: true })}
						/>


						<Input
							type='number'
							required
							placeholder="Объем"
							className='text-sm'
							{...form.register('volume', { valueAsNumber: true })}
						/>

						<Controller
							control={form.control}
							name='startDate'
							render={({ field }) => (
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									placeholder='Дата погрузки'
								/>
							)}
						/>

						<Controller
							control={form.control}
							name="periodDays"
							render={({ field }) => (
								<Select
									onValueChange={(value) => field.onChange(Number(value))}
									value={String(field.value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Период' />
									</SelectTrigger>
									<SelectContent className="bg-background max-h-60 overflow-y-auto">
										{Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
											<SelectItem key={day} value={day.toString()}>
												{day} {day === 1 ? "день" : day < 5 ? "дня" : "дней"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

					</div>


					{/* <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-3 md:gap-5 items-start">

						<Input
							type='text'
							placeholder="Наименование груза"
							className='text-sm'
							required
							{...form.register('title')}
						/>

						<Input
							type='number'
							placeholder="Стоимость"
							className='text-sm'
							required
							{...form.register('price', { valueAsNumber: true })}
						/>

						<Controller
							control={form.control}
							name='currency'
							render={({ field }) => (
								<Select
									onValueChange={(value) => field.onChange(value)}
									value={String(field.value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Валюта' />
									</SelectTrigger>
									<SelectContent className="bg-background">
										{Object.entries(CurrencyEnum).map(([key, value]) => (
											<SelectItem
												key={key}
												value={key}
											>{value}</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>

						<Controller
							control={form.control}
							name='paymentMethod'
							render={({ field }) => (
								<MultiSelect
									options={PaymentMethodEnum}
									value={field.value}
									onChange={field.onChange}
									placeholder="Метод оплаты"
								/>
							)}
						/>
					</div> */}


					<div className="grid w-full">
						<Input
							type='text'
							placeholder="Примечание (необязательно)"
							className='text-sm'
							{...form.register('note')}
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
								<DialogContent className="flex flex-col max-h-[100vh] max-w-[100vw] bg-background p-0">

									<div className="p-4">
										<DialogHeader>
											<DialogTitle className="text-lg text-muted-foreground text-center">
												Дополнительные параметры
											</DialogTitle>
										</DialogHeader>
									</div>

									<div className="overflow-y-auto p-6 pt-4 flex-1">
										<div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">

											{/* <div className=" flex flex-col gap-4">
												<h2 className='font-bold text-lg text-(--dark-accent)'>Детали оплаты</h2>
												<div className=" flex flex-col gap-2">
													<h3 className=' mb-2 font-bold text-muted-foreground'>Срок оплаты</h3>

													<Controller
														name="paymentPeriod"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={PaymentPeriodEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

													<Input
														type='text'
														placeholder="Предоплата (%)"
														className='text-sm'
														required
														{...form.register('paymentPrepaymentPercent')}

													/>
													<Input
														type='text'
														placeholder="Отсрочка платежа (дней)"
														className='text-sm'
														required
														{...form.register('paymentDeferredDays')}

													/>
												</div>
												<div className="">
													<h3 className=' mb-2 font-bold text-muted-foreground'>Дополнительно</h3>
													<Controller
														name="paymentOther"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={PaymentOtherEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

												</div>
											</div> */}

											<div className=" flex flex-col gap-4">
												<h2 className='font-bold text-lg text-(--dark-accent)'>Документы</h2>
												<div className=" flex flex-col gap-2">

													<Controller
														name="optionDocuments"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={DocumentsEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

													<Controller
														control={form.control}
														name='optionDocumentsAdr'
														render={({ field }) => (
															<Select
																onValueChange={(value) => field.onChange(value)}
																value={field.value ?? ""}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="ADR" />
																</SelectTrigger>
																<SelectContent className="bg-background">
																	{Object.entries(DocumentsAdrEnum).map(([key, value]) => (
																		<SelectItem key={key} value={key}>
																			{value}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														)}
													/>
												</div>
											</div>

											{/* <div className=" flex flex-col gap-4">
												<h2 className='font-bold text-lg text-(--dark-accent)'>Погрузка</h2>
												<div className=" flex flex-col gap-2">

													<Controller
														name="optionLoadings"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={LoadingsEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

													<Controller
														control={form.control}
														name='optionLoadingsDateUnloading'
														render={({ field }) => (
															<DatePicker
																value={field.value}
																onChange={field.onChange}
																placeholder='Дата разгрузки'
															/>
														)}
													/>

													<Input
														type='text'
														placeholder="Место погрузки"
														className='text-sm'
														required
														{...form.register('optionLoadingsPlaceLoading')}
													/>
													<Input
														type='text'
														placeholder="Место разгрузки"
														className='text-sm'
														required
														{...form.register('optionLoadingsPlaceUnloading')}
													/>


													<Controller
														control={form.control}
														name='optionLoadingsTimeLoading'
														render={({ field }) => (
															<TimePicker
																value={field.value}
																onChange={field.onChange}
																text="Погрузка в"
															/>
														)}
													/>


													<Controller
														control={form.control}
														name='optionLoadingsTimeUnloading'
														render={({ field }) => (
															<TimePicker
																value={field.value}
																onChange={field.onChange}
																text="Разгрузка до"
															/>
														)}
													/>

													<Input
														type='text'
														placeholder="Биг-бэг"
														className='text-sm'
														required
														{...form.register('optionLoadingsBigBag')}
													/>
												</div>
											</div>

											<div className=" flex flex-col gap-4">
												<h2 className='font-bold text-lg text-(--dark-accent)'>Условия</h2>
												<div className=" flex flex-col gap-2">

													<Controller
														name="optionTerms"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={TermsEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

													<Input
														type='text'
														placeholder="Температура"
														className='text-sm'
														required
														{...form.register('optionTermsTemperature')}
													/>
													<Input
														type='text'
														placeholder="Количество паллет"
														className='text-sm'
														required
														{...form.register('optionTermsQtyPallets')}
													/>
													<Input
														type='text'
														placeholder="Углы"
														className='text-sm'
														required
														{...form.register('optionTermsCorners')}
													/>
													<Input
														type='text'
														placeholder="Ремни"
														className='text-sm'
														required
														{...form.register('optionTermsBelts')}
													/>

													<Controller
														control={form.control}
														name='optionTermsPalletsType'
														render={({ field }) => (
															<Select
																onValueChange={(value) => field.onChange(value)}
																value={field.value ?? ""}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Тип паллеты" />
																</SelectTrigger>
																<SelectContent className="bg-background">
																	{Object.entries(TermsPalletsTypeEnum).map(([key, value]) => (
																		<SelectItem key={key} value={key}>
																			{value}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														)}
													/>


												</div>
											</div>

											<div className=" flex flex-col gap-4">
												<h2 className='font-bold text-lg text-(--dark-accent)'>Дополнительно</h2>
												<div className=" flex flex-col gap-2">



													<Controller
														name="optionAdditionally"
														control={form.control}
														render={({ field }) => (
															<MultiCheckbox
																className="bg-background"
																options={AdditionallyEnum}
																selected={field.value || []}
																onChange={field.onChange}
															/>
														)}
													/>

												</div>
											</div> */}
										</div>
									</div>

									<div className="z-10 bg-background border-t p-3">
										<DialogFooter className=" flex sm:justify-center">
											<DialogClose asChild>
												<Button type="button" variant="secondary">
													Закрыть
												</Button>
											</DialogClose>
										</DialogFooter>
									</div>
								</DialogContent>
							</Dialog>

						</div>
					</div>


					<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Input
							type="text"
							placeholder="Имя"
							className="text-sm"
							required
							{...form.register('userName')}
						/>

						<Input
							type="text"
							placeholder="Телефон"
							className="text-sm"
							required
							{...form.register('userPhone')}
						/>


						<Button
							type='submit'
							className=' bg-(--dark-accent)'
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Копировать груз</>) : "Копировать груз"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
