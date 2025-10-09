"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useEffect, useState, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { BrokerServiceEnum } from '@/shared/types/broker.type';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { TimePicker } from '@/shared/components/widgets/TimePicker';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { editBroker } from '../actions';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/shared/store/useUserStore';



export default function BrokerFormEdit({ id }: { id?: string }) {

	const [broker, setBroker] = useState<Broker>({} as Broker)

	const router = useRouter()
	const { user } = useUserStore()
	if (!user?.isRegistered && user?.role === 'USER') {
		router.replace('/dashboard')
	}

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('accessToken')

			const res = await fetch(`${process.env.SERVER_URL}/broker/${id}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			})

			if (!res.ok) {
				console.log(res.statusText);
				router.push('/not-found')
			}

			const data = await res.json()

			setBroker(data)

		}

		fetchData()
	}, [id])

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

	type Broker = z.infer<typeof brokerSchema>

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


	useEffect(() => {
		if (broker) {
			form.reset({
				...(broker.city != null && { city: broker.city }),
				...(broker.brokerService != null && { brokerService: broker.brokerService }),
				...(broker.note != null && { note: broker.note }),
				...(broker.userName != null && { userName: broker.userName }),
				...(broker.userPhone != null && { userPhone: broker.userPhone }),
				...(broker.whatsapp != null && { whatsapp: broker.whatsapp }),
			},)
		}
	}, [broker, form])


	const onSubmit = async (data: Broker) => {

		startTransition(async () => {

			try {
				const res = await editBroker(data, id!)

				toast.success(res.message, {
					position: 'top-center',
				})


				setBroker(res.updatedBroker)

				router.push('/dashboard/broker/my')


			} catch (error) {
				console.error(error)
				toast.error('Ошибка при сохранении', {
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

	const { setValue, watch } = form;

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5 pb-[60px]">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Редактировать объявление</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className="grid sm:grid-cols-3 w-full gap-3 md:gap-5 items-start">
						<Controller
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
						/>

						<Input
							type='text'
							placeholder="Подробнее (необязательно)"
							className='text-sm'
							{...form.register('note')}
						/>

						<MultiCityInput
							values={watch('city') || []}
							onChange={(v) => setValue('city', v)}
							placeholder="Город"
						/>
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-3  w-full gap-3 md:gap-5 items-start">

						<Input
							type="text"
							placeholder="Имя"
							className="text-sm"
							required
							{...form.register('userName')}
						/>

						<Input
							type="text"
							placeholder="Телефон"
							className="text-sm"
							required
							{...form.register('userPhone')}
						/>

						<Button
							type='submit'
							className=' bg-(--dark-accent)'
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Сохранить</>) : "Сохранить"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
