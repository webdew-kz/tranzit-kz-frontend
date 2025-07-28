'use client'

import React, { startTransition, useState } from 'react'
import { Button } from '../../ui/button'
import { toast } from 'sonner'
import { logoutAction } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useUserStore } from '@/shared/store/useUserStore'

interface LogoutProps {
	isAuthUser: boolean
}

export default function Logout({ isAuthUser }: LogoutProps) {
	const { user, clearUser } = useUserStore((state) => state)

	const [loading, setLoading] = useState(false)
	const router = useRouter()

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
				toast.error('Ошибка при выходе из системы!', {
					position: 'top-center',
				})
			} finally {
				setLoading(false)
			}
		})
	}

	if (!isAuthUser || !user) {
		return null // скрыть, если не авторизован
	}

	return (
		<Button
			type='button'
			variant='outline'
			onClick={handleLogout}
			disabled={loading}
		>
			<LogOut />
			<span className='hidden md:block'>Выход</span>
		</Button>
	)
}
