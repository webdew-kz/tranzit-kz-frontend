"use client"
import React, { use, useCallback, useEffect, useState } from 'react'
import { findAll } from '../actions'
import { ICargo } from '@/shared/types/cargo.type'
import CargoSearchItem from './CargoSearchItem'
import { useCargoSearchStore } from '@/shared/store/useCargoSearchStore'
import { useCargoStore } from '@/shared/store/useCargoStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2 } from 'lucide-react'



export default function CargoSearchList() {


	const { rates, loading } = useCurrencyRates()
	const { searchCargos, setSearchCargos } = useCargoSearchStore()
	const [cargos, setCargos] = useState<ICargo[]>([])
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {
		if (!hasMore) return;

		setPage(prev => prev + 1); // сразу увеличиваем

		try {
			const res = await findAll(page);
			setCargos(prev => {
				const merged = [...prev, ...res.cargos];

				// Удаляем дубликаты по `id`
				const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

				return unique;
			});

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка загрузки:", err);
		}
	};

	const firstLoad = async () => {

		try {
			const res = await findAll(page);
			setCargos(res.cargos);
			setTotal(res.total)
		} catch (error) {
			console.error("Ошибка загрузки:", error);
		}

	}

	useEffect(() => {
		firstLoad();
	}, []);

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	const handleShowAllCargos = useCallback(async () => {
		setSearchCargos([])
		setCargos([])
		firstLoad()
	}, [])


	if (cargos.length === 0 || loading) {
		return <Loader />
	}

	return (
		searchCargos.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center">
						<span>Найдено: {searchCargos.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllCargos}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все грузы</Button>
					</div>
					{searchCargos.map((cargo) => (
						<CargoSearchItem
							key={cargo.id}
							cargo={cargo}
							loading={loading}
							rates={rates}
						/>
					))}
				</div>
			</>
		) : (
			cargos.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center">
							<span>Всего грузов: {total}</span>
						</div>
						{cargos.map((cargo) => (
							<CargoSearchItem
								key={cargo.id}
								cargo={cargo}
								loading={loading}
								rates={rates}
							/>
						))}
						{isLoading &&
							<div className="flex justify-center items-center">
								<Loader2 className="animate-spin" />
							</div>
						}
					</div>
					{hasMore && (
						<div ref={bottomRef} className="h-10" />
					)}
				</>
			) : (
				<div className="flex flex-col items-center gap-5 justify-center py-5">
					<span>Грузы не найдены</span>
					<Button
						variant='link'
						onClick={() => firstLoad()}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все грузы</Button>
				</div>
			)
		)
	)
}
