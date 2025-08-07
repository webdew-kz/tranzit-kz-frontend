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


export default function FormNameEmail() {

	const { setUser } = useUserStore()

	const schema = z.object({
		name: z.string().min(1).max(50),
		email: z.string().email({ message: 'Неверный формат email' }),
		otp: z.string().optional(),
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			otp: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof schema>) => {
		const { name, email } = values
		const response = await endRegister({ name, email })
		toast.success(response.message, {
			position: 'top-center',
		})
		setUser(response.updatedUser)
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ваш e-mail</FormLabel>
								<FormControl>
									<Input
										placeholder="Введите e-mail для восстановления пароля"
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
					>Сохранить</Button>

				</form>

			</Form>


		</>
	)
}
