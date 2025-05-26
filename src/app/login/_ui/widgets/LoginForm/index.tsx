'use client'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
} from "@/shared/components/ui/form"
import { Button } from '@/shared/components/ui/button'
import ru from 'react-phone-input-2/lang/ru.json'
import { toast } from 'sonner'
import { useState, useTransition } from 'react'
import { Input } from '@/shared/components/ui/input'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { ILoginForm } from '../../../types'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/shared/store/useUserStore'

const schemaPhone = z.object({
	phone: z.string().refine(
		(val) => isValidPhoneNumber("+" + val),
		{ message: 'Некорректный номер' }
	),
	password: z.string().min(6, {
		message: "Пароль должен быть не менее 6 символов",
	})
})

type FormPhoneValues = z.infer<typeof schemaPhone>

const schemaEmail = z.object({
	email: z.string().email({
		message: "Некорректный email",
	}),
	password: z.string().min(6, {
		message: "Пароль должен быть не менее 6 символов",
	})
})

type FormEmailValues = z.infer<typeof schemaEmail>


export default function LoginForm() {


	const { setUser } = useUserStore()

	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [pending, startTransition] = useTransition()
	const router = useRouter()

	const formPhone = useForm<FormPhoneValues>({
		resolver: zodResolver(schemaPhone),
		defaultValues: {
			phone: "",
			password: "",
		},
	})

	const formEmail = useForm<FormEmailValues>({
		resolver: zodResolver(schemaEmail),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	function onSubmitPhone(values: FormPhoneValues) {

		setLoading(true)

		startTransition(async () => {

			try {

				const sendData: ILoginForm = {
					login: values.phone,
					password: values.password
				}

				const res = await fetch("/api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(sendData),
					credentials: "include", // обязательно
				});

				const data = await res.json();

				if (data.user) {
					setUser(data.user); // сохраняем пользователя
					localStorage.setItem("accessToken", data.token);
					toast.success(data.message, { position: "top-center" });
					router.push("/dashboard");
				} else {
					toast.error(data.message ?? "Ошибка авторизации", { position: "top-center" });
				}

				router.push('/dashboard')

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при авторизации', {
					position: 'top-center',
				})
			} finally {
				setLoading(false)
			}
		})

	}

	const onErrorPhone = (errors: any) => {
		toast.error(errors.phone?.message ?? 'Ошибка валидации формы', {
			position: 'top-center',
		});
	};

	function onSubmitEmail(values: FormEmailValues) {
		setLoading(true);

		startTransition(async () => {
			try {
				const sendData: ILoginForm = {
					login: values.email,
					password: values.password,
				};

				const res = await fetch("/api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(sendData),
					credentials: "include", // обязательно
				});

				const data = await res.json();

				if (data.user) {
					setUser(data.user); // сохраняем пользователя
					localStorage.setItem("accessToken", data.token);
					toast.success(data.message, { position: "top-center" });
					router.push("/dashboard");
				} else {
					toast.error(data.message ?? "Ошибка авторизации", { position: "top-center" });
				}
			} catch (error) {
				console.error(error);
				toast.error("Ошибка при авторизации", { position: "top-center" });
			} finally {
				setLoading(false);
			}
		});
	}


	function onErrorEmail(errors: any) {
		toast.error(errors.email?.message ?? 'Некорректный email', {
			position: 'top-center',
		})
	}

	return (
		<>
			<Tabs defaultValue="phone" className="w-full">
				<TabsList className='grid w-full grid-cols-2 mb-4'>
					<TabsTrigger
						value="phone"
						className='dark:data-[state=active]:bg-background border-0 text-[10px]'
					>Номер телефона</TabsTrigger>
					<TabsTrigger
						value="email"
						className='dark:data-[state=active]:bg-background border-0 text-[10px]'
					>Email</TabsTrigger>
				</TabsList>
				<TabsContent value="phone">
					<div className="w-full flex flex-col gap-6 justify-center">
						<Form {...formPhone}>
							<form onSubmit={formPhone.handleSubmit(onSubmitPhone, onErrorPhone)} className="w-full flex flex-col gap-2">
								<FormField
									control={formPhone.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormDescription>Введите номер телефона</FormDescription>
											<FormControl>
												<PhoneInput
													localization={ru}
													country="kz"
													containerClass="!w-full dark:!bg-background"
													inputClass="!rounded-lg !h-[36px] !lh-[36px] !overflow-hidden dark:!bg-input/30 !border-input !w-full"
													enableSearch={true}
													disableSearchIcon={true}
													searchPlaceholder='Поиск'
													searchClass='dark:!bg-background'
													dropdownClass='dark:!bg-background '
													buttonClass="dark:!bg-background !border-input"
													buttonStyle={{ borderRadius: '8px 0 0 8px' }}
													disableCountryGuess={true}
													placeholder="Номер телефона"
													value={field.value}
													onChange={(value) => field.onChange(value)}
													disabled={pending}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={formPhone.control}
									name="password"
									render={() => (
										<FormItem>
											<FormDescription>Введите пароль</FormDescription>
											<FormControl className='justify-center'>
												<div className=' flex flex-row gap-2'>
													<Input
														type={showPassword ? 'text' : 'password'}
														value={formPhone.watch('password')}
														placeholder='Не менее 6 символов'
														onChange={(event) => formPhone.setValue('password', event.target.value)}
														className='!rounded-md !h-[36px] !lh-[36px] !overflow-hidden leading-[36px]'
														disabled={pending}
													/>
													<Button
														type='button'
														variant="outline"
														size="icon"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? <Eye /> : <EyeOff />}
													</Button>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button
									type='submit'
									className='w-full bg-(--dark-accent) mt-4'
									disabled={pending}
								>
									{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Войти</>) : "Войти"}
								</Button>
							</form>
						</Form>
					</div>
				</TabsContent>
				<TabsContent value="email">
					<div className="w-full flex flex-col gap-6 justify-center">
						<Form {...formEmail}>
							<form onSubmit={formEmail.handleSubmit(onSubmitEmail, onErrorEmail)} className="w-full flex flex-col gap-2">
								<FormField
									control={formEmail.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormDescription>Введите email</FormDescription>
											<FormControl>
												<Input
													className=' !rounded-md !h-[36px] !lh-[36px] !overflow-hidden focus:outline-0'
													type='email'
													value={field.value}
													onChange={(event) => field.onChange(event.target.value)}
													placeholder='user@tranzit.kz'
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={formEmail.control}
									name="password"
									render={() => (
										<FormItem>
											<FormDescription>Введите пароль</FormDescription>
											<FormControl className='justify-center'>
												<div className=' flex flex-row gap-2'>
													<Input
														type={showPassword ? 'text' : 'password'}
														value={formEmail.watch('password')}
														placeholder='Не менее 6 символов'
														onChange={(event) => formEmail.setValue('password', event.target.value)}
														className='!rounded-md !h-[36px] !lh-[36px] !overflow-hidden '
													/>
													<Button
														type='button'
														variant="outline"
														size="icon"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? <Eye /> : <EyeOff />}
													</Button>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button
									type='submit'
									className='w-full bg-(--dark-accent) mt-4'
									disabled={pending}
								>
									{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Войти</>) : "Войти"}
								</Button>
							</form>
						</Form>
					</div>
				</TabsContent>
			</Tabs>
		</>
	)
}
