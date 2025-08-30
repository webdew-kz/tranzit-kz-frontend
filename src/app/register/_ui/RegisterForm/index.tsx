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
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useEffect, useState, useTransition } from 'react'
import { auth } from '@/shared/lib/firebase'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp'
import { Input } from '@/shared/components/ui/input'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { isExistingUser, isExistingUserForEmail, registerAction, RegisterFormProps } from '@/app/register/actions'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/shared/store/useUserStore'

const schemaPhone = z.object({
	phone: z.string().refine(
		(val) => isValidPhoneNumber("+" + val),
		{ message: 'Некорректный номер' }
	),
})

type FormPhoneValues = z.infer<typeof schemaPhone>

const schemaOtp = z.object({
	otp: z.string().min(4, {
		message: "Введите 6-ти значный код",
	}),
})

type FormOtpValues = z.infer<typeof schemaOtp>

const schemaPass = z.object({
	password: z.string().min(4, {
		message: "Пароль должен быть не менее 4 символов",
	})
})

type FormPassValues = z.infer<typeof schemaPass>

const schemaEmail = z.object({
	email: z.string().email({
		message: "Некорректный email",
	})
})

type FormEmailValues = z.infer<typeof schemaEmail>


export default function RegisterForm() {

	const { setUser } = useUserStore()

	const [formdata, setFormData] = useState<RegisterFormProps>({
		login: '',
		password: ''
	})

	const [stepPhoneRegister, setStepPhoneRegister] = useState<'phone' | 'code' | 'password'>('phone')
	const [stepEmailRegister, setStepEmailRegister] = useState<'email' | 'code' | 'password'>('email')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [pending, startTransition] = useTransition()
	const [code, setCode] = useState<string>('')
	const router = useRouter()

	const formPhone = useForm<FormPhoneValues>({
		resolver: zodResolver(schemaPhone),
		defaultValues: {
			phone: "",
		},
	})

	const formOtp = useForm<FormOtpValues>({
		resolver: zodResolver(schemaOtp),
		defaultValues: {
			otp: "",
		},
	})

	const formOtpEmail = useForm<FormOtpValues>({
		resolver: zodResolver(schemaOtp),
		defaultValues: {
			otp: "",
		},
	})

	const formPass = useForm<FormPassValues>({
		resolver: zodResolver(schemaPass),
		defaultValues: {
			password: "",
		},
	})

	const formEmail = useForm<FormEmailValues>({
		resolver: zodResolver(schemaEmail),
		defaultValues: {
			email: "",
		},
	})



	function onSubmitPhone(values: FormPhoneValues) {

		setLoading(true)

		startTransition(async () => {

			try {
				const res = await isExistingUser(values.phone)

				if (res.isExistingUser) {
					toast.error('Пользователь уже существует', {
						position: 'top-center',
					});

					setLoading(false)
					return
				}

				setFormData((prev) => ({
					...prev,
					login: values.phone,
				}))

				setStepPhoneRegister('password')


			} catch (error) {
				console.error(error)
				toast.error('Ошибка проверке существования пользователя', {
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

	async function onSubmitPass(values: FormPassValues) {
		if (values.password.length < 4) {
			toast.error('Пароль должен быть не менее 4 символов', {
				position: 'top-center',
			});
			return;
		}

		// Собираем данные локально, не полагаясь на setFormData


		startTransition(async () => {
			const sendData = {
				...formdata,
				password: values.password,
			};
			const res = await fetch("/api/register", {
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
			// const res = await registerAction(sendData)
			// if (!res.success) {
			// 	toast.error(res.error, {
			// 		position: 'top-center',
			// 	});
			// } else {

			// 	setUser(res.user)

			// 	localStorage.setItem("accessToken", res.accessToken);

			// 	toast.success(res.message, {
			// 		position: 'top-center',
			// 	})

			// 	router.push('/dashboard')
			// }
		})
	}

	function onErrorPass(errors: any) {
		toast.error(errors.password?.message ?? 'Пароль должен быть не менее 4 символов', {
			position: 'top-center',
		})
	}

	async function onSubmitEmail(values: FormEmailValues) {

		setLoading(true)

		try {

			const res = await isExistingUserForEmail(values.email)

			setCode(res)

			setFormData((prev) => ({
				...prev,
				login: values.email,
			}))

			setStepEmailRegister('code')
		} catch (error) {
			console.error(error)
			toast.error('Пользователь уже существует', {
				position: 'top-center',
			})
		} finally {
			setLoading(false)
		}

	}

	function onErrorEmail(errors: any) {
		toast.error(errors.email?.message ?? 'Некорректный email', {
			position: 'top-center',
		})
	}

	function onSubmitOtpEmail(values: FormOtpValues) {


		if (values.otp.length < 6) {
			toast.error('Введите 6-ти значный код', {
				position: 'top-center',
			})
			return
		}

		if (Number(values.otp) !== Number(code)) {
			toast.error('Неверный код', {
				position: 'top-center',
			})
			return
		}

		toast.success('Придумайте пароль', {
			position: 'top-center',
		})

		setStepEmailRegister('password')
	}

	function onErrorOtpEmail(errors: any) {
		toast.error(errors.otp?.message ?? 'Введите 6-ти значный код', {
			position: 'top-center',
		})
	}

	return (
		<>
			<div id="recaptcha-container" className=' hidden'></div>
			<Tabs defaultValue="phone" className="w-full">
				{/* <TabsList className='grid w-full grid-cols-2 mb-4'>
					<TabsTrigger
						value="phone"
						className='dark:data-[state=active]:bg-background border-0 text-[10px]'
						onClick={() => {
							setFormData({ login: '', password: '' })
							formPhone.reset({ phone: '+7' })
						}}
					>Номер телефона</TabsTrigger>
					<TabsTrigger
						value="email"
						className='dark:data-[state=active]:bg-background border-0 text-[10px]'
						onClick={() => {
							setFormData({ login: '', password: '' })
							formEmail.reset({ email: '' })
						}}
					>Email</TabsTrigger>
				</TabsList> */}
				<TabsContent value="phone">
					<div className="w-full flex flex-col gap-6 justify-center">
						{stepPhoneRegister === 'phone' ? (
							<Form {...formPhone}>
								<form onSubmit={formPhone.handleSubmit(onSubmitPhone, onErrorPhone)} className="w-full flex flex-col gap-6">
									<FormField
										control={formPhone.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormDescription>Введите номер WhatsApp</FormDescription>
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
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<Button
										type='submit'
										className='w-full bg-(--dark-accent)'
										disabled={loading}
									>
										{loading ? (<><Loader2 className="animate-spin stroke-accent" /> Далее</>) : "Далее"}
									</Button>
								</form>
							</Form>
						)
							// : stepPhoneRegister === 'code' ? (
							// 	<Form {...formOtp}>
							// 		<form
							// 			onSubmit={formOtp.handleSubmit(onSubmitOtp, onErrorOtp)}
							// 			className="w-full flex flex-col gap-6"
							// 		>
							// 			<FormField
							// 				control={formOtp.control}
							// 				name="otp"
							// 				render={() => (
							// 					<FormItem>
							// 						<FormDescription>Введите 6-ти значный код из СМС</FormDescription>
							// 						<FormControl className='justify-center'>
							// 							<InputOTP
							// 								maxLength={6}
							// 								value={formOtp.watch('otp')}
							// 								onChange={(otp) => formOtp.setValue('otp', otp)}
							// 							>
							// 								<InputOTPGroup className=' w-full justify-between !rounded-sm'>
							// 									<InputOTPSlot index={0} className=' !rounded-sm' />
							// 									<InputOTPSlot index={1} className=' !rounded-sm' />
							// 									<InputOTPSlot index={2} className=' !rounded-sm' />
							// 								</InputOTPGroup>
							// 								<InputOTPSeparator />
							// 								<InputOTPGroup className=' w-full justify-between !rounded-sm'>
							// 									<InputOTPSlot index={3} className=' !rounded-sm' />
							// 									<InputOTPSlot index={4} className=' !rounded-sm' />
							// 									<InputOTPSlot index={5} className=' !rounded-sm' />
							// 								</InputOTPGroup>
							// 							</InputOTP>
							// 						</FormControl>
							// 					</FormItem>
							// 				)}
							// 			/>
							// 			<Button
							// 				type='submit'
							// 				className='w-full bg-(--dark-accent)'
							// 				disabled={loading}
							// 			>
							// 				{loading ? (<><Loader2 className="animate-spin stroke-accent" /> Проверить код</>) : "Проверить код"}
							// 			</Button>
							// 		</form>
							// 	</Form>
							// )
							: (
								<Form {...formPass}>
									<form onSubmit={formPass.handleSubmit(onSubmitPass, onErrorPass)} className="w-full flex flex-col gap-6">
										<FormField
											control={formPass.control}
											name="password"
											render={() => (
												<FormItem>
													<FormDescription>Придумайте пароль</FormDescription>
													<FormControl className='justify-center'>
														<div className=' flex flex-row gap-2'>
															<Input
																placeholder='Не менее 4 символов'
																type={showPassword ? 'text' : 'password'}
																value={formPass.watch('password')}
																onChange={(event) => formPass.setValue('password', event.target.value)}
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
											className='w-full bg-(--dark-accent)'
											disabled={pending}
										>
											{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Зарегистрироваться</>) : "Зарегистрироваться"}
										</Button>
									</form>
								</Form>
							)}
					</div>
				</TabsContent>
				{/* <TabsContent value="email">
					<div className="w-full flex flex-col gap-6 justify-center">
						{stepEmailRegister === 'email' ? (
							<Form {...formEmail}>
								<form onSubmit={formEmail.handleSubmit(onSubmitEmail, onErrorEmail)} className="w-full flex flex-col gap-6">
									<FormField
										control={formEmail.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormDescription>Введите Email</FormDescription>
												<FormControl>
													<Input
														className='!rounded-lg !h-[36px] !lh-[36px] !overflow-hidden focus:outline-0'
														type='email'
														value={field.value}
														onChange={(event) => field.onChange(event.target.value)}
														placeholder='user@tranzit.kz'
													/>
												</FormControl>
											</FormItem>
										)}
									/>
									<Button
										type='submit'
										className='w-full bg-(--dark-accent)'
										disabled={loading}
									>
										{loading ? (<><Loader2 className="animate-spin stroke-accent" /> Далее</>) : "Далее"}
									</Button>
								</form>
							</Form>
						) : stepEmailRegister === 'code' ? (
							<Form {...formOtpEmail}>
								<form
									onSubmit={formOtpEmail.handleSubmit(onSubmitOtpEmail, onErrorOtpEmail)}
									className="w-full flex flex-col gap-6"
								>
									<FormField
										control={formOtpEmail.control}
										name="otp"
										render={() => (
											<FormItem>
												<FormDescription>Введите 6-ти значный код из письма</FormDescription>
												<FormControl className='justify-center'>
													<InputOTP
														maxLength={6}
														value={formOtpEmail.watch('otp')}
														onChange={(otp) => formOtpEmail.setValue('otp', otp)}
													>
														<InputOTPGroup className=' w-full justify-between !rounded-sm'>
															<InputOTPSlot index={0} className=' !rounded-sm' />
															<InputOTPSlot index={1} className=' !rounded-sm' />
															<InputOTPSlot index={2} className=' !rounded-sm' />
														</InputOTPGroup>
														<InputOTPSeparator />
														<InputOTPGroup className=' w-full justify-between !rounded-sm'>
															<InputOTPSlot index={3} className=' !rounded-sm' />
															<InputOTPSlot index={4} className=' !rounded-sm' />
															<InputOTPSlot index={5} className=' !rounded-sm' />
														</InputOTPGroup>
													</InputOTP>
												</FormControl>
											</FormItem>
										)}
									/>
									<Button
										type='submit'
										className='w-full bg-(--dark-accent)'
										disabled={loading}
									>
										{loading ? (<><Loader2 className="animate-spin stroke-accent" /> Проверить код</>) : "Проверить код"}
									</Button>
								</form>
							</Form>
						) : (
							<Form {...formPass}>
								<form onSubmit={formPass.handleSubmit(onSubmitPass, onErrorPass)} className="w-full flex flex-col gap-6">
									<FormField
										control={formPass.control}
										name="password"
										render={() => (
											<FormItem>
												<FormDescription>Придумайте пароль</FormDescription>
												<FormControl className='justify-center'>
													<div className=' flex flex-row gap-2'>
														<Input
															placeholder='Не менее 6 символов'
															type={showPassword ? 'text' : 'password'}
															value={formPass.watch('password')}
															onChange={(event) => formPass.setValue('password', event.target.value)}
														/>
														<Button
															variant="outline" size="icon"
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
										className='w-full bg-(--dark-accent)'
										disabled={pending}
									>
										{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Зарегистрироваться</>) : "Зарегистрироваться"}
									</Button>
								</form>
							</Form>
						)}
					</div>
				</TabsContent> */}
			</Tabs>
		</>
	)
}
