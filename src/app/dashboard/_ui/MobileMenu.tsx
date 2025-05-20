'use client'
import { cn } from '@/shared/lib/utils';
import { Box, Menu, Route, SquareUserRound, Truck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function MobileMenu() {

	const pathname = usePathname();

	return (
		<div className=" z-1 md:hidden fixed h-15 w-full top-15 right-0 left-0 bg-background border-b border-(--dark-accent) grid grid-cols-5 items-center px-0">
			<Link
				href='/dashboard/cargo'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/cargo') ? 'bg-accent' : ''}`)}
			>
				<Box />
				<span>Грузы</span>
			</Link>
			<Link
				href='/dashboard/transport'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/transport') ? 'bg-accent' : ''}`)}
			>
				<Route />
				<span>Транспорт</span>
			</Link>
			<Link
				href='/dashboard/autotrade'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/autotrade') ? 'bg-accent' : ''}`)}
			>
				<Truck />
				<span>Авторынок</span>
			</Link>
			<Link
				href='/dashboard/vacancy'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/vacancy') ? 'bg-accent' : ''}`)}
			>
				<SquareUserRound />
				<span>Вакансии</span>
			</Link>
			<Link
				href=''
				className='flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full'
			>
				<Menu />
				<span>Меню</span>
			</Link>
		</div>
	)
}
