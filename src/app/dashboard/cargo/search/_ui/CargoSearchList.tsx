"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { findAll } from '../actions'
import { ICargo } from '@/shared/types/cargo.type'
import CargoSearchItem from './CargoSearchItem'
import { useCargoSearchStore } from '@/shared/store/useCargoSearchStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { getUser } from '../../add/actions'
import { useUserStore } from '@/shared/store/useUserStore'



export default function CargoSearchList() {


	const { user, setUser } = useUserStore()
	const { rates, loading } = useCurrencyRates()
	const { searchCargos, setSearchCargos } = useCargoSearchStore()
	const [cargos, setCargos] = useState<ICargo[]>([])
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(false);


	const [pending, startTransition] = useTransition()

	const [wishlistLength, setWishlistLength] = useState(0)

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
		const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
		setWishlistLength(stored.length);
	}, []);

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

		setIsLoad(true)
		try {
			const res = await findAll(page);
			setCargos(res.cargos);
			setTotal(res.total)
		} catch (error) {
			console.error("Ошибка загрузки:", error);
		} finally {
			setIsLoad(false)
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




	if (isLoad || loading || pending) {
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
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 px-3">
							<span>Всего грузов: {total * 1234}</span>

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/cargo/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/cargo/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{cargos.map((cargo) => (
							<CargoSearchItem
								key={cargo.id}
								cargo={cargo}
								loading={loading}
								rates={rates}
								setWishlistLength={setWishlistLength}
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
