import { Button } from '@/shared/components/ui/button';
import { ArrowBigDown, ArrowBigUp, NotebookPen, Star } from 'lucide-react';
import Link from 'next/link';

export default function page() {
	return (
		<div className=' flex flex-col gap-4 justify-center h-[calc(100vh-160px)]'>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/parts/add'
					className='flex gap-3 items-center justify-start'
				>
					<ArrowBigUp /> Продать запчасти
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/parts/search'
					className='flex gap-3 items-center justify-start'
				>
					<ArrowBigDown /> Купить запчасти
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/parts/wishlist'
					className='flex gap-3 items-center justify-start'
				>
					<Star /> Избранные запчасти
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/parts/my'
					className='flex gap-3 items-center justify-start'
				>
					<NotebookPen /> Мои объявления
				</Link>
			</Button>
		</div>
	)
}
