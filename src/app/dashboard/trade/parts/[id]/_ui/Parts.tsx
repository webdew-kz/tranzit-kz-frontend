'use client'

import React, { useEffect, useState, useTransition } from 'react'
import PartsSearchItem from '../../search/_ui/PartsSearchItem'
import { IParts } from '@/shared/types/parts.type'
import { findById } from '../actions'
import Loader from '@/shared/components/widgets/Loader'

export default function Parts({ id }: { id: string }) {

	const [parts, setParts] = useState<IParts>()
	const [pending, startTransition] = useTransition()


	useEffect(() => {
		const fetchData = async () => {
			startTransition(async () => {
				const res = await findById(id)

				setParts(res.parts)
			})
		}
		fetchData()
	}, [id])

	if (pending || !parts) {
		return <Loader />
	}

	return <PartsSearchItem partsInitial={parts} isContact={false} isWishBtn={false} />
}
