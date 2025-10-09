'use client'
import { cn } from '@/shared/lib/utils';
import { useUserStore } from '@/shared/store/useUserStore';
import { Box, ChartNoAxesCombined, CirclePlus, CircleUserRound, CreditCard, MessageCircleMore, Search, ShieldCheck, ShieldUser, SquareUserRound, Star, Truck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function Aside() {

	const pathname = usePathname();

	const { user } = useUserStore()

	return (
		<aside className="hidden md:block overflow-y-auto p-4 border-r border-(--dark-accent) h-[calc(100vh-62px)] sticky top-[60px] col-span-2">
			<div className="flex flex-col gap-4">
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
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/cargo/wishlist' ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/cargo/wishlist' ? 'text-background' : ''}`)}
								href={'/dashboard/cargo/wishlist'}
							><Star
									className={cn('transition-all duration-200', `${pathname === '/dashboard/cargo/wishlist' ? '!text-background' : ''}`)}
									size={16}
								/> Избранные</Link>
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
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/transport/wishlist' ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/transport/wishlist' ? 'text-background' : ''}`)}
								href={'/dashboard/transport/wishlist'}
							><Star
									className={cn('transition-all duration-200', `${pathname === '/dashboard/transport/wishlist' ? '!text-background' : ''}`)}
									size={16}
								/> Избранные</Link>
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
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200 linkSvgPathDark', `${pathname.startsWith('/dashboard/trade/truck') ? 'text-background' : ''}`)}
								href={'/dashboard/trade/truck'}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-4 h-4 transition-all duration-200 hover:svgPathDark', `${pathname.startsWith('/dashboard/trade/truck') ? 'svgPathDark' : 'svgPathAccent'}`)}>
									<path d="M18 18.5C17.6022 18.5 17.2206 18.342 16.9393 18.0607C16.658 17.7794 16.5 17.3978 16.5 17C16.5 16.6022 16.658 16.2206 16.9393 15.9393C17.2206 15.658 17.6022 15.5 18 15.5C18.3978 15.5 18.7794 15.658 19.0607 15.9393C19.342 16.2206 19.5 16.6022 19.5 17C19.5 17.3978 19.342 17.7794 19.0607 18.0607C18.7794 18.342 18.3978 18.5 18 18.5ZM19.5 9.5L21.46 12H17V9.5M6 18.5C5.60218 18.5 5.22064 18.342 4.93934 18.0607C4.65804 17.7794 4.5 17.3978 4.5 17C4.5 16.6022 4.65804 16.2206 4.93934 15.9393C5.22064 15.658 5.60218 15.5 6 15.5C6.39782 15.5 6.77936 15.658 7.06066 15.9393C7.34196 16.2206 7.5 16.6022 7.5 17C7.5 17.3978 7.34196 17.7794 7.06066 18.0607C6.77936 18.342 6.39782 18.5 6 18.5ZM20 8H17V4H3C1.89 4 1 4.89 1 6V17H3C3 17.7956 3.31607 18.5587 3.87868 19.1213C4.44129 19.6839 5.20435 20 6 20C6.79565 20 7.55871 19.6839 8.12132 19.1213C8.68393 18.5587 9 17.7956 9 17H15C15 17.7956 15.3161 18.5587 15.8787 19.1213C16.4413 19.6839 17.2044 20 18 20C18.7956 20 19.5587 19.6839 20.1213 19.1213C20.6839 18.5587 21 17.7956 21 17H23V12L20 8Z" />
								</svg>
								Грузовики</Link>
						</li>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/trade/tractor') ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200 linkSvgPathDark', `${pathname.startsWith('/dashboard/trade/tractor') ? 'text-background' : ''}`)}
								href={'/dashboard/trade/tractor'}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-4 h-4 transition-all duration-200 hover:svgPathDark', `${pathname.startsWith('/dashboard/trade/tractor') ? 'svgPathDark' : 'svgPathAccent'}`)}>
									<g clipPath="url(#clip0_2963_1455)">
										<path d="M5.83945 6.61989H12.2495C12.3141 6.61994 12.3762 6.59498 12.4228 6.55023C12.4694 6.50549 12.4969 6.44444 12.4995 6.37989V4.61989C12.4968 4.42271 12.4166 4.23451 12.2763 4.09601C12.1359 3.95751 11.9466 3.87987 11.7495 3.87989H10.7495C9.78184 3.8788 8.82537 4.08638 7.94525 4.48847C7.06513 4.89056 6.28207 5.47771 5.64945 6.20989C5.62576 6.25093 5.61328 6.29749 5.61328 6.34489C5.61328 6.39228 5.62576 6.43884 5.64945 6.47989C5.66638 6.51761 5.69277 6.55033 5.72606 6.57486C5.75935 6.59938 5.79841 6.6149 5.83945 6.61989ZM23.2495 19.3799H22.9995V19.1199C22.9968 18.7901 22.864 18.4747 22.6298 18.2425C22.3957 18.0102 22.0792 17.8799 21.7495 17.8799H20.5495C20.503 17.8799 20.4575 17.8928 20.418 17.9172C20.3785 17.9416 20.3466 17.9766 20.3258 18.0181C20.3051 18.0596 20.2963 18.1061 20.3005 18.1523C20.3046 18.1986 20.3216 18.2427 20.3495 18.2799C20.77 18.8009 20.9994 19.4503 20.9995 20.1199C21.0098 20.273 21.0098 20.4267 20.9995 20.5799C20.9895 20.6537 21.0073 20.7285 21.0495 20.7899C21.0987 20.8434 21.1668 20.8757 21.2395 20.8799H23.2895C23.4893 20.8773 23.68 20.796 23.8204 20.6538C23.9608 20.5115 24.0395 20.3197 24.0395 20.1199C24.0383 20.0188 24.0166 19.919 23.9758 19.8264C23.9351 19.7339 23.876 19.6506 23.8022 19.5814C23.7284 19.5123 23.6414 19.4588 23.5464 19.4242C23.4514 19.3896 23.3504 19.3745 23.2495 19.3799Z" />
										<path d="M16.1504 17.7699C16.1809 17.7461 16.2057 17.7158 16.223 17.6812C16.2403 17.6466 16.2496 17.6086 16.2504 17.5699V4.87988C16.2504 4.61467 16.3557 4.36031 16.5433 4.17278C16.7308 3.98524 16.9852 3.87988 17.2504 3.87988H17.7504C18.0156 3.87988 18.2699 3.77453 18.4575 3.58699C18.645 3.39945 18.7504 3.1451 18.7504 2.87988C18.7504 2.61467 18.645 2.36031 18.4575 2.17278C18.2699 1.98524 18.0156 1.87988 17.7504 1.87988H17.2504C16.4547 1.87988 15.6917 2.19595 15.1291 2.75856C14.5664 3.32117 14.2504 4.08423 14.2504 4.87988V17.6199C14.2504 17.6871 14.2244 17.7518 14.1778 17.8003C14.1312 17.8488 14.0676 17.8773 14.0004 17.8799H12.7504C12.6832 17.8773 12.6196 17.8488 12.573 17.8003C12.5263 17.7518 12.5003 17.6871 12.5004 17.6199V7.87988C12.5004 7.81262 12.4744 7.74796 12.4278 7.69948C12.3812 7.651 12.3176 7.62247 12.2504 7.61988H4.88037C4.83158 7.61971 4.7838 7.63382 4.74294 7.66048C4.70207 7.68713 4.66989 7.72516 4.65037 7.76988C4.55411 7.96425 4.4706 8.16467 4.40037 8.36988C4.13313 9.08981 3.99764 9.85196 4.00037 10.6199V13.1199C4.00042 13.1871 3.97441 13.2518 3.92779 13.3003C3.88117 13.3488 3.81758 13.3773 3.75037 13.3799H3.44037C2.78991 13.3761 2.15949 13.6048 1.66265 14.0246C1.16581 14.4445 0.835201 15.0279 0.730374 15.6699L0.000373578 19.9999C-0.0196567 20.1078 -0.0147524 20.2189 0.0147115 20.3246C0.0441755 20.4303 0.0974192 20.5279 0.170374 20.6099C0.240129 20.6928 0.327472 20.7592 0.426064 20.8041C0.524655 20.8491 0.632023 20.8716 0.740374 20.8699H1.74037C1.78975 20.8799 1.84099 20.8747 1.88739 20.8551C1.93378 20.8355 1.97316 20.8023 2.00037 20.7599C2.0242 20.7328 2.0419 20.701 2.05225 20.6664C2.06261 20.6319 2.06538 20.5956 2.06037 20.5599C2.04419 20.4137 2.04419 20.2661 2.06037 20.1199C2.06037 19.3242 2.37644 18.5612 2.93905 17.9986C3.50166 17.436 4.26472 17.1199 5.06037 17.1199C5.85602 17.1199 6.61908 17.436 7.18169 17.9986C7.7443 18.5612 8.06037 19.3242 8.06037 20.1199C8.07076 20.273 8.07076 20.4267 8.06037 20.5799C8.03507 20.6476 8.03507 20.7222 8.06037 20.7899C8.10961 20.8434 8.17775 20.8757 8.25037 20.8799H14.8504C14.923 20.8757 14.9911 20.8434 15.0404 20.7899C15.0657 20.7222 15.0657 20.6476 15.0404 20.5799C15.03 20.4267 15.03 20.273 15.0404 20.1199C15.0374 19.67 15.1355 19.2252 15.3277 18.8184C15.5198 18.4117 15.801 18.0533 16.1504 17.7699ZM9.75037 12.9999C9.72379 13.1075 9.66221 13.2032 9.57533 13.2719C9.48845 13.3407 9.38118 13.3787 9.27037 13.3799H6.78037C6.64857 13.3773 6.52287 13.3238 6.42965 13.2306C6.33643 13.1374 6.28293 13.0117 6.28037 12.8799V10.6199C6.28283 10.2495 6.32643 9.8806 6.41037 9.51988C6.43132 9.40777 6.49073 9.30647 6.57835 9.23345C6.66597 9.16043 6.77632 9.12027 6.89037 9.11988H10.0004C10.133 9.11988 10.2602 9.17256 10.3539 9.26633C10.4477 9.3601 10.5004 9.48727 10.5004 9.61988L9.75037 12.9999Z" />
										<path d="M3 20.1299C3 20.6603 3.21071 21.169 3.58579 21.5441C3.96086 21.9192 4.46957 22.1299 5 22.1299C5.53043 22.1299 6.03914 21.9192 6.41421 21.5441C6.78929 21.169 7 20.6603 7 20.1299C7 19.5994 6.78929 19.0907 6.41421 18.7157C6.03914 18.3406 5.53043 18.1299 5 18.1299C4.46957 18.1299 3.96086 18.3406 3.58579 18.7157C3.21071 19.0907 3 19.5994 3 20.1299ZM16 20.1299C16 20.6603 16.2107 21.169 16.5858 21.5441C16.9609 21.9192 17.4696 22.1299 18 22.1299C18.5304 22.1299 19.0391 21.9192 19.4142 21.5441C19.7893 21.169 20 20.6603 20 20.1299C20 19.5994 19.7893 19.0907 19.4142 18.7157C19.0391 18.3406 18.5304 18.1299 18 18.1299C17.4696 18.1299 16.9609 18.3406 16.5858 18.7157C16.2107 19.0907 16 19.5994 16 20.1299Z" />
									</g>
								</svg>
								Тягачи</Link>
						</li>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/trade/trailer') ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200 linkSvgPathDark', `${pathname.startsWith('/dashboard/trade/trailer') ? 'text-background' : ''}`)}
								href={'/dashboard/trade/trailer'}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-4 h-4 transition-all duration-200 hover:svgPathDark', `${pathname.startsWith('/dashboard/trade/trailer') ? 'svgPathDark' : 'svgPathAccent'}`)}>
									<path d="M22 15V17H10C10 17.7956 9.68393 18.5587 9.12132 19.1213C8.55871 19.6839 7.79565 20 7 20C6.20435 20 5.44129 19.6839 4.87868 19.1213C4.31607 18.5587 4 17.7956 4 17H2V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H17C17.5304 4 18.0391 4.21071 18.4142 4.58579C18.7893 4.96086 19 5.46957 19 6V15H22ZM7 16C6.73478 16 6.48043 16.1054 6.29289 16.2929C6.10536 16.4804 6 16.7348 6 17C6 17.2652 6.10536 17.5196 6.29289 17.7071C6.48043 17.8946 6.73478 18 7 18C7.26522 18 7.51957 17.8946 7.70711 17.7071C7.89464 17.5196 8 17.2652 8 17C8 16.7348 7.89464 16.4804 7.70711 16.2929C7.51957 16.1054 7.26522 16 7 16Z" />
								</svg>
								Прицепы</Link>
						</li>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/trade/parts') ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200 linkSvgPathDark', `${pathname.startsWith('/dashboard/trade/parts') ? 'text-background' : ''}`)}
								href={'/dashboard/trade/parts'}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('w-4 h-4 transition-all duration-200', `${pathname.startsWith('/dashboard/trade/parts') ? 'svgPathDark' : 'svgPathAccent'}`)}>
									<g clipPath="url(#clip0_2963_1461)">
										<path d="M11.3159 0.984375L10.6025 2.61328C10.2332 2.63579 9.86572 2.68229 9.50245 2.7525L8.41111 1.34325L7.23483 1.74319L7.22897 3.53616C6.73069 3.79228 6.25317 4.10194 5.80209 4.46334L4.13967 3.71484L3.28856 4.62014L4.13962 6.23437C3.8681 6.62146 3.62949 7.03061 3.42628 7.45753L1.60106 7.50731L1.23047 8.69231L2.70412 9.77784C2.63358 10.2175 2.59912 10.6618 2.59716 11.1065L0.960938 11.9355L1.13231 13.166L2.92823 13.5176C3.03565 13.8935 3.16878 14.2615 3.32667 14.6191L2.14313 16.0884L2.80373 17.1401L4.64358 16.7095C4.76 16.8465 4.88065 16.9798 5.00536 17.1093C5.26579 17.3788 5.54324 17.6312 5.83598 17.8652L5.47856 19.708L6.55378 20.3291L7.95853 19.1059C8.36049 19.2675 8.77433 19.3977 9.19636 19.4955L9.65489 21.2958L10.8926 21.3969L11.6368 19.6991C12.151 19.6682 12.6635 19.5913 13.1675 19.4677L14.3497 20.8373L15.5025 20.3759L15.4688 19.6815L12.7778 17.6411C11.9945 17.8391 11.1821 17.8921 10.3843 17.8021C8.8958 17.6343 7.46536 16.9621 6.3428 15.8012C3.77695 13.1475 3.85031 8.92608 6.50395 6.36033C7.78927 5.11753 9.44255 4.48706 11.0977 4.4692C12.8597 4.45017 14.6234 5.12527 15.9464 6.49359C18.0996 8.72072 18.393 12.071 16.8633 14.6074L18.3619 15.7441C18.5483 15.452 18.7166 15.1487 18.8658 14.8359L20.6778 14.7861L21.0484 13.6011L19.5851 12.523C19.6557 12.0797 19.6915 11.6315 19.692 11.1826L21.318 10.3565L21.1466 9.126L19.3522 8.77444C19.2013 8.25466 19.0011 7.75044 18.7546 7.26858L19.8238 5.78761L19.109 4.77244L17.3483 5.28366C17.3262 5.26022 17.3048 5.23645 17.2823 5.21334C17.0052 4.92663 16.7086 4.65937 16.3947 4.41347L16.7316 2.67323L15.6562 2.05219L14.3203 3.21534C13.8878 3.0413 13.4437 2.90583 12.9931 2.80519L12.5552 1.08544L11.3159 0.984375ZM8.58984 8.17969C8.10497 8.18522 7.62436 8.30428 7.18359 8.52094L9.30328 10.1294C9.94434 10.6158 10.1262 11.5401 9.63422 12.189C9.14212 12.8382 8.19722 12.9358 7.54688 12.4425L5.42869 10.8355C5.2118 11.9977 5.62252 13.2291 6.62841 13.9922C7.53052 14.6765 8.68828 14.8046 9.68559 14.4464L9.90966 14.3657L10.0986 14.5093L16.4356 19.317L16.6245 19.4605L16.6084 19.6979C16.5316 20.7549 16.9642 21.8358 17.8667 22.5205C18.8726 23.2837 20.1704 23.3469 21.2314 22.8252L19.1133 21.2183C18.4629 20.7249 18.3032 19.7884 18.7955 19.1397C19.2877 18.491 20.2269 18.4176 20.8681 18.9038L22.9863 20.5109C23.2027 19.3491 22.7937 18.1171 21.7881 17.3541C20.8828 16.667 19.7341 16.5309 18.7427 16.8838L18.52 16.9629L18.3311 16.8194L11.9941 12.0118L11.8052 11.8682L11.8213 11.6324C11.894 10.583 11.4533 9.51394 10.5483 8.82717C9.96033 8.38111 9.2723 8.17195 8.58989 8.17973L8.58984 8.17969ZM10.6319 12.4102L18.3135 18.2388L17.7847 18.9375L10.1016 13.1074L10.6319 12.4102Z" />
									</g>
								</svg> Запчасти</Link>
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
									className={cn('transition-all duration-200', `${pathname === '/dashboard/vacancy/search' ? '!text-background' : ''}`)}
									size={16}
								/> Найти</Link>
						</li>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname === '/dashboard/vacancy/wishlist' ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname === '/dashboard/vacancy/wishlist' ? 'text-background' : ''}`)}
								href={'/dashboard/vacancy/wishlist'}
							><Star
									className={cn('transition-all duration-200', `${pathname === '/dashboard/vacancy/wishlist' ? '!text-background' : ''}`)}
									size={16}
								/> Избранные</Link>
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

				<div className="grid gap-2">
					<p className=' font-bold'>Меню</p>
					<ul className=' grid gap-2'>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/vacancy') ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname.startsWith('/dashboard/vacancy') ? 'text-background' : ''}`)}
								href={'/dashboard/vacancy'}
							><SquareUserRound
									className={cn('transition-all duration-200', `${pathname.startsWith('/dashboard/vacancy') ? '!text-background' : ''}`)}
									size={16}
								/> Вакансии</Link>
						</li>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/review') ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname.startsWith('/dashboard/review') ? 'text-background' : ''}`)}
								href={'/dashboard/review'}
							><MessageCircleMore
									className={cn('transition-all duration-200', `${pathname.startsWith('/dashboard/review') ? '!text-background' : ''}`)}
									size={16}
								/> Черный список / Отзывы</Link>
						</li>
						<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/support') ? 'bg-(--dark-accent)' : ''}`)}>
							<Link
								className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname.startsWith('/dashboard/support') ? 'text-background' : ''}`)}
								href='https://t.me/itranzit_kz'
								target='_blank'
							><ShieldUser
									className={cn('transition-all duration-200', `${pathname.startsWith('/dashboard/support') ? '!text-background' : ''}`)}
									size={16}
								/> Написать администратору</Link>
						</li>
						{user?.role === 'ADMIN' && (
							<>
								<li className={cn('px-3 rounded-sm hover:bg-(--dark-accent) asideLink transition-all duration-200', `${pathname.startsWith('/dashboard/admin') ? 'bg-(--dark-accent)' : ''}`)}>
									<Link
										className={cn('text-(--dark-accent) flex gap-2 items-center hover:text-background transition-all duration-200', `${pathname.startsWith('/dashboard/admin') ? 'text-background' : ''}`)}
										href={'/dashboard/admin'}
									><ShieldCheck
											className={cn('transition-all duration-200', `${pathname.startsWith('/dashboard/admin') ? '!text-background' : ''}`)}
											size={16}
										/> Администратор</Link>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</aside>
	)
}
