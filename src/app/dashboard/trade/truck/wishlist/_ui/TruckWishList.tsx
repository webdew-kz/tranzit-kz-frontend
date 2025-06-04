"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ITruck } from '@/shared/types/truck.type'
import Loader from '@/shared/components/widgets/Loader'
import Link from 'next/link'
import { toast } from 'sonner'
import TruckWishItem from './TruckWishItem'



export default function TruckWishList() {

	// const { rates, loading } = useCurrencyRates()
	const [trucks, setTrucks] = useState<ITruck[]>([])
	const [pending, startTransition] = useTransition()

	useEffect(() => {
		const fetchData = async () => {

			startTransition(async () => {
				const res = await getWishlist();
				setTrucks(res.trucks);
			})
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlist", JSON.stringify([]));
		setTrucks([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (pending) {
		return <Loader />
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
