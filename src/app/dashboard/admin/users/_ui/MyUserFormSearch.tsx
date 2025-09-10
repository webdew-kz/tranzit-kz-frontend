"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { z } from "zod"
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore';
import { cn } from '@/shared/lib/utils';
import { findUserByLogin } from '../actions';
import { User } from '@/shared/types/user.type';
import { useUserSearchStore } from '@/shared/store/useUserSearchStore';

export default function MyUserFormSearch() {

	const { setSearchUsers } = useUserSearchStore()

	const [pending, startTransition] = useTransition()

	const reviewSchema = z.object({
		login: z
			.string()
			.transform((val) =>
				val
					.replace(/\D/g, "") // оставляем только цифры
					.replace(/^7/, "") // убираем первую 7 (так как +7 уже есть)
			),
	});

	type User = z.infer<typeof reviewSchema>

	const form = useForm({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			login: undefined
		},
	})

	const onSubmit = async (data: User) => {

		startTransition(async () => {

			try {
				setSearchUsers([])

				const res = await findUserByLogin(data.login)

				toast.success(res.message, {
					position: 'top-center',
				})

				setSearchUsers(res.users)
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при поиске', {
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
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Поиск пользователя</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className={cn('grid w-full gap-3 md:gap-5 items-start')}>
						<Input
							type='text'
							placeholder="Укажите логин"
							className='text-sm'
							required
							{...form.register('login')}
						/>
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-6  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти пользователя</>) : "Найти пользователя"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
