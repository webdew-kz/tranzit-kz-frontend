'use client'
import React, { startTransition, use, useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { toast } from 'sonner'
import { logoutAction } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useUserStore } from '@/shared/store/useUserStore'



export default function Logout() {

	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const { clearUser } = useUserStore.getState()

	const handleLogout = () => {

		setLoading(true)

		startTransition(async () => {
			try {

				const res: any = await logoutAction()

				if (!res) {
					throw new Error('Ошибка при выходе из системы')
				}

				clearUser()

				localStorage.removeItem('accessToken')

				toast.success(res.message, {
					position: 'top-center',
				})

				router.push('/')

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при выходе из системы11', {
					position: 'top-center',
				})
			} finally {
				setLoading(false)
			}
		})
	}

	return (
		<Button
			type='button'
			variant='outline'
			onClick={handleLogout}
			disabled={loading}
		>
			<LogOut />
			<span className=' hidden md:block'>Выход</span>
		</Button>
	)
}
