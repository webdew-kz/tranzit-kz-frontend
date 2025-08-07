'use client'
import { useUserStore } from '@/shared/store/useUserStore'
import React from 'react'
import FormNameEmail from './_ui/FormNameEmail'
import Loader from '@/shared/components/widgets/Loader'
import { redirect } from 'next/navigation'
import PayRegister from './_ui/PayRegister'

export default function DashboardPage() {


	const { user } = useUserStore()


	if (!user) {
		return (
			<Loader />
		)
	}

	if (!user?.name && !user?.email) {
		return (
			<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
				<FormNameEmail />
			</div>
		)
	}

	if (!user?.isRegistered) {
		<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
			<PayRegister />
		</div>
	}

	return (

		<div className="h-[calc(100vh-160px)] sm:h-[calc(100vh-60px)] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex items-start pt-5 justify-center">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg border-(--dark-accent) border opacity-70">
				<h2 className='text-xl text-center'>Здравствуйте, {user?.name} {user?.surname}</h2>
				{user.role === 'ADMIN' ? <span className='text-(--dark-accent)'>Статус: Администратор</span> : null}
			</div>
		</div>
	)
}
