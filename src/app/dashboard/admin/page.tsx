'use client'
import { Button } from '@/shared/components/ui/button';
import { useUserStore } from '@/shared/store/useUserStore';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function page() {
	const { user } = useUserStore()

	if (user?.role !== 'ADMIN') return null

	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/admin/users'
					className='flex gap-3 items-center justify-start'
				>
					<User /> Все пользователи
				</Link>
			</Button>
		</div>
	)
}
