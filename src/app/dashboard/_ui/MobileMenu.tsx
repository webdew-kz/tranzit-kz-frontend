'use client'
import { cn } from '@/shared/lib/utils';
import { useUserStore } from '@/shared/store/useUserStore';
import { Box, FileCheck, Menu, Route, SquareUserRound, Truck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function MobileMenu() {

	const pathname = usePathname();

	// const { user } = useUserStore()

	// if (user?.role === 'USER' && !user?.isRegistered) {
	// 	return null
	// }

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
				href='/dashboard/trade'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/trade') ? 'bg-accent' : ''}`)}
			>
				<Truck />
				<span>Авторынок</span>
			</Link>
			<Link
				href='/dashboard/broker'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/broker') ? 'bg-accent' : ''}`)}
			>
				<FileCheck />
				<span>Брокеры</span>
			</Link>
			<Link
				href='/dashboard/menu'
				className={cn('flex flex-col items-center justify-center text-(--dark-accent) text-xs h-full', `${pathname.startsWith('/dashboard/menu') || pathname.startsWith('/dashboard/review') || pathname.startsWith('/dashboard/cabinet') || pathname.startsWith('/dashboard/payment') || pathname.startsWith('/dashboard/support') || pathname.startsWith('/dashboard/admin') ? 'bg-accent' : ''}`)}
			>
				<Menu />
				<span>Меню</span>
			</Link>
		</div>
	)
}
