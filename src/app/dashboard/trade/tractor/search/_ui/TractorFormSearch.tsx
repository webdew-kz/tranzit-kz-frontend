"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { optional, z } from "zod"
import { useState, useTransition } from 'react';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTractorSearchStore } from '@/shared/store/useTractorSearchStore';
import { findByFilter } from '../actions';
import { useUserStore } from '@/shared/store/useUserStore';
import { DriveEnum, ExistEnum, StatusEnum, SteeringEnum, TransmissionEnum, TractorBrandEnum, TractorWheelEnum, TypeEngineEnum, VariantEnum } from '@/shared/types/tractor.type';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { useTractorStore } from '@/shared/store/useTractorStore';
import { CabinSuspensionEnum, TypeCabinEnum } from '@/shared/types/tractor.type';

export default function TractorFormSearch() {

	const { setSearchTractors } = useTractorSearchStore()

	const { setTractors } = useTractorStore()

	const [pending, startTransition] = useTransition()

	const tractorSchema = z.object({
		city: z.string().optional(),
		variant: z.enum(Object.keys(VariantEnum) as [keyof typeof VariantEnum]).optional(),
		tractorBrand: z.enum(Object.keys(TractorBrandEnum) as [keyof typeof TractorBrandEnum]).optional(),
		minPrice: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		maxPrice: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		minYear: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		maxYear: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		description: z.string().optional(),
		minWeight: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		maxWeight: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		minMileage: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		maxMileage: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		minVolumeEngine: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		maxVolumeEngine: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		minPowerEngine: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		maxPowerEngine: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		typeEngine: z.enum(Object.keys(TypeEngineEnum) as [keyof typeof TypeEngineEnum]).optional(),
		status: z.enum(Object.keys(StatusEnum) as [keyof typeof StatusEnum]).optional(),
		exist: z.enum(Object.keys(ExistEnum) as [keyof typeof ExistEnum]).optional(),
		drive: z.enum(Object.keys(DriveEnum) as [keyof typeof DriveEnum]).optional(),
		transmission: z.enum(Object.keys(TransmissionEnum) as [keyof typeof TransmissionEnum]).optional(),
		steering: z.enum(Object.keys(SteeringEnum) as [keyof typeof SteeringEnum]).optional(),
		tractorWheel: z.enum(Object.keys(TractorWheelEnum) as [keyof typeof TractorWheelEnum]).optional(),
		typeCabin: z.enum(Object.keys(TypeCabinEnum) as [keyof typeof TypeCabinEnum]).optional(),
		cabinSuspension: z.enum(Object.keys(CabinSuspensionEnum) as [keyof typeof CabinSuspensionEnum]).optional(),
	});

	type ITractor = z.infer<typeof tractorSchema>

	const form = useForm({
		resolver: zodResolver(tractorSchema),
		defaultValues: {
			city: undefined,
			variant: "TRACTOR",
			tractorBrand: undefined,
			minWeight: undefined,
			maxWeight: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			minYear: undefined,
			maxYear: undefined,
			description: undefined,
			minMileage: undefined,
			maxMileage: undefined,
			minVolumeEngine: undefined,
			maxVolumeEngine: undefined,
			minPowerEngine: undefined,
			maxPowerEngine: undefined,
			typeEngine: undefined,
			status: undefined,
			exist: undefined,
			drive: undefined,
			transmission: undefined,
			steering: undefined,
			tractorWheel: undefined,
		},
	})

	const onSubmit = async (data: ITractor) => {

		startTransition(async () => {

			try {
				const res = await findByFilter(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				if (res.tractors.length === 0) {
					setSearchTractors([])
					setTractors([])
				}

				setSearchTractors(res.tractors)
				// setTractors([])
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении тягача', {
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
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Поиск тягачей</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className="grid sm:grid-cols-2 w-full gap-3 md:gap-5 items-start">
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
							name="tractorBrand"
							render={({ field }) => (

								<Select
									onValueChange={(value) => {
										field.onChange(value);
									}}
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Марка' />
									</SelectTrigger>
									<SelectContent className="bg-background max-h-60 overflow-y-auto">
										{Object.entries(TractorBrandEnum).map(([key, label]) => (
											<SelectItem key={key} value={key}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="grid md:grid-cols-2 w-full gap-3 md:gap-5 items-start">



						<div className=' flex items-center gap-3 md:gap-5 w-full'>
							<div className=" relative w-full">
								<Input
									type='number'
									placeholder="Год выпуска"
									className='text-sm'
									{...form.register('minYear', { valueAsNumber: true })}
								// {...form.register('minYear')}
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
									от
								</span>
							</div>

							<div className=" relative w-full">
								<Input
									type='number'
									placeholder="Год выпуска"
									className='text-sm'
									{...form.register('maxYear', { valueAsNumber: true })}
								// {...form.register('maxYear')}
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
									до
								</span>
							</div>
						</div>

						<div className=" flex items-center gap-3 md:gap-5">

							<div className=" relative w-full">
								<Input
									type='number'
									placeholder="Цена (₸)"
									className='text-sm'
									{...form.register('minPrice', { valueAsNumber: true })}
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
									от
								</span>
							</div>

							<div className=" relative w-full">
								<Input
									type='number'
									placeholder="Цена (₸)"
									className='text-sm'
									{...form.register('maxPrice', { valueAsNumber: true })}
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
									до
								</span>
							</div>

						</div>
					</div>

					<div className="grid grid-cols-3 w-full">
						<div className=" col-start-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="link" className="w-full underline decoration-dotted text-(--dark-accent) hover:text-(--light-accent)">
										Дополнительные параметры
									</Button>
								</DialogTrigger>
								<DialogContent className="flex flex-col h-full max-h-[100vh] max-w-[100vw] bg-background p-4">

									<DialogHeader className="p-4">
										<DialogTitle className="text-lg text-muted-foreground text-center">
											Дополнительные параметры
										</DialogTitle>
									</DialogHeader>

									<div className="overflow-y-auto flex-1">
										<div className="grid gap-3 md:gap-5">

											<div className="grid md:grid-cols-2 w-full gap-3 md:gap-5 items-start">
												<Controller
													control={form.control}
													name="typeCabin"
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Тип кабины' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(TypeCabinEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

												<Controller
													control={form.control}
													name='cabinSuspension'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Подвеска кабины' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(CabinSuspensionEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>


											</div>


											<div className="grid sm:grid-cols-2 md:grid-cols-3 w-full gap-3 md:gap-5 items-start">

												<Controller
													control={form.control}
													name="exist"
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Наличие' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(ExistEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

												<Controller
													control={form.control}
													name="status"
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Состояние' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(StatusEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>
												<div className=" flex items-center w-full gap-3 md:gap-5">

													<div className=" relative w-full">
														<Input
															type='number'
															placeholder="Пробег (км)"
															className='text-sm'
															disabled={form.watch('status') === 'NEW'}
															{...form.register('minMileage', { valueAsNumber: true })}
														/>
														<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
															от
														</span>
													</div>

													<div className=" relative w-full">
														<Input
															type='number'
															placeholder="Пробег (км)"
															className='text-sm'
															disabled={form.watch('status') === 'NEW'}
															{...form.register('maxMileage', { valueAsNumber: true })}
														/>
														<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
															до
														</span>
													</div>
												</div>
											</div>

											<div className="grid md:grid-cols-3 w-full gap-3 md:gap-5 items-start">
												<Controller
													control={form.control}
													name="typeEngine"
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Тип двигателя' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(TypeEngineEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

												<div className="flex items-center w-full gap-3 md:gap-5">
													<div className=" relative w-full">
														<Input
															type='number'
															placeholder="Объем двс (м³)"
															className='text-sm'
															{...form.register('minVolumeEngine', { valueAsNumber: true })}
														/>
														<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
															от
														</span>
													</div>

													<div className=" relative w-full">
														<Input
															type='number'
															placeholder="Объем двс (м³)"
															className='text-sm'
															{...form.register('maxVolumeEngine', { valueAsNumber: true })}
														/>
														<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
															до
														</span>
													</div>
												</div>

												<div className="flex items-center w-full gap-3 md:gap-5">
													<div className=" relative w-full">
														<Input
															type='number'
															placeholder="Мощность двс (л.с.)"
															className='text-sm'
															{...form.register('minPowerEngine', { valueAsNumber: true })}
														/>
														<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
															от
														</span>
													</div>

													<div className=" relative w-full">
														<Input
															type='number'
															placeholder="Мощность двс (л.с.)"
															className='text-sm'
															{...form.register('maxPowerEngine', { valueAsNumber: true })}
														/>
														<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
															до
														</span>
													</div>
												</div>

											</div>

											<div className="grid sm:grid-cols-2 md:grid-cols-4 w-full gap-3 md:gap-5 items-start">

												<Controller
													control={form.control}
													name='drive'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Привод' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(DriveEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

												<Controller
													control={form.control}
													name='transmission'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='КПП' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(TransmissionEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

												<Controller
													control={form.control}
													name='steering'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Руль' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(SteeringEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

												<Controller
													control={form.control}
													name='tractorWheel'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Колесная формула' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(TractorWheelEnum).map(([key, label]) => (
																	<SelectItem key={key} value={key}>
																		{label}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													)}
												/>

											</div>

										</div>
									</div>
									<DialogFooter className="pt-4 pb-8  flex !justify-center">
										<DialogClose asChild>
											<Button type="button" variant="secondary" className=' w-full max-w-[450px] bg-(--dark-accent) text-background'>
												Сохранить
											</Button>

										</DialogClose>
									</DialogFooter>
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
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти тягач</>) : "Найти грузовик"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
