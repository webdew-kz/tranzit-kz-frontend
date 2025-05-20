import { Button } from '@/shared/components/ui/button';
import { Box, CirclePlus, Search } from 'lucide-react';
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
					href='/dashboard/transport/add'
					className='flex gap-3 items-center justify-start'
				>
					<CirclePlus /> Добавить транспорт
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/transport/search'
					className='flex gap-3 items-center justify-start'
				>
					<Search /> Найти транспорт
				</Link>
			</Button>
			<Button
				variant={'outline'}
				className='w-full sm:hidden'
				asChild
			>

				<Link
					href='/dashboard/transport/my'
					className='flex gap-3 items-center justify-start'
				>
					<Box /> Мои транспорты
				</Link>
			</Button>
		</div>
	)
}
