"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { findAll } from '../actions'
import { IReview } from '@/shared/types/review.type'
import ReviewSearchItem from './ReviewSearchItem'
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { useReviewStore } from '@/shared/store/useReviewStore'



export default function ReviewSearchList() {


	const { rates, loading } = useCurrencyRates()
	const { searchReviews, setSearchReviews } = useReviewSearchStore()
	// const [reviews, setReviews] = useState<IReview[]>([])
	const { reviews, setReviews } = useReviewStore()
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(false);

	const [wishlistLength, setWishlistLength] = useState(0)

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("wishlistReview") || "[]");
		setWishlistLength(stored.length);
	}, []);

	const loadMore = async () => {
		if (!hasMore) return;

		setPage(prev => prev + 1); // сразу увеличиваем

		try {
			const res = await findAll(page);
			// setReviews(prev => {
			// 	const merged = [...prev, ...res.reviews];

			// 	// Удаляем дубликаты по `id`
			// 	const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

			// 	return unique;
			// });
			const existing = useReviewStore.getState().reviews;
			const merged = [...existing, ...res.reviews];
			const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

			setReviews(unique);

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка загрузки:", err);
		}
	};

	const firstLoad = async () => {

		setIsLoad(true)
		try {
			const res = await findAll(page);
			setReviews(res.reviews);
			setTotal(res.total)
		} catch (error) {
			console.error("Ошибка загрузки:", error);
		} finally {
			setIsLoad(false)
		}

	}

	useEffect(() => {
		firstLoad();
	}, []);

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	const handleShowAllReviews = useCallback(async () => {
		setSearchReviews([])
		setReviews([])
		firstLoad()
	}, [])




	if (isLoad || loading) {
		return <Loader />
	}

	return (
		searchReviews.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center">
						<span>Найдено: {searchReviews.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllReviews}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все отзывы</Button>
					</div>
					{searchReviews.map((review) => (
						<ReviewSearchItem
							key={review.id}
							review={review}
							loading={loading}
							rates={rates}
						/>
					))}
				</div>
			</>
		) : (
			reviews.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5">
							<span>Всего грузов: {total}</span>

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/review/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/review/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{reviews.map((review) => (
							<ReviewSearchItem
								key={review.id}
								review={review}
								loading={loading}
								rates={rates}
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
					<span>Вакансии не найдены</span>
					<Button
						variant='link'
						onClick={handleShowAllReviews}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все вакансии</Button>
				</div>
			)
		)
	)
}
