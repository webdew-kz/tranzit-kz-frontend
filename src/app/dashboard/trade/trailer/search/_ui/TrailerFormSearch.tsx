"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { findByFilter } from '../actions';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { useTrailerSearchStore } from '@/shared/store/useTrailerSearchStore';
import { useTrailerStore } from '@/shared/store/useTrailerStore';
import { z } from 'zod';
import { ExistEnum, QtyAxisEnum, StatusEnum, TrailerBrandEnum, TypeBrakeEnum, TypeSuspensionEnum, TypeTechnicEnum, TypeTrailerEnum, VariantEnum } from '@/shared/types/trailer.type';

export default function TrailerFormSearch() {

	const { setSearchTrailers } = useTrailerSearchStore()

	const { setTrailers } = useTrailerStore()

	const [pending, startTransition] = useTransition()

	const trailerSchema = z.object({
		city: z.string().optional(),
		variant: z.enum(Object.keys(VariantEnum) as [keyof typeof VariantEnum]).optional(),
		trailerBrand: z.enum(Object.keys(TrailerBrandEnum) as [keyof typeof TrailerBrandEnum]).optional(),
		typeTrailer: z.enum(Object.keys(TypeTrailerEnum) as [keyof typeof TypeTrailerEnum]).optional(),
		typeTechnic: z.enum(Object.keys(TypeTechnicEnum) as [keyof typeof TypeTechnicEnum]).optional(),
		typeBrake: z.enum(Object.keys(TypeBrakeEnum) as [keyof typeof TypeBrakeEnum]).optional(),
		qtyAxis: z.enum(Object.keys(QtyAxisEnum) as [keyof typeof QtyAxisEnum]).optional(),
		typeSuspension: z.enum(Object.keys(TypeSuspensionEnum) as [keyof typeof TypeSuspensionEnum]).optional(),
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
		status: z.enum(Object.keys(StatusEnum) as [keyof typeof StatusEnum]).optional(),
		exist: z.enum(Object.keys(ExistEnum) as [keyof typeof ExistEnum]).optional(),
	});

	type ITrailer = z.infer<typeof trailerSchema>

	const form = useForm({
		resolver: zodResolver(trailerSchema),
		defaultValues: {
			city: undefined,
			variant: "TRAILER",
			trailerBrand: undefined,
			typeTrailer: undefined,
			minWeight: undefined,
			maxWeight: undefined,
			minPrice: undefined,
			maxPrice: undefined,
			minYear: undefined,
			maxYear: undefined,
			description: undefined,
			status: undefined,
			exist: undefined,
		},
	})

	const onSubmit = async (data: ITrailer) => {

		startTransition(async () => {

			try {
				const res = await findByFilter(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				if (res.trailers.length === 0) {
					setSearchTrailers([])
					setTrailers([])
				}

				setSearchTrailers(res.trailers)
				// setTrailers([])
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при посике прицепа', {
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
				<CardTitle className='text-xl text-center'>Поиск прицепов</CardTitle>
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
							name='typeTechnic'
							render={({ field }) => (

								<Select
									onValueChange={(value) => field.onChange(value)}
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Тип техники' />
									</SelectTrigger>
									<SelectContent className="bg-background max-h-60 overflow-y-auto">
										{Object.entries(TypeTechnicEnum).map(([key, label]) => (
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
							name="typeTrailer"
							render={({ field }) => (

								<Select
									onValueChange={(value) => field.onChange(value)}
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder='Тип прицепа' />
									</SelectTrigger>
									<SelectContent className="bg-background max-h-60 overflow-y-auto">
										{Object.entries(TypeTrailerEnum).map(([key, label]) => (
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
							name="trailerBrand"
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
										{Object.entries(TrailerBrandEnum).map(([key, label]) => (
											<SelectItem key={key} value={key}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="grid md:grid-cols-3 w-full gap-3 md:gap-5 items-start">


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

						<div className="flex items-center w-full gap-3 md:gap-5">
							<div className=" relative w-full">
								<Input
									type='number'
									placeholder="Тоннаж (т)"
									className='text-sm'
									{...form.register('minWeight', { valueAsNumber: true })}
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
									от
								</span>
							</div>

							<div className=" relative w-full">
								<Input
									type='number'
									placeholder="Тоннаж (т)"
									className='text-sm'
									{...form.register('maxWeight', { valueAsNumber: true })}
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

												{/* <div className=" relative w-full">
													<Input
														type='number'
														placeholder="Пробег"
														className='text-sm'
														disabled={form.watch('status') === 'NEW'}
														{...form.register('mileage', { valueAsNumber: true })}
													/>
													<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
														км
													</span>
												</div> */}

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

											</div>

											<div className="grid sm:grid-cols-2 md:grid-cols-3 w-full gap-3 md:gap-5 items-start">

												<Controller
													control={form.control}
													name='qtyAxis'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Количество осей' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(QtyAxisEnum).map(([key, label]) => (
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
													name='typeBrake'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Тип тормозов' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(TypeBrakeEnum).map(([key, label]) => (
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
													name='typeSuspension'
													render={({ field }) => (

														<Select
															onValueChange={(value) => field.onChange(value)}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder='Тип подвески' />
															</SelectTrigger>
															<SelectContent className="bg-background max-h-60 overflow-y-auto">
																{Object.entries(TypeSuspensionEnum).map(([key, label]) => (
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
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти прицеп</>) : "Найти прицеп"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
