"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { IParts } from '@/shared/types/parts.type'
import Loader from '@/shared/components/widgets/Loader'
import Link from 'next/link'
import { toast } from 'sonner'
import PartsWishItem from './PartsWishItem'
import { useUserStore } from '@/shared/store/useUserStore'
import { Button } from '@/shared/components/ui/button'
import { getUser } from '@/app/dashboard/cargo/add/actions'



export default function PartsWishList() {

	const { user, setUser } = useUserStore()
	const [partss, setPartss] = useState<IParts[]>([])
	const [pending, startTransition] = useTransition()

	useEffect(() => {
		startTransition(async () => {

			try {
				const res = await getUser()

				if (res.user) {
					setUser(prev => ({
						...prev,
						...res.user
					}));
				}

			} catch (error) {
				console.error(error)
			}
		})
	}, []);

	useEffect(() => {
		const fetchData = async () => {

			startTransition(async () => {
				const res = await getWishlist();

				if (res.partss.length === 0) {
					console.log("Empty wishlist → saving to localStorage");
					localStorage.setItem("wishlistPartss", JSON.stringify([]));
				}

				setPartss(res.partss);
			})
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlistPartss", JSON.stringify([]));
		setPartss([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (pending || !user) {
		return <Loader />
	}

	if (!user?.isRegistered && user?.role === 'USER') {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Доступ в данный раздел доступен по ежемесячной абонентской плате.</div>
				<Button
					className=' bg-(--dark-accent)'
					asChild
				>
					<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
				</Button>
			</div>


		)
	}

	return (
		partss.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {partss.length}</span>

						{partss.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{partss?.filter(t => t && t.id).map((parts) => {
						// console.log(parts);
						return (
							<PartsWishItem
								key={parts.id}
								partsInitial={parts}
								setPartss={setPartss}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных запчастей не найдено</span>
				<Link
					href={'/dashboard/trade/parts/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
