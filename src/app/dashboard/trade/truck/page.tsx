import { Button } from '@/shared/components/ui/button';
import { ArrowBigDown, ArrowBigUp, NotebookPen, Star } from 'lucide-react';
import Link from 'next/link';

export default function page() {
	return (
		<div className=' flex flex-col md:grid md:grid-cols-2 gap-4 justify-center h-[calc(100vh-160px)]'>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/truck/add'
					className='flex gap-3 items-center justify-start'
				>
					<ArrowBigUp /> Продать грузовик
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/truck/search'
					className='flex gap-3 items-center justify-start'
				>
					<ArrowBigDown /> Купить грузовик
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/truck/wishlist'
					className='flex gap-3 items-center justify-start'
				>
					<Star /> Избранные грузовиковики
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full'
				asChild
			>

				<Link
					href='/dashboard/trade/truck/my'
					className='flex gap-3 items-center justify-start'
				>
					<NotebookPen /> Мои объявления
				</Link>
			</Button>
		</div>
	)
}
