"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { z } from "zod"
import { useTransition } from 'react';
import { useUserStore } from '@/shared/store/useUserStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { create } from '../actions';
import { useRouter } from 'next/navigation';
import useCloudPayments from '@/shared/hooks/useCloudPayments';


export default function PaymentFormAdd() {

	useCloudPayments()

	const paymentPublicId = 'pk_9cba1fd1be39c1e60da521409a1c9'

	const { updateBalance } = useUserStore.getState();

	const [pending, startTransition] = useTransition()

	const router = useRouter()
	const { user } = useUserStore()
	if (!user?.isRegistered) {
		router.replace('/dashboard')
	}

	const tagsValue = [1000, 2000, 5000, 10000]

	const paymentSchema = z.object({
		amount: z.number().min(1000)
	});


	type IPayment = z.infer<typeof paymentSchema>

	const form = useForm({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			amount: undefined
		},
	})

	const onSubmit = async (data: IPayment) => {

		startTransition(async () => {

			try {

				if (typeof window !== "undefined" && "tiptop" in window) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const widget = new (window as any).tiptop.Widget(); // <--- Кастомный тип `any`
					widget.pay('charge',
						{
							publicId: paymentPublicId,
							description: 'Пополнение баланса tranzit.kz',
							amount: data.amount,
							currency: 'KZT',
							skin: "modern",
							autoClose: 3,
							data: { myProp: 'myProp value' }
						},
						{
							onSuccess: async function () {
								const res = await create(data)

								updateBalance(res.balance)

								toast.success(res.message, {
									position: 'top-center',
								})

								router.replace('/dashboard/payment/my')
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
		toast.error(errors.message ?? 'Минимум 1 000 ₸', {
			position: 'top-center',
		})
		console.error(errors);

	};

	const amount = form.watch('amount')

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Пополнить баланс</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className='grid w-full gap-3 md:gap-5 items-start'>
						<Input
							type='number'
							placeholder="Введите сумму (минимум 1000 ₸)"
							className='text-sm'
							required
							{...form.register('amount', { valueAsNumber: true })}
						/>
						<div className="grid grid-cols-2 gap-2 items-center">
							{tagsValue.map(value => (
								<Button
									key={value}
									variant={value === amount ? 'default' : 'outline'}
									className='w-full border border-(--dark-accent) rounded-2xl'
									onClick={() => form.setValue('amount', value, { shouldValidate: true })}
								>
									{value}
								</Button>
							))}
						</div>
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) md:col-start-2 w-full'
							disabled={pending}
						>
							Пополнить
						</Button>
					</div>

				</form>
			</CardContent>
		</Card>
	)
}
