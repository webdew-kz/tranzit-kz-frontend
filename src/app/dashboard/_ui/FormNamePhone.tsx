"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import { endRegister } from '../actions'
import { useEffect, useState, useTransition } from 'react'
import { useUserStore } from '@/shared/store/useUserStore'
import PhoneInput from 'react-phone-input-2'
import ru from 'react-phone-input-2/lang/ru.json'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { isExistingUser } from '@/app/register/actions'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '@/shared/lib/firebase'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp'
import { Loader2 } from 'lucide-react'


export default function FormNamePhone() {

	const [step, setStep] = useState<'number' | 'code'>('number')

	const [pending, startTransition] = useTransition()

	const { setUser } = useUserStore()

	const schema = z.object({
		name: z.string().min(1).max(50),
		phone: z.string().refine(
			(val) => isValidPhoneNumber("+" + val),
			{ message: "Некорректный номер" }
		),
		otp: z.string().optional(),
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			phone: "",
			otp: "",
		},
	})

	useEffect(() => {
		if (!window.recaptchaVerifier) {
			window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
				'size': 'invisible',
				callback: (response: string) => {
					console.log('reCAPTCHA resolved', response);
				},
			})

			window.recaptchaVerifier.render().then((widgetId) => {
				window.recaptchaWidgetId = widgetId;
			});
		}
	}, []);

	// function handleValidPhone(values: z.infer<typeof baseSchema>) {

	// 	startTransition(async () => {

	// 		try {
	// 			const res = await isExistingUser(values.phone)

	// 			if (res.isExistingUser) {
	// 				toast.error('Пользователь уже существует', {
	// 					position: 'top-center',
	// 				});
	// 				return
	// 			}

	// 			let appVerifier = window.recaptchaVerifier;

	// 			signInWithPhoneNumber(auth, '+' + values.phone, appVerifier)
	// 				.then((confirmationResult) => {
	// 					window.confirmationResult = confirmationResult
	// 					toast.success('Введите код из СМС', {
	// 						position: 'top-center',
	// 						duration: 5000,
	// 					})
	// 					setSendData(values)
	// 					setStep('code')
	// 				})
	// 				.catch((error) => {
	// 					console.error(error)
	// 					toast.error('Ошибка при отправке кода', {
	// 						position: 'top-center',
	// 					})
	// 				}).finally(() => {
	// 					formCode.setValue("otp", "")
	// 				})


	// 		} catch (error) {
	// 			console.error(error)
	// 			toast.error('Ошибка проверке существования пользователя', {
	// 				position: 'top-center',
	// 			})
	// 		}
	// 	})

	// }

	// function handleSubmit(values: z.infer<typeof codeSchema>) {
	// 	window.confirmationResult.confirm(values.otp)
	// 		.then((result: any) => {
	// 			const user = result.user
	// 			console.log(user);

	// 			toast.success(`Телефон подтвержден`, {
	// 				position: 'top-center',
	// 			})

	// 			startTransition(async () => {

	// 				const res: any = await endRegister(sendData)

	// 				toast.success(res.message, {
	// 					position: 'top-center',
	// 				})

	// 				setUser(res.updatedUser)
	// 			})

	// 		}).catch((error: any) => {
	// 			console.error(error)
	// 			toast.error('Неверный код', {
	// 				position: 'top-center',
	// 			})
	// 		})
	// }

	const onSubmit = async (values: z.infer<typeof schema>) => {
		if (step === "number") {
			// // проверка на существование
			// const res = await isExistingUser(values.phone)
			// if (res.isExistingUser) {
			// 	toast.error("Пользователь уже существует")
			// 	return
			// }

			// // Firebase: отправка SMS
			// const appVerifier = window.recaptchaVerifier
			// const confirmation = await signInWithPhoneNumber(auth, "+" + values.phone, appVerifier)
			// window.confirmationResult = confirmation

			// toast.success("Введите код из СМС")
			// setStep("code")

			const res = await isExistingUser(values.phone)

			if (res.isExistingUser) {
				toast.error('Пользователь уже существует', {
					position: 'top-center',
				});
				return
			}

			let appVerifier = window.recaptchaVerifier;

			signInWithPhoneNumber(auth, '+' + values.phone, appVerifier)
				.then((confirmationResult) => {
					window.confirmationResult = confirmationResult
					toast.success('Введите код из СМС', {
						position: 'top-center',
						duration: 5000,
					})
					setStep('code')
				})
				.catch((error) => {
					console.error(error)
					toast.error('Ошибка при отправке кода', {
						position: 'top-center',
					})
				}).finally(() => {
					form.setValue("otp", "")
				})

		} else if (step === "code") {
			// подтверждение кода
			const { otp, name, phone } = values
			const result = await window.confirmationResult.confirm(otp!)
			console.log("Firebase user:", result.user)

			const response = await endRegister({ name, phone })
			toast.success(response.message, {
				position: 'top-center',
			})
			setUser(response.updatedUser)
		}
	}

	function onError(errors: any) {
		if (errors.phone) {
			toast.error(errors.phone.message, {
				position: 'top-center',
			})
		}
		if (errors.otp) {
			toast.error(errors.otp.message, {
				position: 'top-center',
			})
		}
		if (errors.name) {
			toast.error(errors.name.message, {
				position: 'top-center',
			})
		}
	}

	return (
		<>
			<div id="recaptcha-container" className=' hidden'></div>
			<Form {...form}>

				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=" w-[calc(100vw - 2rem)] sm:w-[320px] grid gap-5"
				>

					{step === 'number' && (
						<>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ваше имя</FormLabel>
										<FormControl>
											<Input
												placeholder="Введите ваше имя"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ваш номер телефона</FormLabel>
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
												placeholder="Введите номер телефона"
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<Button
								className=' bg-(--dark-accent) hover:bg-(--background) text-(--foreground)  border border-(--dark-accent) hover:border-(--foreground) rounded-lg'
								type="submit"
							>Подтвердить номер</Button>
						</>
					)}

					{step === 'code' && (
						<>
							<FormField
								control={form.control}
								name="otp"
								render={({ field }) => (
									<FormItem>
										<FormDescription>Введите 6-ти значный код из СМС</FormDescription>
										<FormControl className='justify-center'>
											<InputOTP
												maxLength={6}
												value={field.value}
												onChange={field.onChange}
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
								disabled={pending}
							>
								{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Завершить регистрацию</>) : "Завершить регистрацию"}
							</Button>
						</>
					)}

				</form>

			</Form>
			{/* {step === 'code' ? (

				<Form {...formCode}>
					<form
						onSubmit={formCode.handleSubmit(handleSubmit, onError)}
						className=" w-[calc(100vw - 2rem)] sm:w-[320px] grid gap-5"
					>
						<FormField
							control={formCode.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormDescription>Введите 6-ти значный код из СМС</FormDescription>
									<FormControl className='justify-center'>
										<InputOTP
											maxLength={6}
											value={field.value}
											onChange={field.onChange}
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
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Завершить регистрацию</>) : "Завершить регистрацию"}
						</Button>
					</form>
				</Form>

			) : (

				<Form {...formBase}>
					<form
						onSubmit={formBase.handleSubmit(handleValidPhone)}
						className=" w-[calc(100vw - 2rem)] sm:w-[320px] grid gap-5"
					>
						<FormField
							control={formBase.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ваше имя</FormLabel>
									<FormControl>
										<Input
											placeholder="Введите ваше имя"
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={formBase.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ваш номер телефона</FormLabel>
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
											placeholder="Введите номер телефона"
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<Button
							className=' bg-(--dark-accent) hover:bg-(--background) text-(--foreground)  border border-(--dark-accent) hover:border-(--foreground) rounded-lg'
							type="submit"
						>Подтвердить номер</Button>
					</form>
				</Form>
			)} */}

		</>
	)
}
