"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { z } from "zod"
import { useEffect, useState, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Camera, ImageUp, Loader2, Plus, X } from 'lucide-react';
import { editParts, getParts } from '../actions';
import { useRouter } from 'next/navigation';
import { IParts, StatusEnum, PartsBrandEnum } from '@/shared/types/parts.type';
import { useUserStore } from '@/shared/store/useUserStore';
import { cn } from '@/shared/lib/utils';
import { CityInput } from '@/shared/components/widgets/CityInput';
import Loader from '@/shared/components/widgets/Loader';



export default function PartsFormEdit({ id }: { id: string }) {

	const [parts, setParts] = useState<IParts>({} as IParts)

	const [loading, setLoading] = useState(true)

	const [oldPhotos, setOldPhotos] = useState<string[]>([])

	const [pending, startTransition] = useTransition()

	const [open, setOpen] = useState(false)

	const { user } = useUserStore()

	const router = useRouter()



	useEffect(() => {
		const fetchParts = (id: string) => {

			startTransition(async () => {
				const res = await getParts(id)

				setParts(res.parts)

				setOldPhotos(res.parts.photos || [])

				setLoading(false)
			})

		}

		fetchParts(id)
	}, [id])

	const partsSchema = z.object({
		city: z.string(),
		brand: z.enum(Object.keys(PartsBrandEnum) as [keyof typeof PartsBrandEnum]),
		photos: z.array(
			z.custom<File>((val) => typeof window !== 'undefined' && val instanceof File, {
				message: 'Необходимо загрузить хотя бы одно фото',
			})
		).min(1, 'Необходимо загрузить хотя бы одно фото'),
		price: z.number().positive(),
		title: z.string().optional(),
		description: z.string().optional(),
		status: z.enum(Object.keys(StatusEnum) as [keyof typeof StatusEnum]).optional(),
		isDelivery: z.boolean().optional(),
		userName: z.string().optional(),
		userPhone: z.string().optional(),
		whatsapp: z.string().optional().nullable(),
		telegram: z.string().optional().nullable(),
		viber: z.string().optional().nullable(),
		skype: z.string().optional().nullable(),
	});

	type IParts = z.infer<typeof partsSchema>

	const form = useForm({
		resolver: zodResolver(partsSchema),
		defaultValues: {
			city: undefined,
			brand: undefined,
			photos: [],
			price: undefined,
			title: undefined,
			description: undefined,
			status: undefined,
			isDelivery: undefined,

			userName: user?.name!,
			userPhone: user?.phone!,

			whatsapp: user?.whatsapp,
			telegram: user?.telegram,
			viber: user?.viber,
			skype: user?.skype,
		},
	})


	useEffect(() => {

		if (parts) {
			form.reset({
				...(parts.city !== null && { city: parts.city }),
				...(parts.price !== null && { price: parts.price }),
				...(parts.title !== null && { title: parts.title }),
				...(parts.description !== null && { description: parts.description }),
				...(parts.status !== null && { status: parts.status as unknown as keyof typeof StatusEnum }),
				...(parts.brand !== null && { brand: parts.brand as unknown as keyof typeof PartsBrandEnum }),
				...(parts.userName !== null && { userName: parts.userName ?? user?.name ?? '' }),
				...(parts.userPhone !== null && { userPhone: parts.userPhone ?? user?.phone ?? '' }),
				...(parts.whatsapp !== null && { whatsapp: parts.whatsapp }),
				...(parts.telegram !== null && { telegram: parts.telegram }),
				...(parts.viber !== null && { viber: parts.viber }),
				...(parts.skype !== null && { skype: parts.skype }),
			});
		}


	}, [parts, form]);



	const onSubmit = async (data: IParts) => {

		startTransition(async () => {

			console.log(oldPhotos);


			try {
				const res = await editParts(data, id!, oldPhotos)

				toast.success(res.message, {
					position: 'top-center',
				})


				// setParts(res.parts)


				// setOldPhotos(res.parts.photos || [])

				router.push('/dashboard/trade/parts/my')


			} catch (error) {
				console.error(error)
				toast.error('Ошибка при сохранении запчасти', {
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

	if (pending || loading) {
		return <Loader />
	}

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Редактировать запчасть</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>

					<div className={cn('gap-4', [...oldPhotos, ...photos].length > 0 ? 'grid-cols-2' : 'grid-cols-1', 'grid')}>
						{[...oldPhotos, ...photos].length > 0 && (
							<>
								{oldPhotos.map((photo, index) => (
									<div key={`old-${index}`} className="relative aspect-4/3 border rounded-lg overflow-hidden">
										<img
											src={`${process.env.SERVER_URL}${photo}`}
											alt={`Старое фото #${index + 1}`}
											className="absolute inset-0 w-full h-full object-cover z-0"
										/>
										<button
											type="button"
											onClick={() => setOldPhotos(oldPhotos.filter((_, i) => i !== index))}
											className="absolute top-2 right-2 bg-accent rounded-md w-9 h-9 flex items-center justify-center"
										>
											<X />
										</button>
									</div>
								))}

								{photos.map((photo, index) => (
									<div key={`new-${index}`} className="relative aspect-4/3 border rounded-lg overflow-hidden">
										<img
											src={URL.createObjectURL(photo)}
											alt={`Новое фото #${index + 1}`}
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
							</>
						)}



						{[...oldPhotos, ...photos].length < 4 && (
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={cn('w-full h-full flex gap-3 justify-center items-center text-sm', [...oldPhotos, ...photos].length > 0 ? 'aspect-4/3' : 'aspect-auto h-[36px]')}
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
												required={photos.length < 1}
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
												required={photos.length < 1}
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
							name="brand"
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
										{Object.entries(PartsBrandEnum).map(([key, label]) => (
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
								type='text'
								required
								placeholder="Название"
								className='text-sm'
								{...form.register('title')}
							/>
							<span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--dark-accent) pointer-events-none">

							</span>
						</div>

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
					</div>

					<div className="grid w-full gap-3 md:gap-5 items-start">

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

					<div className="grid grid-cols-2 w-full gap-3 md:gap-5 items-center">


						<div className="relative w-full flex items-center gap-2">
							<input
								type="checkbox"
								id="isDelivery"
								className="text-sm"
								{...form.register('isDelivery')}
							/>
							<label htmlFor="isDelivery" className="text-sm">
								Есть доставка?
							</label>
						</div>

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
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Сохраняю</>) : "Сохранить изменения"}
						</Button>
					</div>

				</form>
			</CardContent>
		</Card>
	)
}
