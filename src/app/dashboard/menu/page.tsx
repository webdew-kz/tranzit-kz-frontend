'use client'
import { Button } from '@/shared/components/ui/button'
import { useUserStore } from '@/shared/store/useUserStore'
import { Box, ChartNoAxesCombined, CirclePlus, CircleUserRound, CreditCard, MessageCircleMore, PhoneOff, Search, ShieldCheck, ShieldUser, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function page() {

	// const router = useRouter()
	const { user } = useUserStore()
	// if (!user?.isRegistered && user?.role === 'USER') {
	// 	router.replace('/dashboard')
	// }
	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			{/* <Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/cabinet'
					className='flex gap-3 items-center justify-start'
				>
					<CircleUserRound /> Личный кабинет
				</Link>
			</Button> */}
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/payment'
					className='flex gap-3 items-center justify-start'
				>
					<CreditCard /> Баланс личного кабинета
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/review'
					className='flex gap-3 items-center justify-start'
				>
					<MessageCircleMore /> Черный список / Отзывы
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/support'
					className='flex gap-3 items-center justify-start'
				>
					<ShieldUser /> Техподдержка сайта
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/support'
					className='flex gap-3 items-center justify-start'
				>
					<ShieldCheck /> Написать администратору
				</Link>
			</Button>

			{user?.role === 'ADMIN' && (
				<>
					<Button
						variant={'outline'}
						className='w-full sm:hidden'
						asChild
					>

						<Link
							href='/dashboard/admin'
							className='flex gap-3 items-center justify-start'
						>
							<ShieldCheck /> Администратор
						</Link>
					</Button>
				</>
			)}
		</div>
	)
}
