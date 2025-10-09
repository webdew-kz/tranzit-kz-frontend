'use client'
import { Button } from '@/shared/components/ui/button'
import { useUserStore } from '@/shared/store/useUserStore'
import { Box, ChartNoAxesCombined, CirclePlus, CircleUserRound, CreditCard, MessageCircleMore, PhoneOff, Search, ShieldCheck, ShieldUser, SquareUserRound, Star } from 'lucide-react'
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
			<Button
				variant='default'
				className='w-full sm:hidden bg-accent'
				asChild
			>

				<Link
					href='/dashboard/vacancy'
					className='flex gap-3 items-center justify-start'
				>
					<SquareUserRound /> Вакансии
				</Link>
			</Button>

			<Button
				variant='default'
				className='w-full sm:hidden bg-accent'
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
				variant='default'
				className='w-full sm:hidden bg-accent'
				asChild
			>

				<Link
					href='https://t.me/itranzit_kz'
					target='_blank'
					className='flex gap-3 items-center justify-start'
				>
					<ShieldUser /> Написать администратору
				</Link>
			</Button>
			{/* <Button
				variant='default'
				className='w-full sm:hidden bg-accent'
				asChild
			>

				<Link
					href='/dashboard/support'
					className='flex gap-3 items-center justify-start'
				>
					<ShieldCheck /> Написать администратору
				</Link>
			</Button> */}

			{user?.role === 'ADMIN' && (
				<>
					<Button
						variant='default'
						className='w-full sm:hidden bg-accent'
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
