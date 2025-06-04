"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { findAll } from '../actions'
import { ITruck } from '@/shared/types/truck.type'
import TruckSearchItem from './TruckSearchItem'
import { useTruckSearchStore } from '@/shared/store/useTruckSearchStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { useTruckStore } from '@/shared/store/useTruckStore'



export default function TruckSearchList() {


	// const { rates, loading } = useCurrencyRates()
	const { searchTrucks, setSearchTrucks } = useTruckSearchStore()
	const { trucks, setTrucks } = useTruckStore()
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(true);

	const [pending, startTransition] = useTransition()

	const [wishlistLength, setWishlistLength] = useState(0)

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("wishlistTrucks") || "[]");
		setWishlistLength(stored.length);
	}, []);

	const firstLoad = () => {

		startTransition(async () => {
			try {
				const res = await findAll(page);
				setTrucks(res.trucks);
				setTotal(res.total)
				setHasMore(res.hasMore);
				setIsLoad(false);
			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		})

	}

	useEffect(() => {

		firstLoad();

	}, []);

	const loadMore = async () => {
		if (!hasMore) return;

		setPage(prev => prev + 1); // сразу увеличиваем

		try {
			const res = await findAll(page);
			const merged = [...useTruckStore.getState().trucks, ...res.trucks];
			const unique = Array.from(new Map(merged.map(t => [t.id, t])).values());

			useTruckStore.getState().setTrucks(unique);

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка загрузки:", err);
		}
	};

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	const handleShowAllTrucks = useCallback(async () => {
		setSearchTrucks([])
		setTrucks([])
		firstLoad()
	}, [])




	if (pending || isLoad) {
		return <Loader />
	}

	return (
		searchTrucks.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 z-10">
						<span>Найдено: {searchTrucks.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllTrucks}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все грузовики</Button>
					</div>
					{searchTrucks.map((truck) => (
						<TruckSearchItem
							key={truck.id}
							truckInitial={truck}
						/>
					))}
				</div>
			</>
		) : (
			trucks.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 z-10">
							<span>Всего грузовиков: {total}</span>

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/trade/	truck/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/trade/	truck/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{trucks.map((truck) => (
							<TruckSearchItem
								key={truck.id}
								truckInitial={truck}
								setWishlistLength={setWishlistLength}
							/>
						))}
						{isLoading &&
							<div className="flex justify-center items-center">
								<Loader2 className="animate-spin" />
							</div>
						}
					</div>
					{hasMore && (
						<div ref={bottomRef} className="h-10" />
					)}
				</>
			) : (
				<div className="flex flex-col items-center gap-5 justify-center py-5">
					<span>Грузовики не найдены</span>
					<Button
						variant='link'
						onClick={handleShowAllTrucks}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все грузовики</Button>
				</div>
			)
		)
	)
}
