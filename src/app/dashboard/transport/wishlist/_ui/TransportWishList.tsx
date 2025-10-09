"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ITransport } from '@/shared/types/transport.type'
import Loader from '@/shared/components/widgets/Loader'
import TransportWishItem from './TransportWishItem'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import Link from 'next/link'
import { toast } from 'sonner'
import { useUserStore } from '@/shared/store/useUserStore'
import { Button } from '@/shared/components/ui/button'
import { getUser } from '@/app/dashboard/cargo/add/actions'



export default function TransportWishList() {

	const { user, setUser } = useUserStore()
	const { rates, loading } = useCurrencyRates()
	const [transports, setTransports] = useState<ITransport[]>([])

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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await getWishlist();
				if (res.transports.length === 0) {
					localStorage.setItem("wishlistTransport", JSON.stringify([]));
				}
				setTransports(Array.isArray(res.transports) ? res.transports.filter((t: ITransport | null): t is ITransport => t !== null && t.id !== undefined) : []);
			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		};
		fetchData();
	}, []);


	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlistTransport", JSON.stringify([]));
		setTransports([]);
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
		transports.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {transports.length}</span>

						{transports.length > 0 && (
							<button type='button' onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{transports?.map((transport) => {
						// console.log(transport);
						return (
							<TransportWishItem
								key={transport.id}
								transport={transport}
								loading={loading}
								rates={rates}
								setTransports={setTransports}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных транспортов не найдено</span>
				<Link
					href={'/dashboard/transport/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
