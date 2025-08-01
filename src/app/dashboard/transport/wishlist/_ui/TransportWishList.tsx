"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ITransport } from '@/shared/types/transport.type'
import Loader from '@/shared/components/widgets/Loader'
import TransportWishItem from './TransportWishItem'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import Link from 'next/link'
import { toast } from 'sonner'



export default function TransportWishList() {

	const { rates, loading } = useCurrencyRates()
	const [transports, setTransports] = useState<ITransport[]>([])

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

	if (loading || !rates) {
		return <Loader />
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
