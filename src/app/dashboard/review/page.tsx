import { Button } from '@/shared/components/ui/button';
import { Box, CirclePlus, Search, Star } from 'lucide-react';
import Link from 'next/link';

export default function page() {
	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			<Button
				variant={'outline'}
				className='w-full '
				asChild
			>

				<Link
					href='/dashboard/review/add'
					className='flex gap-3 items-center justify-start'
				>
					<CirclePlus /> Добавить отзыв
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full '
				asChild
			>

				<Link
					href='/dashboard/review/search'
					className='flex gap-3 items-center justify-start'
				>
					<Search /> Найти отзыв
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full '
				asChild
			>

				<Link
					href='/dashboard/review/my'
					className='flex gap-3 items-center justify-start'
				>
					<Box /> Мои отзывы
				</Link>
			</Button>
		</div>
	)
}
