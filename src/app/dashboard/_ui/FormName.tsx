"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import { endRegister } from '../actions'
import { startTransition } from 'react'
import { useUserStore } from '@/shared/store/useUserStore'

const formSchema = z.object({
	name: z.string().min(1).max(50),
	// surname: z.string().min(1).max(50),
})

export default function FormName() {

	const { setUser } = useUserStore()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			// surname: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {

		startTransition(async () => {
			try {
				const res: any = await endRegister(values)
				toast.success(res.message, {
					position: 'top-center',
				})
				setUser(res.updatedUser)
			} catch (error) {
				console.error(error)
				onError(error)
			}
		})
	}

	function onError(errors: any) {
		toast.error(errors.message ?? 'Некорректный email', {
			position: 'top-center',
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className=" w-[calc(100vw - 2rem)] sm:w-[320px] grid gap-5">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ваше имя</FormLabel>
							<FormControl>
								<Input placeholder="Введите ваше имя" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				{/* <FormField
					control={form.control}
					name='surname'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ваша фамилия</FormLabel>
							<FormControl>
								<Input placeholder="Введите вашу фамилию" {...field} />
							</FormControl>
						</FormItem>
					)}
				/> */}
				<Button
					className=' bg-(--dark-accent) hover:bg-(--background) text-(--foreground)  border border-(--dark-accent) hover:border-(--foreground) rounded-lg'
					type="submit"
				>Завершить регистрацию</Button>
			</form>
		</Form>
	)
}
