'use client'

import React, { useEffect, useState, useTransition } from 'react'
import CargoSearchItem from '../../search/_ui/CargoSearchItem'
import { ICargo } from '@/shared/types/cargo.type'
import { findById } from '../actions'
import { useRouter } from 'next/navigation'
import Loader from '@/shared/components/widgets/Loader'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { useUserStore } from '@/shared/store/useUserStore'
import { getUser } from '../../add/actions'

export default function Cargo({ id }: { id: string }) {
	const router = useRouter()
	const [cargo, setCargo] = useState<ICargo | null>(null)
	// const [loading, setLoading] = useState(true)

	const { rates, loading } = useCurrencyRates()

	const [pending, startTransition] = useTransition()

	const { user, setUser } = useUserStore()

	if (pending) {
		return (
			<Loader />
		)
	}

	useEffect(() => {
		startTransition(async () => {

			try {
				const res = await getUser()

				if (res.user) {
					setUser(prev => ({
						...prev,
						...res.user
					}));
				}



			} catch (error) {
				console.error(error)
			}
		})
	}, []);

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

	return <CargoSearchItem cargo={cargo} rates={rates} loading={loading} isContact={false} isWishBtn={false} customUser={user} />
}
