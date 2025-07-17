import { Button } from '@/shared/components/ui/button';
import { Box, CirclePlus, Search, Star } from 'lucide-react';
import Link from 'next/link';

export default function page() {
	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/vacancy/add'
					className='flex gap-3 items-center justify-start'
				>
					<CirclePlus /> Добавить вакансию
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/vacancy/search'
					className='flex gap-3 items-center justify-start'
				>
					<Search /> Найти вакансию
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/vacancy/wishlist'
					className='flex gap-3 items-center justify-start'
				>
					<Star /> Избранные вакансии
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/vacancy/my'
					className='flex gap-3 items-center justify-start'
				>
					<Box /> Мои объявления
				</Link>
			</Button>
		</div>
	)
}
