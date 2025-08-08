"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { z } from "zod"
import { useTransition } from 'react';
import { useUserStore } from '@/shared/store/useUserStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { payRegister } from '../actions';
import useCloudPayments from '@/shared/hooks/useCloudPayments';


export default function PayRegister() {

	useCloudPayments()

	const paymentPublicId = 'test_api_00000000000000000000002'

	const { user, setUser } = useUserStore()

	const [pending, startTransition] = useTransition()

	const price = 1000;

	const paymentSchema = z.object({
		amount: z.number().min(1000)
	});


	type IPayment = z.infer<typeof paymentSchema>

	const form = useForm({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			amount: price
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
							description: 'Оплата за регистрацию tranzit.kz',
							amount: data.amount,
							currency: 'KZT',
							skin: "modern",
							autoClose: 3,
							data: { myProp: 'myProp value' }
						},
						{
							onSuccess: async function () {
								const res = await payRegister(data)

								if (user) {
									setUser({
										...user,
										isRegistered: true,
									});
								}

								toast.success(res.message, {
									position: 'top-center',
								})
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
		<Card className="w-[calc(100vw-32px)] max-w-full sm:max-w-xs  p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Ежемесячная абонплата</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className="grid items-start justify-center w-full">
						<Button
							type='submit'
							className='bg-(--dark-accent) w-[320px]'
							disabled={pending}
						>
							Оплатить 1 000 ₸
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
