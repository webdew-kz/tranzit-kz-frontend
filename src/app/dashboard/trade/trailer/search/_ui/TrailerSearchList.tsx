"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { findAll } from '../actions'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { useTrailerStore } from '@/shared/store/useTrailerStore'
import { useTrailerSearchStore } from '@/shared/store/useTrailerSearchStore'
import TrailerSearchItem from './TrailerSearchItem'



export default function TrailerSearchList() {

	const { searchTrailers, setSearchTrailers } = useTrailerSearchStore()
	const { trailers, setTrailers } = useTrailerStore()
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(true);

	const [pending, startTransition] = useTransition()

	const [wishlistLength, setWishlistLength] = useState(0)

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("wishlistTrailers") || "[]");
		setWishlistLength(stored.length);
	}, []);

	const firstLoad = () => {

		startTransition(async () => {
			try {
				const res = await findAll(page);
				setTrailers(res.trailers);
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
			const merged = [...useTrailerStore.getState().trailers, ...res.trailers];
			const unique = Array.from(new Map(merged.map(t => [t.id, t])).values());

			useTrailerStore.getState().setTrailers(unique);

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка загрузки:", err);
		}
	};

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	const handleShowAllTrailers = useCallback(async () => {
		setSearchTrailers([])
		setTrailers([])
		firstLoad()
	}, [])




	if (pending || isLoad) {
		return <Loader />
	}

	return (
		searchTrailers.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 z-10">
						<span>Найдено: {searchTrailers.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllTrailers}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все прицепы</Button>
					</div>
					{searchTrailers.map((trailer) => (
						<TrailerSearchItem
							key={trailer.id}
							trailerInitial={trailer}
						/>
					))}
				</div>
			</>
		) : (
			trailers?.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 z-10">
							<span>Всего прицепов: {total}</span>

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/trade/trailer/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/trade/trailer/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{trailers.map((trailer) => (
							<TrailerSearchItem
								key={trailer.id}
								trailerInitial={trailer}
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
					<span>Прицепы не найдены</span>
					<Button
						variant='link'
						onClick={handleShowAllTrailers}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все прицепы</Button>
				</div>
			)
		)
	)
}
