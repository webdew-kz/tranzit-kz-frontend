'use client'
import { cn } from '@/shared/lib/utils';
import { Box, CirclePlus, Search, SquareUserRound, Truck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Aside() {

	const pathname = usePathname();


	return (
		<aside className="hidden md:flex flex-col gap-4 md:col-span-2 p-4 border-r border-(--dark-accent) h-[calc(100vh-62px)] sticky top-[60px]">
			<div className="grid gap-2">
				<p className=' font-bold'>Груз</p>
				<ul className=' grid gap-2'>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/cargo/add' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/cargo/add' ? 'text-background' : ''}`)}
							href={'/dashboard/cargo/add'}
						><CirclePlus
								className={cn('transition-all duration-200', `${pathname === '/dashboard/cargo/add' ? '!text-background' : ''}`)}
								size={16}
							/> Добавить</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/cargo/search' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/cargo/search' ? 'text-background' : ''}`)}
							href={'/dashboard/cargo/search'}
						><Search
								className={cn('transition-all duration-200', `${pathname === '/dashboard/cargo/search' ? '!text-background' : ''}`)}
								size={16}
							/> Найти</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/cargo/my' || pathname === '/dashboard/cargo/my/archive' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/cargo/my' || pathname === '/dashboard/cargo/my/archive' ? 'text-background' : ''}`)}
							href={'/dashboard/cargo/my'}
						><Box
								className={cn('transition-all duration-200', `${pathname === '/dashboard/cargo/my' || pathname === '/dashboard/cargo/my/archive' ? '!text-background' : ''}`)}
								size={16}
							/> Мои заявки</Link>
					</li>
				</ul>
			</div>
			<div className="grid gap-2">
				<p className=' font-bold'>Транспорт</p>
				<ul className=' grid gap-2'>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/add' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/add' ? 'text-background' : ''}`)}
							href={'/dashboard/transport/add'}
						><CirclePlus
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/add' ? '!text-background' : ''}`)}
								size={16}
							/> Добавить</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/search' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/search' ? 'text-background' : ''}`)}
							href={'/dashboard/transport/search'}
						><Search
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/search' ? '!text-background' : ''}`)}
								size={16}
							/> Найти</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/my' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/my' ? 'text-background' : ''}`)}
							href={'/dashboard/transport/my'}
						><Truck
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/my' ? '!text-background' : ''}`)}
								size={16}
							/> Мои заявки</Link>
					</li>
				</ul>
			</div>
			<div className="grid gap-2">
				<p className=' font-bold'>Вакансии</p>
				<ul className=' grid gap-2'>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/vacancy/add' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/vacancy/add' ? 'text-background' : ''}`)}
							href={'/dashboard/vacancy/add'}
						><CirclePlus
								className={cn('transition-all duration-200', `${pathname === '/dashboard/vacancy/add' ? '!text-background' : ''}`)}
								size={16}
							/> Добавить</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/vacancy/search' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/vacancy/search' ? 'text-background' : ''}`)}
							href={'/dashboard/vacancy/search'}
						><Search
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/search' ? '!text-background' : ''}`)}
								size={16}
							/> Найти</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/vacancy/my' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/vacancy/my' ? 'text-background' : ''}`)}
							href={'/dashboard/vacancy/my'}
						><SquareUserRound
								className={cn('transition-all duration-200', `${pathname === '/dashboard/vacancy/my' ? '!text-background' : ''}`)}
								size={16}
							/> Мои заявки</Link>
					</li>
				</ul>
			</div>
		</aside>
	)
}
