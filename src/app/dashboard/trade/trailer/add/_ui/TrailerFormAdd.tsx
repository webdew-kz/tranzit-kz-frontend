"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { z } from "zod"
import { useEffect, useState, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { useUserStore } from '@/shared/store/useUserStore';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addTrailer } from '../actions';
import { Camera, ImageUp, Loader2, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { cn } from '@/shared/lib/utils';
import { ExistEnum, QtyAxisEnum, StatusEnum, TrailerBrandEnum, TypeBrakeEnum, TypeSuspensionEnum, TypeTechnicEnum, TypeTrailerEnum, VariantEnum } from '@/shared/types/trailer.type';
import Link from 'next/link';
import { getUser } from '@/app/dashboard/cargo/add/actions';


export default function TrailerFormAdd() {

	const { user, setUser } = useUserStore()

	const [open, setOpen] = useState(false);

	const [pending, startTransition] = useTransition()

	const router = useRouter()

	useEffect(() => {
		startTransition(async () => {

			try {
				const res = await getUser()

				if (res.user) {
					setUser(prev => ({
						...prev,
						...res.user
					}));
				}

			} catch (error) {
				console.error(error)
			}
		})
	}, []);

	const trailerSchema = z.object({
		city: z.string(),
		variant: z.enum(Object.keys(VariantEnum) as [keyof typeof VariantEnum]),
		trailerBrand: z.enum(Object.keys(TrailerBrandEnum) as [keyof typeof TrailerBrandEnum]),
		photos: z.array(
			z.custom<File>((val) => typeof window !== 'undefined' && val instanceof File, {
				message: 'Необходимо загрузить хотя бы одно фото',
			})
		).min(1, 'Необходимо загрузить хотя бы одно фото'),
		typeTechnic: z.enum(Object.keys(TypeTechnicEnum) as [keyof typeof TypeTechnicEnum]),
		typeTrailer: z.enum(Object.keys(TypeTrailerEnum) as [keyof typeof TypeTrailerEnum]),
		typeBrake: z.enum(Object.keys(TypeBrakeEnum) as [keyof typeof TypeBrakeEnum]).optional(),
		qtyAxis: z.enum(Object.keys(QtyAxisEnum) as [keyof typeof QtyAxisEnum]).optional(),
		typeSuspension: z.enum(Object.keys(TypeSuspensionEnum) as [keyof typeof TypeSuspensionEnum]).optional(),
		price: z.number().positive(),
		year: z.number().positive().int().min(1900, 'Введите год в 4-значном формате').max(new Date().getFullYear(), `Год не должен превышать ${new Date().getFullYear()}`), // Assuming year is a 4-digit number
		description: z.string().optional(),
		weight: z.preprocess(
			(val) => (val === '' || val === null || Number.isNaN(val) ? undefined : val),
			z.number().optional()
		),
		status: z.enum(Object.keys(StatusEnum) as [keyof typeof StatusEnum]).optional(),
		exist: z.enum(Object.keys(ExistEnum) as [keyof typeof ExistEnum]).optional(),
		userName: z.string().optional(),
		userPhone: z.string().optional(),
		whatsapp: z.string().optional().nullable(),
		telegram: z.string().optional().nullable(),
		viber: z.string().optional().nullable(),
		skype: z.string().optional().nullable(),
	});

	type ITrailer = z.infer<typeof trailerSchema>

	const form = useForm({
		resolver: zodResolver(trailerSchema),
		defaultValues: {
			city: undefined,
			variant: "TRAILER",
			trailerBrand: undefined,
			photos: [],
			typeTechnic: undefined,
			typeTrailer: undefined,
			typeBrake: undefined,
			qtyAxis: undefined,
			typeSuspension: undefined,
			weight: undefined,
			price: undefined,
			year: undefined,
			description: undefined,
			status: undefined,
			exist: undefined,

			userName: user?.name!,
			userPhone: user?.phone!,

			whatsapp: user?.whatsapp,
			telegram: user?.telegram,
			viber: user?.viber,
			skype: user?.skype,
		},
	})

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
		if (user?.telegram) {
			form.setValue('telegram', user.telegram);
		}
		if (user?.viber) {
			form.setValue('viber', user.viber);
		}
		if (user?.skype) {
			form.setValue('skype', user.skype);
		}
	}, [user, form]);

	useEffect(() => {
		const subscription = form.watch((value) => {
			const urls = (value.photos ?? [])
				.filter((file) => file instanceof File)
				.map((file) => URL.createObjectURL(file));

			return () => {
				urls.forEach((url) => URL.revokeObjectURL(url));
			};
		});

		return () => subscription.unsubscribe();
	}, [form]);




	const onSubmit = async (data: ITrailer) => {

		startTransition(async () => {

			try {
				const res = await addTrailer(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				router.replace('/dashboard/trade/trailer/my')
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении (полу-) прицепа', {
					position: 'top-center',
				})
			}
		})

	}

	const onError = (errors: FieldErrors) => {
		const firstErrorField = Object.keys(errors)[0];
		if (!firstErrorField) {
			toast.error("Пожалуйста, проверьте введённые данные.");
			return;
		}

		const error = errors[firstErrorField];
		const message =
			typeof error?.message === "string"
				? error.message
				: "Некорректные данные";

		toast.error(message, {
			position: "top-center",
			className: "center-toast",
			duration: 10000
		});

		console.error("Form validation errors:", errors);
	};
	const photos = form.watch("photos") || [];

	const addPhoto = (file: File) => {
		form.setValue("photos", [...photos, file], { shouldValidate: true });
		setOpen(false);
	};

	const removePhoto = (index: number) => {
		const newPhotos = [...photos];
		newPhotos.splice(index, 1);
		form.setValue("photos", newPhotos, { shouldValidate: true });
	};

	if (!user?.isRegistered) {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Размещение объявлений доступно по абонентской плате.</div>
				<Button
					className=' bg-(--dark-accent)'
					asChild
				>
					<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
				</Button>
			</div>
		)
	}

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5 pb-[60px]">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Продать (полу-) прицеп</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>

					<div className={cn('gap-4', photos.length ? 'grid-cols-2' : 'grid-cols-1', 'grid')}>
						{photos.map((photo: File, index: number) => (
							<div key={index} className="relative aspect-4/3 border rounded-lg overflow-hidden">
								<img
									src={URL.createObjectURL(photo)}
									alt={`Фото #${index + 1}`}
									className="absolute inset-0 w-full h-full object-cover z-0"
								/>
								<button
									type="button"
									onClick={() => removePhoto(index)}
									className="absolute top-2 right-2 bg-accent rounded-md w-9 h-9 flex items-center justify-center"
								>
									<X />
								</button>
							</div>
						))}

						{photos.length < 4 && (
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn('w-full h-full flex gap-3 justify-center items-center text-sm', photos.length ? 'aspect-4/3' : 'aspect-auto h-[36px]')}
									>
										<Plus /> Добавить фото
									</Button>
								</DialogTrigger>

								<DialogContent className="w-80">
									<DialogHeader>
										<DialogTitle className=' text-muted-foreground'>Добавить фото</DialogTitle>
									</DialogHeader>

									<div className="grid gap-2">
										<label
											htmlFor="take-photo"
											className="flex items-center gap-2 cursor-pointer py-2 hover:bg-accent rounded-md md:hidden px-4"
										>
											<Camera /> Сделать фото
											<input
												id="take-photo"
												type="file"
												accept="image/*"
												capture="environment"
												className="hidden"
												required={photos.length < 2}
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) addPhoto(file);
												}}
											/>
										</label>

										<label
											htmlFor="upload-photo"
											className="flex items-center gap-2 cursor-pointer py-2 hover:bg-accent rounded-md px-4"
										>
											<ImageUp /> Загрузить фото
											<input
												id="upload-photo"
												type="file"
												accept="image/*"
												className="hidden"
												required={photos.length < 2}
												onChange={(e) => {
													const file = e.target.files?.[0];
													if (file) addPhoto(file);
												}}
											/>
										</label>
									</div>

									{/* <DialogClose asChild>
										<Button className="mt-4 w-full">Закрыть</Button>
									</DialogClose> */}
								</DialogContent>
							</Dialog>
						)}
					</div>

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
					</div>

					<div className="grid sm:grid-cols-2 w-full gap-3 md:gap-5 items-start">

						<Controller
							control={form.control}
							name='typeTrailer'
							render={({ field }) => (

								<Select
									onValueChange={(value) => {
										field.onChange(value);
									}}
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

					<div className="grid sm:grid-cols-2 w-full gap-3 md:gap-5 items-start">
						<div className=" relative w-full">
							<Input
								type='number'
								placeholder="Грузоподъемность"
								className='text-sm'
								{...form.register('weight', { valueAsNumber: true })}
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
								т
							</span>
						</div>

						<div className=" relative w-full">
							<Input
								type='number'
								required
								placeholder="Год выпуска"
								className='text-sm'
								{...form.register('year', { valueAsNumber: true })}
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
								год
							</span>
						</div>
					</div>

					<div className="grid sm:grid-cols-2 w-full gap-3 md:gap-5 items-start">

						<div className=" relative w-full">
							<Input
								type='number'
								required
								placeholder="Цена"
								className='text-sm'
								{...form.register('price', { valueAsNumber: true })}
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">
								₸
							</span>
						</div>

						<div className=" relative w-full">
							<Input
								type='text'
								placeholder="Описание (необязательно)"
								className='text-sm'
								{...form.register('description')}
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">

							</span>
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
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) md:col-start-2 w-full'
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Добавить прицеп</>) : "Добавить (полу-) прицеп"}
						</Button>
					</div>

					{/* {user?.isRegistered ? (

						<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

							<Button
								type='submit'
								className=' bg-(--dark-accent) md:col-start-2 w-full'
								disabled={pending}
							>
								{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Добавить прицеп</>) : "Добавить (полу-) прицеп"}
							</Button>
						</div>
					) : (
						<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
							<div className="text-center">
								Размещение доступно по абонентской плате.
							</div>
							<Button className="bg-(--dark-accent)" asChild>
								<Link href="/dashboard/payment/pay-register">Перейти к оплате</Link>
							</Button>
						</div>
					)} */}


				</form>
			</CardContent>
		</Card>
	)
}
