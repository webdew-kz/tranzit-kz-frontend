"use client"
import ReviewSearchItem from './ReviewSearchItem'
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore'

export default function ReviewSearchList() {

	const { searchReviews } = useReviewSearchStore()

	return (
		searchReviews.length && searchReviews.length > 0 && (
			<div className='grid gap-5'>
				{searchReviews.map((review) => (
					<ReviewSearchItem
						key={review.id}
						review={review}
					/>
				))}
			</div>
		)
	)
}
