import { Box, Menu, Route, SquareUserRound, Truck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function MobileMenu() {
	return (
		<div className=" z-1 md:hidden fixed h-15 w-full top-15 right-0 left-0 bg-background border-b border-(--dark-accent) grid grid-cols-5 items-center px-0">
			<Link
				href='/dashboard/cargo'
				className='flex flex-col items-center justify-center text-(--dark-accent) text-xs'
			>
				<Box />
				<span>Грузы</span>
			</Link>
			<Link
				href='/dashboard/transport'
				className='flex flex-col items-center justify-center text-(--dark-accent) text-xs'
			>
				<Route />
				<span>Транспорт</span>
			</Link>
			<Link
				href=''
				className='flex flex-col items-center justify-center text-(--dark-accent) text-xs'
			>
				<Truck />
				<span>Авторынок</span>
			</Link>
			<Link
				href=''
				className='flex flex-col items-center justify-center text-(--dark-accent) text-xs'
			>
				<SquareUserRound />
				<span>Вакансии</span>
			</Link>
			<Link
				href=''
				className='flex flex-col items-center justify-center text-(--dark-accent) text-xs'
			>
				<Menu />
				<span>Меню</span>
			</Link>
		</div>
	)
}
