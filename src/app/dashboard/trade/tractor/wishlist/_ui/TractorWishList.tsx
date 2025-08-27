"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ITractor } from '@/shared/types/tractor.type'
import Loader from '@/shared/components/widgets/Loader'
import Link from 'next/link'
import { toast } from 'sonner'
import TractorWishItem from './TractorWishItem'
import { useUserStore } from '@/shared/store/useUserStore'
import { Button } from '@/shared/components/ui/button'



export default function TractorWishList() {

	// const { rates, loading } = useCurrencyRates()
	const [tractors, setTractors] = useState<ITractor[]>([])
	const [pending, startTransition] = useTransition()

	useEffect(() => {
		const fetchData = async () => {

			startTransition(async () => {
				const res = await getWishlist();
				setTractors(res.tractors);
			})
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlist", JSON.stringify([]));
		setTractors([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (pending) {
		return <Loader />
	}

	const { user } = useUserStore()

	if (!user?.isRegistered) {
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
		tractors?.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {tractors.length}</span>

						{tractors.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{tractors?.filter(t => t && t.id).map((tractor) => {
						// console.log(tractor);
						return (
							<TractorWishItem
								key={tractor.id}
								tractorInitial={tractor}
								setTractors={setTractors}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных тягачей не найдено</span>
				<Link
					href={'/dashboard/trade/tractor/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
