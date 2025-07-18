import { Button } from '@/shared/components/ui/button'
import { Box, CirclePlus, PhoneOff, Search, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function page() {
	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/blacklist'
					className='flex gap-3 items-center justify-start'
				>
					<PhoneOff /> Черный список
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/cargo/search'
					className='flex gap-3 items-center justify-start'
				>
					<Search /> Найти груз
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/cargo/wishlist'
					className='flex gap-3 items-center justify-start'
				>
					<Star /> Избранные грузы
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/cargo/my'
					className='flex gap-3 items-center justify-start'
				>
					<Box /> Мои грузы
				</Link>
			</Button>
		</div>
	)
}
