'use client'

import React, { useEffect, useState } from 'react'
import VacancySearchItem from '../../search/_ui/VacancySearchItem'
import { IVacancy } from '@/shared/types/vacancy.type'
import { findById } from '../actions'
import { useRouter } from 'next/navigation'
import Loader from '@/shared/components/widgets/Loader'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'

export default function Vacancy({ id }: { id: string }) {
	const router = useRouter()
	const [vacancy, setVacancy] = useState<IVacancy | null>(null)
	// const [loading, setLoading] = useState(true)

	const { rates, loading } = useCurrencyRates()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await findById(id)
				setVacancy(res)
				console.log(res);

			} catch (error) {
				console.error("Ошибка загрузки:", error)
				router.push('/dashboard/vacancy/search')
			}
		}
		fetchData()
	}, [id])

	if (loading || !vacancy) {
		return <Loader />
	}

	return <VacancySearchItem vacancy={vacancy} rates={rates} loading={loading} isContact={false} isWishBtn={false} />
}
