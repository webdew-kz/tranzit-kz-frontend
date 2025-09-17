'use client'
import { useUserStore } from '@/shared/store/useUserStore'
import React from 'react'
import Loader from '@/shared/components/widgets/Loader'
import FormName from './_ui/FormName'
import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {


	const { user, isInitialized } = useUserStore()


	if (!isInitialized) {
		return (
			<Loader />
		)
	}

	if (!user?.name && !user?.email) {
		return (
			<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
				<FormName />
			</div>
		)
	}

	return (

		<div className="h-[calc(100vh-160px)] sm:h-[calc(100vh-60px)] flex flex-col gap-3 md:gap-5 items-start pt-5 justify-center">
			<div className="flex flex-col gap-3 md:gap-5  items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg border-(--dark-accent) border opacity-70">
				<h2 className='text-xl text-center'>Здравствуйте, {user?.name} {user?.surname}</h2>
				{user.role === 'ADMIN' ? <span className='text-(--dark-accent)'>Статус: Администратор</span> : null}


				{!user?.isRegistered && (
					<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
						<div className="text-center">iTranzit.kz - Ваша надёжная платформа для перевозок. <br /> Мы объединяем грузовладельцев и транспортные компании, чтобы каждый груз дошёл точно в срок. Удобный поиск, прозрачные условия и проверенные партнёры — всё для вашего спокойствия.</div>

					</div>
				)}
			</div>
		</div>
	)
}
