import { Button } from '@/shared/components/ui/button';
import { Box, CirclePlus, Search, Star } from 'lucide-react';
import Link from 'next/link';

export default function page() {
	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)] '>
			<Button
				variant='default'
				className='w-full sm:hidden bg-accent'
				asChild
			>

				<Link
					href='/dashboard/cargo/add'
					className='flex gap-3 items-center justify-start'
				>
					<CirclePlus /> Добавить груз
				</Link>
			</Button>
			<Button
				variant='default'
				className='w-full sm:hidden bg-accent'
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
				variant='default'
				className='w-full sm:hidden bg-accent'
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
				variant='default'
				className='w-full sm:hidden bg-accent'
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
