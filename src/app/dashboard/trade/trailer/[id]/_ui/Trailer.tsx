'use client'

import React, { useEffect, useState, useTransition } from 'react'
import TrailerSearchItem from '../../search/_ui/TrailerSearchItem'
import { ITrailer } from '@/shared/types/trailer.type'
import { findById } from '../actions'
import Loader from '@/shared/components/widgets/Loader'

export default function Trailer({ id }: { id: string }) {

	const [trailer, setTrailer] = useState<ITrailer>()
	const [pending, startTransition] = useTransition()


	useEffect(() => {
		const fetchData = async () => {
			startTransition(async () => {
				const res = await findById(id)

				setTrailer(res.trailer)
			})
		}
		fetchData()
	}, [id])

	if (pending || !trailer) {
		return <Loader />
	}

	return <TrailerSearchItem trailerInitial={trailer} isContact={false} isWishBtn={false} />
}
