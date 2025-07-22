"use client"
import ReviewSearchItem from './ReviewSearchItem'
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore'

export default function ReviewSearchList() {

	const { searchReviews } = useReviewSearchStore()

	if (!Array.isArray(searchReviews) || searchReviews.length === 0) {
		return null
	}

	return (
		<div className='grid gap-5'>
			{searchReviews.map((review) => (
				<ReviewSearchItem key={review.id} review={review} />
			))}
		</div>
	)
}
