"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { getWishlist, removeAllFromWishlist } from '../actions'
import { ICargo } from '@/shared/types/cargo.type'
import CargoSearchItem from './CargoWishItem'
import Loader from '@/shared/components/widgets/Loader'
import CargoWishItem from './CargoWishItem'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import Link from 'next/link'
import { toast } from 'sonner'



export default function CargoWishList() {

	const { rates, loading } = useCurrencyRates()
	const [cargos, setCargos] = useState<ICargo[]>([])

	useEffect(() => {
		const fetchData = async () => {

			try {
				const res = await getWishlist();
				setCargos(Array.isArray(res.cargos) ? res.cargos.filter((c: ICargo | null | undefined): c is ICargo => c !== null && c !== undefined && c.id !== undefined) : []);

			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		}
		fetchData()
	}, [])

	const handleClearWishlist = async () => {
		const res = await removeAllFromWishlist()
		localStorage.setItem("wishlist", JSON.stringify([]));
		setCargos([]);
		toast.success(res.message, {
			position: 'top-center',
		})
	};

	if (loading || !rates) {
		return <Loader />
	}

	return (
		cargos.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center sticky top-15 bg-background py-5">
						<span>Избранных: {cargos.length}</span>

						{cargos.length > 0 && (
							<button onClick={handleClearWishlist} className="cursor-pointer text-sm text-(--dark-accent) underline underline-offset-4">
								Очистить все
							</button>
						)}

					</div>
					{cargos?.map((cargo) => {
						// console.log(cargo);
						return (
							<CargoWishItem
								key={cargo.id}
								cargo={cargo}
								loading={loading}
								rates={rates}
								setCargos={setCargos}
							/>
						)

					})}
				</div>
			</>
		) : (
			<div className="flex flex-col items-center gap-5 justify-center py-5">
				<span>Избранных грузов не найдено</span>
				<Link
					href={'/dashboard/cargo/search'}
					className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
				>Вернуться к поиску</Link>
			</div>
		)
	)
}
