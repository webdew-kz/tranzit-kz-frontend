"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { z } from "zod"
import { useTransition } from 'react';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import { useUserStore } from '@/shared/store/useUserStore';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addReview } from '../actions';
import { Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/shared/components/ui/textarea';
import Link from 'next/link';
import useCloudPayments from '@/shared/hooks/useCloudPayments';


export default function ReviewFormAdd() {

	const price = 1000;

	const router = useRouter()

	useCloudPayments()

	const paymentPublicId = 'pk_9cba1fd1be39c1e60da521409a1c9'

	const { user } = useUserStore()

	const [pending, startTransition] = useTransition()

	const tagsValue = {
		'Порядочный 👍': 'Порядочный 👍',
		'Надёжный 👍': 'Надёжный 👍',
		'Ответственный 👍': 'Ответственный 👍',
		'Рекомендую 👍': 'Рекомендую 👍',
		'Пунктуальный 👍': 'Пунктуальный 👍',
		'Вежливый 👍': 'Вежливый 👍',
		'Честный 👍': 'Честный 👍',
		'Коммуникабельный 👍': 'Коммуникабельный 👍',
		'Кидала 👎': 'Кидала 👎',
		'Мошенник 👎': 'Мошенник 👎',
		'Обманщик 👎': 'Обманщик 👎',
		'Недобросовестный 👎': 'Недобросовестный 👎',
		'Грубый 👎': 'Грубый 👎',
		'Опаздывает 👎': 'Опаздывает 👎',
		'Не выходит на связь 👎': 'Не выходит на связь 👎',
		'Нарушает договорённости 👎': 'Нарушает договорённости 👎',
	}

	const reviewSchema = z.object({
		iin: z.preprocess((val) => {
			if (typeof val === 'string') {
				// Удаляем все символы кроме цифр
				return val.replace(/[^\d]/g, '')
			}
			return val
		}, z.string().min(11, { message: 'минимум 11 цифр если номер телефона, 12 цифр если ИИН' })),
		title: z.string().optional(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		value: z.number(),
		amount: z.number().min(price)

	});


	type IReview = z.infer<typeof reviewSchema>

	const form = useForm({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			iin: undefined,
			title: undefined,
			description: undefined,
			tags: [],
			value: 0,
			amount: price
		},
	})

	// const onSubmit = async (data: IReview) => {

	// 	startTransition(async () => {

	// 		try {
	// 			const res = await addReview(data)

	// 			toast.success(res.message, {
	// 				position: 'top-center',
	// 			})

	// 			// updateBalance((user?.balance ?? 0) - price)

	// 			router.replace('/dashboard/review/my')
	// 		} catch (error) {
	// 			console.error(error)
	// 			toast.error('Ошибка при добавлении отзыва', {
	// 				position: 'top-center',
	// 			})
	// 		}
	// 	})

	// }

	const onSubmit = async (data: IReview) => {

		startTransition(async () => {

			try {

				if (typeof window !== "undefined" && "tiptop" in window) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const widget = new (window as any).tiptop.Widget(); // <--- Кастомный тип `any`
					widget.pay('charge',
						{
							publicId: paymentPublicId,
							description: 'Добавиль отзыв/жалобу на itranzit.kz',
							amount: data.amount,
							currency: 'KZT',
							skin: "modern",
							autoClose: 3,
							data: { myProp: 'myProp value' }
						},
						{
							onSuccess: async function () {
								const res = await addReview(data)

								toast.success(res.message, {
									position: 'top-center',
								})

								// Дать время Next.js на переход
								setTimeout(() => {
									router.replace('/dashboard/review/my')
								}, 500);
							},
							onFail: function () {
								toast.error('Ошибка платежа', {
									position: 'top-center',
								})
							},
						}
					);
				} else {
					throw new Error("CloudPayments SDK не загружен");
				}

			} catch (error) {
				console.error(error)
				toast.error('Ошибка платежа', {
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

	if (!user?.isRegistered) {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Размещение отзыва/жалобы доступно по абонентской плате.</div>
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
				<CardTitle className='text-xl text-center'>Добавить отзыв</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className='grid w-full gap-3 md:gap-5 md:grid-cols-2 items-start'>
						<Input
							type='text'
							placeholder="Укажите номер телефона или ИИН/БИН"
							className='text-sm'
							required
							{...form.register('iin')}
						/>

						<Input
							type='text'
							placeholder="Укажите ФИО/Компанию"
							className='text-sm'

							{...form.register('title')}
						/>

					</div>

					<div className='grid w-full gap-2 md:gap-3 items-start'>
						<span className='grid w-full gap-1'>
							<span className=' text-xs text-(--dark-accent)'>
								ВНИМАНИЕ!
							</span>
							<span className=' text-xs text-(--dark-accent)'>
								Запрещены оскорбления и нецензурная лексика.
								В случае нарушения ваш отзыв будет заблокирован без возврата денежных средств.
							</span>
						</span>
						<Textarea
							placeholder="Добавьте комментарий"
							rows={4}
							className="text-sm"
							{...form.register('description')}
						/>

					</div>

					<div className='grid w-full gap-3 md:gap-5 items-start '>
						<Controller
							control={form.control}
							name="tags"
							render={({ field }) => (

								<MultiSelect
									options={tagsValue}
									value={field.value || []}
									onChange={field.onChange}
									placeholder="Выберите теги"
								/>
							)}
						/>

						<Controller
							name="value"
							control={form.control}
							render={({ field }) => (
								<div className="flex items-center gap-1 justify-center pt-2 pb-4">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											size={24}
											onClick={() => field.onChange(star)}
											fill={star <= field.value ? '#b4802e' : 'none'}
											stroke={star <= field.value ? '#b4802e' : '#b4802e'}
											className="cursor-pointer transition-transform hover:scale-110"
										/>
									))}
								</div>
							)}
						/>

					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) md:col-start-2 w-full'
							disabled={pending}
						>
							{pending ? (
								<>
									<Loader2 className="animate-spin stroke-accent" />
									Отправляю ...
								</>
							) : (
								`Отправить за ${price} ₸`
							)}
						</Button>
					</div>

					{/* {user?.isRegistered ? (
						(user?.balance ?? 0) < price && (
							<>
								<div className="grid sm:grid-cols-2 md:grid-cols-3 w-full gap-3 md:gap-5 items-center">
									<div className="md:col-start-2 text-center">
										Ваш баланс: {user?.balance?.toLocaleString('ru-RU') ?? 0} ₸
									</div>
								</div>

								<div className="grid sm:grid-cols-2 md:grid-cols-3 w-full gap-3 md:gap-5 items-center">
									<Button
										variant="outline"
										className="w-full md:col-start-2"
										asChild
									>
										<Link
											href="/dashboard/payment/add"
											className="flex gap-3 items-center justify-center text-(--dark-accent)"
										>
											Пополнить баланс
										</Link>
									</Button>
								</div>
							</>
						)
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

