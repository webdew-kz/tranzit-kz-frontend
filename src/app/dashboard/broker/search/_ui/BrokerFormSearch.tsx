"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { z } from "zod"
import { useTransition } from 'react';
import { BrokerServiceEnum } from '@/shared/types/broker.type';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useBrokerSearchStore } from '@/shared/store/useBrokerSearchStore';
import { findManyByFilter } from '../actions';
import { useUserStore } from '@/shared/store/useUserStore';

export default function BrokerFormSearch() {

	const { user } = useUserStore()

	const { setSearchBrokers } = useBrokerSearchStore()

	// const { brokers, setBrokers } = useBrokerStore()

	const [pending, startTransition] = useTransition()

	const brokerSchema = z.object({

		city: z.array(z.string()).optional(),
		note: z.string().optional(),
		brokerService: z.array(z.enum(Object.keys(BrokerServiceEnum) as [keyof typeof BrokerServiceEnum])).min(1),

		userName: z.string().min(1),
		userPhone: z.string().min(5),

		skype: z.string().nullable().default(''),
		telegram: z.string().nullable().default(''),
		viber: z.string().nullable().default(''),
		whatsapp: z.string().nullable().default('')
	});

	type IBroker = z.infer<typeof brokerSchema>

	const form = useForm({
		resolver: zodResolver(brokerSchema),
		defaultValues: {
			city: [],
			note: undefined,
			brokerService: undefined,

			userName: user?.name!,
			userPhone: user?.phone!,

			whatsapp: user?.whatsapp,
			telegram: user?.telegram,
			viber: user?.viber,
			skype: user?.skype,
		},
	})

	const onSubmit = async (data: IBroker) => {

		startTransition(async () => {

			try {
				const res = await findManyByFilter(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				setSearchBrokers(res.brokers)
				// setBrokers([])
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении', {
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
				<CardTitle className='text-xl text-center'>Поиск объявлений</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className="grid sm:grid-cols-3 w-full gap-3 md:gap-5 items-start">
						{/* <Controller
							control={form.control}
							name="brokerService"
							render={({ field }) => (
								<MultiSelect
									options={BrokerServiceEnum}
									value={field.value}
									onChange={field.onChange}
									placeholder="Выберите услуги"
								/>
							)}
						/> */}

						<Input
							type='text'
							placeholder="Город"
							className='text-sm'
							{...form.register('city')}
						/>
					</div>

					<Button
						type='submit'
						className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
						disabled={pending}
					>
						{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти объявление</>) : "Найти объявление"}
					</Button>
				</form>
			</CardContent>
		</Card >
	)
}
