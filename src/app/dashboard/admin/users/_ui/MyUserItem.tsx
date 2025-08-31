"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { cn } from '@/shared/lib/utils'
import { Loader2, Lock, Trash, Unlock, } from 'lucide-react'
import React, { memo, SetStateAction, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { User } from '@/shared/types/user.type'
import { changePassword, lock, remove, unlock } from '../actions'
import { Input } from '@/shared/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface MyUserItemProps {
	userInitial: User
	selected: boolean
	onToggle: () => void
	setUsers: (value: SetStateAction<User[]>) => void
	// setSearchUsers: (users: User[] | ((prev: User[]) => User[])) => void;
	rates?: any
	loading?: boolean
}

const MyUserItem = memo(({ userInitial, selected, onToggle, setUsers, loading }: MyUserItemProps) => {


	const [user, setUser] = useState<User>(userInitial)

	const [pending, startTransition] = useTransition()

	const userSchema = z.object({
		password: z.string().optional(),
		id: z.string().optional()
	});

	type IUser = z.infer<typeof userSchema>

	const form = useForm({
		resolver: zodResolver(userSchema),
		defaultValues: {
			password: undefined,
			id: user.id
		},
	})

	const onSubmit = async (data: IUser) => {

		startTransition(async () => {

			try {

				const res = await changePassword(data.password!, data.id!)

				toast.success(res.message, {
					position: 'top-center',
				})

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

	const handleUnlock = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await unlock(id)

				toast.success(res.message, {
					position: 'top-center',
				})

				setUser((prev) => ({
					...prev,
					...res.updatedUser,
				}))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при разблокировки', {
					position: 'top-center',
				})
			}
		})
	}

	const handleLock = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await lock(id)

				toast.success(res.message, {
					position: 'top-center',
				})

				setUser((prev) => ({
					...prev,
					...res.updatedUser,
				}))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при блокировки', {
					position: 'top-center',
				})
			}
		})
	}

	const handleRemove = async (id: string) => {

		startTransition(async () => {

			try {
				const res = await remove(id)

				toast.success(res.message, {
					position: 'top-center',
				})

				setUsers(prev => prev.filter(user => user.id !== id))

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при удалении', {
					position: 'top-center',
				})
			}
		})
	}

	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	return (
		<Card className={cn(user.isBlocked ? '!text-muted-foreground p-0 border-1 border-(--dark-accent)' : 'p-0 border-1 border-(--dark-accent) ')}>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex justify-between w-full items-center mb-2">
					<div className=" font-medium flex gap-2 items-center">
						{user.isBlocked ?
							<>
								<Lock size={16} />
								<span className='text-nowrap text-xs'>
									Заблокирован
								</span>
							</> : ''}

					</div>
					<div className=" flex items-center gap-4 justify-end">
						{/* <div className="flex items-center gap-2">
							<Checkbox
								id={user.id}
								className='border-(--dark-accent)'
								checked={selected}
								onCheckedChange={onToggle}
							/>
							<label
								htmlFor={user.id}
								className="text-sm text-(--dark-accent) cursor-pointer underline underline-offset-2 "
							>
								Выбрать
							</label>
						</div> */}
					</div>
				</div>

				<div className="flex flex-col gap-3 md:flex-row md:items-center w-full mb-3">
					<span className="font-medium leading-none">
						Логин: {user.login}
					</span>

					<span className="font-medium leading-none">
						Абонплата: {user?.isRegistered ? 'Оплачено' : 'Неоплачено'}
					</span>

					<span className="font-medium leading-none">
						Дата регистрации: {new Date(user.createdAt).toLocaleDateString("ru-RU")}
					</span>
				</div>

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
							{...form.register('password')}
						/>
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-6  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Изменить пароль</>) : "Найти отзывы"}
						</Button>
					</div>
				</form>

				<div className=" flex flex-col gap-3 items-start lg:flex-row justify-between w-full">
					<div className=" flex gap-2 w-full lg:w-auto">
						<Button
							variant='default'
							className='group bg-(--dark-accent) text-(--background) hover:bg-transparent hover:text-(--dark-accent) border hover:!border-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/3)] lg:max-w-auto'
							onClick={() => handleUnlock(user.id!)}
							disabled={pending}
						>
							<Unlock
								size={16}
								className='stroke-background group-hover:stroke-(--dark-accent)'
							/>
							<span className='hidden lg:block'>Разблокировать</span>
						</Button>

						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/3)] lg:max-w-auto'
							onClick={() => handleLock(user.id!)}
							disabled={pending}
						>
							<Lock size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Заблокировать</span>
						</Button>
						<Button
							variant='outline'
							className='group text-(--dark-accent) !border-(--dark-accent) hover:text-background hover:!bg-(--dark-accent) w-full lg:w-auto max-w-[calc((100vw-5rem)/3)] lg:max-w-auto'
							onClick={() => handleRemove(user.id!)}
						>
							<Trash size={16} className=' stroke-(--dark-accent) group-hover:stroke-background' />
							<span className=' hidden lg:block'>Удалить</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
})


export default MyUserItem