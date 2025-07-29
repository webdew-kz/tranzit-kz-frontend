'use client'
import { useUserStore } from '@/shared/store/useUserStore'
import React from 'react'
import FormName from './_ui/FormName'
import FormNameEmail from './_ui/FormNameEmail'
import Loader from '@/shared/components/widgets/Loader'

export default function DashboardPage() {


	const { user } = useUserStore()

	if (!user) {
		return (
			<Loader />
		)
	}
	// if (!user?.name && user?.phone) {
	// 	return (
	// 		<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
	// 			<FormName />
	// 		</div>
	// 	)
	// }

	if (!user?.name && !user?.email) {
		return (
			<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
				<FormNameEmail />
			</div>
		)
	}

	return (

		<div className="h-[100vh] sm:h-[100vh] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex items-center justify-center">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border">
				<h2 className='text-xl text-center'>Здравствуйте, {user?.name} {user?.surname}</h2>
				{user.role === 'ADMIN' ? <span className='text-(--dark-accent)'>Статус: Администратор</span> : null}
			</div>
		</div>
	)
}
