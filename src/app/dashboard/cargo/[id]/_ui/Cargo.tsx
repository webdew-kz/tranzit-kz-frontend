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
import { User } from '@/shared/types/user.type'

export default function Cargo({ id }: { id: string }) {

	const [isRegistered, setIsRegistered] = useState(false)

	const [pending, startTransition] = useTransition()

	const router = useRouter()

	const [cargo, setCargo] = useState<ICargo | null>(null)

	const { rates, loading } = useCurrencyRates()

	useEffect(() => {
		startTransition(async () => {

			try {
				const res = await getUser()
				console.log(res);

				if (res.user) {
					setIsRegistered(res.user.isRegistered)
				}



			} catch (error) {
				console.error(error)
			}
		})
	}, []);

	useEffect(() => {
		startTransition(async () => {
			try {
				const res = await findById(id)
				setCargo(res)

			} catch (error) {
				console.error("Ошибка загрузки:", error)
				router.push('/dashboard/cargo/search')
			}
		})
	}, [id])

	if (loading || !cargo || pending) {
		return <Loader />
	}

	return <CargoSearchItem cargo={cargo} rates={rates} loading={loading} isContact={true} isWishBtn={false} isRegistered={isRegistered} />
}
