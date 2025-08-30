"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useTransition } from 'react';
import { LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, TruckTypeEnum } from '@/shared/types/cargo.type';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCargoSearchStore } from '@/shared/store/useCargoSearchStore';
import { findManyByFilter } from '../actions';

export default function CargoFormSearch() {

	// const { user } = useUserStore()

	const { setSearchCargos } = useCargoSearchStore()

	// const { cargos, setCargos } = useCargoStore()

	const [pending, startTransition] = useTransition()

	const cargoSchema = z.object({
		placesLoading: z.array(z.string()).min(1),
		placesUnloading: z.array(z.string()).min(1),
		weight: z
			.string()
			.optional()
			.transform((val) => val === '' || val === undefined ? undefined : Number(val))
			.refine((val) => val === undefined || (!isNaN(val) && val > 0), {
				message: 'Вес должен быть положительным числом',
			}),

		volume: z
			.string()
			.optional()
			.transform((val) => val === '' || val === undefined ? undefined : Number(val))
			.refine((val) => val === undefined || (!isNaN(val) && val > 0), {
				message: 'Объем должен быть положительным числом',
			}),

		startDate: z.string().optional(),
		endDate: z.string().optional(),

		truckType: z.array(z.enum(Object.keys(TruckTypeEnum) as [keyof typeof TruckTypeEnum])).optional(),
		loadingType: z.array(z.enum(Object.keys(LoadingTypeEnum) as [keyof typeof LoadingTypeEnum])).optional(),
	});

	type ICargo = z.infer<typeof cargoSchema>

	const form = useForm({
		resolver: zodResolver(cargoSchema),
		defaultValues: {
			// title: "",
			// price: undefined,
			// currency: CurrencyEnum.KZT,
			// note: undefined,

			placesLoading: [""],
			placesUnloading: [""],
			weight: undefined,
			volume: undefined,
			startDate: undefined,
			endDate: undefined,

			truckType: [],
			loadingType: [],
		},
	})

	const onSubmit = async (data: ICargo) => {

		startTransition(async () => {

			try {
				const res = await findManyByFilter(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				setSearchCargos(res.cargos)
				// setCargos([])
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



	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5 pb-[60px]">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Поиск грузов</CardTitle>
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
									value={field.value || []}
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
									value={field.value || []}
									onChange={field.onChange}
									placeholder="Тип погрузки"
								/>
							)}
						/>

						<Input
							type="number"
							placeholder="Тоннаж до"
							className="text-sm"
							{...form.register('weight')}
						/>

						<Input
							type="number"
							placeholder="Объем до"
							className="text-sm"
							{...form.register('volume')}
						/>


						<Controller
							control={form.control}
							name='startDate'
							render={({ field }) => (
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									placeholder='Дата начала'
								/>
							)}
						/>

						<Controller
							control={form.control}
							name='endDate'
							render={({ field }) => (
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									placeholder='Дата окончания'
								/>
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
										<SelectValue placeholder='Валюта ⇄' />
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


					{/* <div className="grid w-full">
						<Input
							type='text'
							placeholder="Примечание (необязательно)"
							className='text-sm'
							{...form.register('note')}
						/>
					</div> */}


					{/* <div className="grid grid-cols-3 w-full">
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

											<div className=" flex flex-col gap-4">
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
											</div>

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

											<div className=" flex flex-col gap-4">
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
											</div>
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
					</div> */}


					<div className="grid sm:grid-cols-2 md:grid-cols-6  w-full gap-3 md:gap-5 items-start">

						{/* <Input
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
						/> */}


						<Button
							type='submit'
							className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти груз</>) : "Найти груз"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
