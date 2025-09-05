"use client"
import { Button } from '@/shared/components/ui/button';
import { useUserStore } from '@/shared/store/useUserStore';
import { Box, CirclePlus, Search, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';

export default function page() {

	const { user } = useUserStore()

	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			{/* <div className="font-semibold text-xl text-center">Ваш баланс: {user?.balance?.toLocaleString('ru-RU') ?? 0} ₸</div>
			<Button
				variant={'outline'}
				className='w-full '
				asChild
			>

				<Link
					href='/dashboard/payment/add'
					className='flex gap-3 items-center justify-start'
				>
					<CirclePlus /> Пополнить
				</Link>
			</Button> */}

			{/* <Button
				variant={'outline'}
				className='w-full '
				asChild
			>

				<Link
					href='/dashboard/payment/my'
					className='flex gap-3 items-center justify-start'
				>
					<Box /> История платежей
				</Link>
			</Button> */}



			{user?.role === 'ADMIN' && (
				<Button
					variant='default'
					className='w-full bg-accent'
					asChild
				>

					<Link
						href='/dashboard/payment/all'
						className='flex gap-3 items-center justify-start'
					>
						<ShieldCheck /> Все платежи
					</Link>
				</Button>
			)}
		</div>
	)
}
