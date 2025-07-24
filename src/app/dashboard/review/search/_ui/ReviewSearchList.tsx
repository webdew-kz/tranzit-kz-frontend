"use client"
import { useEffect } from 'react';
import ReviewSearchItem from './ReviewSearchItem'
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore'

export default function ReviewSearchList() {

	const { searchReviews } = useReviewSearchStore()

	const setSearchReviews = useReviewSearchStore((state) => state.setSearchReviews);

	useEffect(() => {
		setSearchReviews([])
	}, [])

	const averageRating = useReviewSearchStore(state => state.averageRating);

	if (!Array.isArray(searchReviews) || searchReviews.length === 0) {
		return null
	}

	return (
		<div className='grid gap-5'>
			<h2 className=' text-xl text-(--dark-accent) text-center font-bold'>Средний рейтинг: {averageRating}</h2>
			{searchReviews
				.filter((review) => !review.isBlocked) // оставляем только не заблокированные
				.map((review) => (
					<ReviewSearchItem
						key={review.id}
						review={review}
						setSearchReviews={setSearchReviews}
					/>
				))}
		</div>
	)
}
