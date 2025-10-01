"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ITruck } from '@/shared/types/truck.type'
import Loader from '@/shared/components/widgets/Loader'
import Link from 'next/link'
import { toast } from 'sonner'
import TruckWishItem from './TruckWishItem'
import { Button } from '@/shared/components/ui/button'
import { useUserStore } from '@/shared/store/useUserStore'
import { getUser } from '@/app/dashboard/cargo/add/actions'



export default function TruckWishList() {

	const { user, setUser } = useUserStore()
	const [trucks, setTrucks] = useState<ITruck[]>([])
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
				if (res.trucks.length === 0) {
					localStorage.setItem("wishlistTrucks", JSON.stringify([]));
				}
				setTrucks(res.trucks);
			})
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlistTrucks", JSON.stringify([]));
		setTrucks([]);
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
				<div className="text-center">Доступ в данный раздел доступен по абонентской плате.</div>
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
		trucks.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {trucks.length}</span>

						{trucks.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{trucks?.filter(t => t && t.id).map((truck) => {
						// console.log(truck);
						return (
							<TruckWishItem
								key={truck.id}
								truckInitial={truck}
								setTrucks={setTrucks}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных грузов не найдено</span>
				<Link
					href={'/dashboard/trade/truck/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
