"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { IVacancy } from '@/shared/types/vacancy.type'
import Loader from '@/shared/components/widgets/Loader'
import VacancyWishItem from './VacancyWishItem'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import Link from 'next/link'
import { toast } from 'sonner'
import { useUserStore } from '@/shared/store/useUserStore'
import { Button } from '@/shared/components/ui/button'



export default function VacancyWishList() {

	const { user } = useUserStore()

	const { rates, loading } = useCurrencyRates()
	const [vacancys, setVacancys] = useState<IVacancy[]>([])

	useEffect(() => {
		const fetchData = async () => {

			try {
				const res = await getWishlist();
				setVacancys(Array.isArray(res.vacancys) ? res.vacancys.filter((c: IVacancy | null | undefined): c is IVacancy => c !== null && c !== undefined && c.id !== undefined) : []);

			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlistVacancy", JSON.stringify([]));
		setVacancys([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (loading || !rates) {
		return <Loader />
	}

	if (!user?.isRegistered && user?.role === 'USER') {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Доступ в данный раздел доступен по абонентской плате — 1000 тенге в месяц.</div>
				<Button
					className=' bg-(--dark-accent)'
					asChild
				>
					<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
				</Button>
			</div>


		)
	}

	return (
		vacancys.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {vacancys.length}</span>

						{vacancys.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{vacancys?.map((vacancy) => {
						// console.log(vacancy);
						return (
							<VacancyWishItem
								key={vacancy.id}
								vacancy={vacancy}
								loading={loading}
								rates={rates}
								setVacancys={setVacancys}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных вакансий не найдено</span>
				<Link
					href={'/dashboard/vacancy/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
