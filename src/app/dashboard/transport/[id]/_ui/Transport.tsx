'use client'

import React, { useEffect, useState } from 'react'
import TransportSearchItem from '../../search/_ui/TransportSearchItem'
import { ITransport } from '@/shared/types/transport.type'
import { findById } from '../actions'
import { useRouter } from 'next/navigation'
import Loader from '@/shared/components/widgets/Loader'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'

export default function Transport({ id }: { id: string }) {
	const router = useRouter()
	const [transport, setTransport] = useState<ITransport | null>(null)
	// const [loading, setLoading] = useState(true)

	const { rates, loading } = useCurrencyRates()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await findById(id)
				setTransport(res)
				console.log(res);

			} catch (error) {
				console.error("Ошибка загрузки:", error)
				router.push('/dashboard/transport/search')
			}
		}
		fetchData()
	}, [id])

	if (loading || !transport) {
		return <Loader />
	}

	return <TransportSearchItem transport={transport} rates={rates} loading={loading} isContact={false} isWishBtn={false} />
}
