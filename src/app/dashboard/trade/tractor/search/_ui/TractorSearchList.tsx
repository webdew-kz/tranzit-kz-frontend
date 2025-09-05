"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { findAll } from '../actions'
import { ITractor } from '@/shared/types/tractor.type'
import TractorSearchItem from './TractorSearchItem'
import { useTractorSearchStore } from '@/shared/store/useTractorSearchStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { useTractorStore } from '@/shared/store/useTractorStore'



export default function TractorSearchList() {


	// const { rates, loading } = useCurrencyRates()
	const { searchTractors, setSearchTractors } = useTractorSearchStore()
	const { tractors, setTractors } = useTractorStore()
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(true);

	const [pending, startTransition] = useTransition()

	const [wishlistLength, setWishlistLength] = useState(0)

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("wishlistTractors") || "[]");
		setWishlistLength(stored.length);
	}, []);

	const firstLoad = () => {

		startTransition(async () => {
			try {
				const res = await findAll(page);
				setTractors(res.tractors);
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
			const merged = [...useTractorStore.getState().tractors, ...res.tractors];
			const unique = Array.from(new Map(merged.map(t => [t.id, t])).values());

			useTractorStore.getState().setTractors(unique);

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка загрузки:", err);
		}
	};

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	const handleShowAllTractors = useCallback(async () => {
		setSearchTractors([])
		setTractors([])
		firstLoad()
	}, [])




	if (pending || isLoad) {
		return <Loader />
	}

	return (
		searchTractors.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 px-3 z-10">
						<span>Найдено: {searchTractors.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllTractors}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все тягачи</Button>
					</div>
					{searchTractors.map((tractor) => (
						<TractorSearchItem
							key={tractor.id}
							tractorInitial={tractor}
						/>
					))}
				</div>
			</>
		) : (
			tractors?.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 px-3 z-10">
							<span>Всего: {total}</span>

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/trade/tractor/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/trade/tractor/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{tractors.map((tractor) => (
							<TractorSearchItem
								key={tractor.id}
								tractorInitial={tractor}
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
					<span>Тягачи не найдены</span>
					<Button
						variant='link'
						onClick={handleShowAllTractors}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все тягачи</Button>
				</div>
			)
		)
	)
}
