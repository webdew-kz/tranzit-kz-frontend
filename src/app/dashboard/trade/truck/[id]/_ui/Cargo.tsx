'use client'

import React, { useEffect, useState } from 'react'
import CargoSearchItem from '../../search/_ui/TruckSearchItem'
import { ICargo } from '@/shared/types/cargo.type'
import { findById } from '../actions'
import { useRouter } from 'next/navigation'
import Loader from '@/shared/components/widgets/Loader'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'

export default function Cargo({ id }: { id: string }) {
	const router = useRouter()
	const [cargo, setCargo] = useState<ICargo | null>(null)
	// const [loading, setLoading] = useState(true)

	const { rates, loading } = useCurrencyRates()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await findById(id)
				setCargo(res)
				console.log(res);

			} catch (error) {
				console.error("Ошибка загрузки:", error)
				router.push('/dashboard/cargo/search')
			}
		}
		fetchData()
	}, [id])

	if (loading || !cargo) {
		return <Loader />
	}

	return <CargoSearchItem cargo={cargo} rates={rates} loading={loading} isContact={false} isWishBtn={false} />
}
