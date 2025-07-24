"use client"
import { useEffect, useState, useTransition } from 'react';
import { IReview } from '@/shared/types/review.type';
import { findAll } from '../actions';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { toast } from 'sonner';
import { Loader, Loader2 } from 'lucide-react';
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore';
import ReviewItem from './ReviewItem';
import ReviewSearchItem from './ReviewSearchItem';

export default function ReviewSearchList() {

	const [reviews, setReviews] = useState<IReview[]>([]);

	const { searchReviews } = useReviewSearchStore()

	const setSearchReviews = useReviewSearchStore((state) => state.setSearchReviews);

	useEffect(() => {
		setSearchReviews([])
	}, [])

	const [pending, startTransition] = useTransition()

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {

		if (!hasMore) return;

		setPage(prev => prev + 1);

		startTransition(async () => {

			try {

				const res = await findAll(page);

				setReviews(prev => {
					const merged = [...prev, ...res.reviews];

					// Удаляем дубликаты по `id`
					const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

					return unique;
				});

				setHasMore(res.hasMore);

			} catch (err) {
				console.error("Ошибка загрузки:", err);
			}
		})



	};

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	useEffect(() => {

		fetchData().catch((error) => console.error(error));

		const interval = setInterval(() => {
			fetchData().catch(console.error);
		}, 60_000); // каждые 60 секунд

		return () => clearInterval(interval);

	}, [])

	const fetchData = async () => {

		startTransition(async () => {

			try {
				const data = await findAll(page)

				if (data.length === 0) {
					toast.error("У вас нет отзывов", {
						position: 'top-center',
					});

					return

				} else {

					// const sortedData = data.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));

					setReviews(data.reviews)
				}
			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		})
	};

	if (pending) {
		return <Loader />
	}

	return (
		<>
			{(searchReviews && searchReviews.length) ? (
				searchReviews
					.map((review) => (
						<ReviewSearchItem
							key={review.id}
							review={review}
							setSearchReviews={setSearchReviews}
						/>
					))
			) : (
				<>
					<div className='grid gap-5'>
						{reviews.map((review) => (
							<ReviewItem key={review.id} review={review} setReviews={setReviews} />
						))}

						{!reviews.length && (
							<div className='flex justify-center items-center'>
								<p className='text-muted-foreground'>У вас нет отзывов</p>
							</div>
						)}
						{isLoading &&
							<div className="flex justify-center items-center">
								<Loader2 className="animate-spin" />
							</div>
						}
					</div>
					{
						hasMore && (
							<div ref={bottomRef} className="h-10" />
						)
					}
				</>
			)}

		</>
	)
}
