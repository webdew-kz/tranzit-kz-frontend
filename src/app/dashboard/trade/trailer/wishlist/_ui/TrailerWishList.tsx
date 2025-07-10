"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ITrailer } from '@/shared/types/trailer.type'
import Loader from '@/shared/components/widgets/Loader'
import Link from 'next/link'
import { toast } from 'sonner'
import TrailerWishItem from './TrailerWishItem'



export default function TrailerWishList() {

	// const { rates, loading } = useCurrencyRates()
	const [trailers, setTrailers] = useState<ITrailer[]>([])
	const [pending, startTransition] = useTransition()

	useEffect(() => {
		const fetchData = async () => {

			startTransition(async () => {
				const res = await getWishlist();

				if (res.trailers.length === 0) {
					localStorage.setItem("wishlistTrailers", JSON.stringify([]));
				}
				setTrailers(res.trailers);
			})
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlistTrailers", JSON.stringify([]));
		setTrailers([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (pending) {
		return <Loader />
	}

	return (
		trailers.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {trailers.length}</span>

						{trailers.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{trailers?.filter(t => t && t.id).map((trailer) => {
						// console.log(trailer);
						return (
							<TrailerWishItem
								key={trailer.id}
								trailerInitial={trailer}
								setTrailers={setTrailers}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных прицепов не найдено</span>
				<Link
					href={'/dashboard/trade/trailer/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
