'use client'

import React, { useEffect, useState, useTransition } from 'react'
import TruckSearchItem from '../../search/_ui/TruckSearchItem'
import { ITruck } from '@/shared/types/truck.type'
import { findById } from '../actions'
import Loader from '@/shared/components/widgets/Loader'

export default function Truck({ id }: { id: string }) {

	const [truck, setTruck] = useState<ITruck>()
	const [pending, startTransition] = useTransition()


	useEffect(() => {
		const fetchData = async () => {
			startTransition(async () => {
				const res = await findById(id)

				setTruck(res.truck)
			})
		}
		fetchData()
	}, [id])

	if (pending || !truck) {
		return <Loader />
	}

	return <TruckSearchItem truckInitial={truck} isContact={false} isWishBtn={false} />
}
