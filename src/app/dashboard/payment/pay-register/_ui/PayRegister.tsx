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

	const price = 1000;

	useCloudPayments()

	const paymentPublicId = 'pk_9cba1fd1be39c1e60da521409a1c9'

	const { user, setUser } = useUserStore()

	const [pending, startTransition] = useTransition()

	const paymentSchema = z.object({
		amount: z.number().min(price)
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
							description: 'Ежемесячная абонплата tranzit.kz',
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
		toast.error(errors.message ?? `Минимум ${price} ₸`, {
			position: 'top-center',
		})
		console.error(errors);

	};

	const amount = form.watch('amount')

	return (
		<Card className="w-[calc(100vw-32px)] max-w-full   p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Ежемесячная абонплата</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<p>Абонентская плата предоставляет право размещать, копировать, редактировать и удалять собственные объявления, а также открывает доступ к контактной информации в чужих объявлениях.</p>
					<div className="grid items-start justify-center w-full">
						<Button
							type='submit'
							className='bg-(--dark-accent) w-full sm:w-auto'
							disabled={pending}
						>
							Оплатить {price} ₸
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
