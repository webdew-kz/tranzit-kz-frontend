"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { IBroker } from '@/shared/types/broker.type'
import Loader from '@/shared/components/widgets/Loader'
import BrokerWishItem from './BrokerWishItem'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/shared/store/useUserStore'
import { Button } from '@/shared/components/ui/button'
import { getUser } from '../../add/actions'



export default function BrokerWishList() {

	const { user, setUser } = useUserStore()

	const [pending, startTransition] = useTransition()

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

	const { rates, loading } = useCurrencyRates()
	const [brokers, setBrokers] = useState<IBroker[]>([])

	useEffect(() => {
		const fetchData = async () => {

			try {
				const res = await getWishlist();
				setBrokers(Array.isArray(res.brokers) ? res.brokers.filter((c: IBroker | null | undefined): c is IBroker => c !== null && c !== undefined && c.id !== undefined) : []);

			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlist", JSON.stringify([]));
		setBrokers([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (loading || !rates || pending) {
		return <Loader />
	}

	if (!user?.isRegistered && user?.role === 'USER') {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Доступ в данный раздел доступен по ежемесячной абонентской плате.</div>
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
		brokers.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {brokers.length}</span>

						{brokers.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{brokers?.map((broker) => {
						// console.log(broker);
						return (
							<BrokerWishItem
								key={broker.id}
								broker={broker}
								loading={loading}
								rates={rates}
								setBrokers={setBrokers}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных грузов не найдено</span>
				<Link
					href={'/dashboard/broker/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
