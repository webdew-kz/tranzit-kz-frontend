'use client'

import React, { useEffect, useState, useTransition } from 'react'
import BrokerSearchItem from '../../search/_ui/BrokerSearchItem'
import { IBroker } from '@/shared/types/broker.type'
import { findById } from '../actions'
import { useRouter } from 'next/navigation'
import Loader from '@/shared/components/widgets/Loader'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { useUserStore } from '@/shared/store/useUserStore'
import { getUser } from '../../add/actions'
import { User } from '@/shared/types/user.type'

export default function Broker({ id }: { id: string }) {

	const [isRegistered, setIsRegistered] = useState(false)

	const [pending, startTransition] = useTransition()

	const router = useRouter()

	const [broker, setBroker] = useState<IBroker | null>(null)

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
				setBroker(res)

			} catch (error) {
				console.error("Ошибка загрузки:", error)
				router.push('/dashboard/broker/search')
			}
		})
	}, [id])

	if (loading || !broker || pending) {
		return <Loader />
	}

	return <BrokerSearchItem broker={broker} rates={rates} loading={loading} isContact={true} isWishBtn={false} isRegistered={isRegistered} />
}
