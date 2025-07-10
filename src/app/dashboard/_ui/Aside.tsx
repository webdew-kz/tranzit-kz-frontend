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
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/cargo/search' || pathname === '/dashboard/cargo/wishlist' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/cargo/search' || pathname === '/dashboard/cargo/wishlist' ? 'text-background' : ''}`)}
							href={'/dashboard/cargo/search'}
						><Search
								className={cn('transition-all duration-200', `${pathname === '/dashboard/cargo/search' || pathname === '/dashboard/cargo/wishlist' ? '!text-background' : ''}`)}
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
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/search' || pathname === '/dashboard/transport/wishlist' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/search' || pathname === '/dashboard/transport/wishlist' ? 'text-background' : ''}`)}
							href={'/dashboard/transport/search'}
						><Search
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/search' || pathname === '/dashboard/transport/wishlist' ? '!text-background' : ''}`)}
								size={16}
							/> Найти</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/my' || pathname === '/dashboard/transport/my/archive' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/my' || pathname === '/dashboard/transport/my/archive' ? 'text-background' : ''}`)}
							href={'/dashboard/transport/my'}
						><Box
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/my' || pathname === '/dashboard/transport/my/archive' ? '!text-background' : ''}`)}
								size={16}
							/> Мои заявки</Link>
					</li>
				</ul>
			</div>
			<div className="grid gap-2">
				<p className=' font-bold'>Авторынок</p>
				<ul className=' grid gap-2'>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/trade/truck') ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname.startsWith('/dashboard/trade/truck') ? 'text-background' : ''}`)}
							href={'/dashboard/trade/truck'}
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M18 18.5C17.6022 18.5 17.2206 18.342 16.9393 18.0607C16.658 17.7794 16.5 17.3978 16.5 17C16.5 16.6022 16.658 16.2206 16.9393 15.9393C17.2206 15.658 17.6022 15.5 18 15.5C18.3978 15.5 18.7794 15.658 19.0607 15.9393C19.342 16.2206 19.5 16.6022 19.5 17C19.5 17.3978 19.342 17.7794 19.0607 18.0607C18.7794 18.342 18.3978 18.5 18 18.5ZM19.5 9.5L21.46 12H17V9.5M6 18.5C5.60218 18.5 5.22064 18.342 4.93934 18.0607C4.65804 17.7794 4.5 17.3978 4.5 17C4.5 16.6022 4.65804 16.2206 4.93934 15.9393C5.22064 15.658 5.60218 15.5 6 15.5C6.39782 15.5 6.77936 15.658 7.06066 15.9393C7.34196 16.2206 7.5 16.6022 7.5 17C7.5 17.3978 7.34196 17.7794 7.06066 18.0607C6.77936 18.342 6.39782 18.5 6 18.5ZM20 8H17V4H3C1.89 4 1 4.89 1 6V17H3C3 17.7956 3.31607 18.5587 3.87868 19.1213C4.44129 19.6839 5.20435 20 6 20C6.79565 20 7.55871 19.6839 8.12132 19.1213C8.68393 18.5587 9 17.7956 9 17H15C15 17.7956 15.3161 18.5587 15.8787 19.1213C16.4413 19.6839 17.2044 20 18 20C18.7956 20 19.5587 19.6839 20.1213 19.1213C20.6839 18.5587 21 17.7956 21 17H23V12L20 8Z" fill={cn('transition-all duration-200', `${pathname.startsWith('/dashboard/trade/truck') ? '#0b0b0b' : '#B4802E'}`)} />
							</svg>
							Грузовики</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/trade/trailer') ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname.startsWith('/dashboard/trade/trailer') ? 'text-background' : ''}`)}
							href={'/dashboard/trade/trailer'}
						><Search
								className={cn('transition-all duration-200', `${pathname.startsWith('/dashboard/trade/trailer') ? '!text-background' : ''}`)}
								size={16}
							/> Прицепы и полуприцепы</Link>
					</li>
					<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/my' || pathname === '/dashboard/transport/my/archive' ? 'bg-(--dark-accent)' : ''}`)}>
						<Link
							className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/my' || pathname === '/dashboard/transport/my/archive' ? 'text-background' : ''}`)}
							href={'/dashboard/transport/my'}
						><Box
								className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/my' || pathname === '/dashboard/transport/my/archive' ? '!text-background' : ''}`)}
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
