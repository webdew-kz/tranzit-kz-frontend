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
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';

export default function BrokerFormSearch() {

	const { setSearchBrokers } = useBrokerSearchStore()

	const [pending, startTransition] = useTransition()

	const brokerSchema = z.object({

		city: z.array(z.string()).optional(),
		note: z.string().optional(),
		brokerService: z.array(z.enum(Object.keys(BrokerServiceEnum) as [keyof typeof BrokerServiceEnum])).optional(),
	});

	type IBroker = z.infer<typeof brokerSchema>

	const form = useForm({
		resolver: zodResolver(brokerSchema),
		defaultValues: {
			city: [],
			note: undefined,
			brokerService: []

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
					className=' grid md:grid-cols-3 gap-3 md:gap-5 w-full'
				>
					<div className='grid'>
						<Input
							type='text'
							placeholder="Город"
							className='text-sm'
							{...form.register('city')}
						/>
					</div>

					<div className='grid truncate'>
						<Controller
							control={form.control}
							name="brokerService"
							render={({ field }) => (
								<MultiSelect
									options={BrokerServiceEnum}
									value={field.value || []}
									onChange={field.onChange}
									placeholder="Выберите услуги"
								/>
							)}
						/>
					</div>

					<div className='grid'>
						<Button
							type='submit'
							className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти объявление</>) : "Найти объявление"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card >
	)
}
