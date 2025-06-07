'use client'

import React, { useEffect, useState, useTransition } from 'react'
import TractorSearchItem from '../../search/_ui/TractorSearchItem'
import { ITractor } from '@/shared/types/tractor.type'
import { findById } from '../actions'
import Loader from '@/shared/components/widgets/Loader'

export default function Tractor({ id }: { id: string }) {

	const [tractor, setTractor] = useState<ITractor>()
	const [pending, startTransition] = useTransition()


	useEffect(() => {
		const fetchData = async () => {
			startTransition(async () => {
				const res = await findById(id)

				setTractor(res.tractor)
			})
		}
		fetchData()
	}, [id])

	if (pending || !tractor) {
		return <Loader />
	}

	return <TractorSearchItem tractorInitial={tractor} isContact={false} isWishBtn={false} />
}
