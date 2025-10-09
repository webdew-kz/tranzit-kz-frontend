"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useEffect, useTransition } from 'react';
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogClose } from '@/shared/components/ui/dialog';
import { BrokerServiceEnum } from '@/shared/types/broker.type';
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { TimePicker } from '@/shared/components/widgets/TimePicker';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { useUserStore } from '@/shared/store/useUserStore';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addBroker, getUser } from '../actions';
import { Loader2 } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/shared/components/widgets/Loader';


export default function BrokerFormAdd() {


	const [pending, startTransition] = useTransition()

	const router = useRouter()

	const { user, isInitialized, setUser } = useUserStore()

	useEffect(() => {
		startTransition(async () => {

			try {
				const res = await getUser()

				if (res.user) {
					setUser(prev => ({
						...prev,
						...res.user
					}));

					console.log(res.user);
				}



			} catch (error) {
				console.error(error)
			}
		})
	}, []);

	const brokerSchema = z.object({

		city: z.array(z.string()).min(1),
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
			city: [''],
			note: undefined,
			brokerService: [],

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



	const onSubmit = async (data: IBroker) => {

		startTransition(async () => {

			try {
				const res = await addBroker(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				router.replace('/dashboard/broker/my')
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при добавлении объявления', {
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

	if (!isInitialized) {
		return (
			<Loader />
		)
	}

	if (!user?.isRegistered) {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Размещение объявлений доступно по ежемесячной абонентской плате.</div>
				<Button
					className=' bg-(--dark-accent)'
					asChild
				>
					<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
				</Button>
			</div>
		)
	}

	const { setValue, watch } = form;

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5 pb-[60px]">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Добавить объявление</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid md:grid-cols-3 gap-3 md:gap-5'
				>


					<div>
						<MultiCityInput
							values={watch('city') || []}
							onChange={(v) => setValue('city', v)}
							placeholder="Город"
						/>
					</div>

					<div>
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

					<div>
						<Input
							type='text'
							placeholder="Подробнее (необязательно)"
							className='text-sm'
							{...form.register('note')}
						/>
					</div>

					<div className="grid md:grid-cols-2  w-full gap-3 md:gap-5 items-start">

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

					</div>

					<div className="grid md:grid-cols-3  w-full gap-3 md:gap-5 items-start">
						<Button
							type='submit'
							className=' bg-(--dark-accent) md:col-start-2 w-full'
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Добавить объявление</>) : "Добавить объявление"}
						</Button>
					</div>


				</form>
			</CardContent>
		</Card>
	)
}
