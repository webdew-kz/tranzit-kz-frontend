'use client'
import { useUserStore } from '@/shared/store/useUserStore'
import React from 'react'
import FormName from './_ui/FormName'
import FormNamePhone from './_ui/FormNamePhone'
import Loader from '@/shared/components/widgets/Loader'

export default function DashboardPage() {


	const { user } = useUserStore()

	if (!user) {
		return (
			<Loader />
		)
	}
	if (!user?.name && user?.phone) {
		return (
			<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
				<FormName />
			</div>
		)
	}

	if (!user?.name && !user?.phone) {
		return (
			<div className=' fixed left-0 bottom-0 right-0 top-[60px] bg-background z-100 flex justify-center items-center'>
				<FormNamePhone />
			</div>
		)
	}

	return (
		<div className='h-full flex justify-center items-center'>
			Здравствуйте, {user?.name} {user?.surname}
		</div>
	)
}
