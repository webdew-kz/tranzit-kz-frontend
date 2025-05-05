import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className=' flex flex-col gap-6 justify-center items-center h-[calc(100%-120px)]'>

			<h1 className=' text-4xl font-bold'>404 </h1>
			<p>Страница не найдена</p>
			<Button asChild>
				<Link href="/">На главную</Link>
			</Button>
		</div>
	)
}