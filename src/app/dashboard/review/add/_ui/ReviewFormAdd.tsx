"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useEffect, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
// import { AdditionallyEnum, CurrencyEnum, DocumentsAdrEnum, DocumentsEnum, LoadingsEnum, LoadingTypeEnum, PaymentMethodEnum, PaymentOtherEnum, PaymentPeriodEnum, TermsEnum, TermsPalletsTypeEnum, TruckTypeEnum } from '@/shared/types/review.type';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { TimePicker } from '@/shared/components/widgets/TimePicker';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { useUserStore } from '@/shared/store/useUserStore';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addReview } from '../actions';
import { Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { cn } from '@/shared/lib/utils';
import { Textarea } from '@/shared/components/ui/textarea';
import Link from 'next/link';


export default function ReviewFormAdd() {

	const { user, updateBalance } = useUserStore()

	const [pending, startTransition] = useTransition()

	const price = 1000

	const router = useRouter()

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
		}, z.string().length(11, { message: 'минимум 11 цифр если номер телефона, 12 цифр если ИИН' })),
		title: z.string().optional(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		value: z.number()

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
		},
	})

	const onSubmit = async (data: IReview) => {

		startTransition(async () => {

			try {
				const res = await addReview(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				updateBalance((user?.balance ?? 0) - price)

				router.replace('/dashboard/review/my')
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении отзыва', {
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
							disabled={pending || (user?.balance ?? 0) < price}
						>
							{pending ? (
								<>
									<Loader2 className="animate-spin stroke-accent" />
									Отправляю ...
								</>
							) : (user?.balance ?? 0) < price ? (
								"Недостаточно средств"
							) : (
								`Отправить за ${price} ₸`
							)}
						</Button>
					</div>

					{user?.isRegistered ? (
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
								Размещение доступно по абонентской плате — 1000 тенге в месяц.
							</div>
							<Button className="bg-(--dark-accent)" asChild>
								<Link href="/dashboard/payment/pay-register">Перейти к оплате</Link>
							</Button>
						</div>
					)}

				</form>
			</CardContent>
		</Card>
	)
}

