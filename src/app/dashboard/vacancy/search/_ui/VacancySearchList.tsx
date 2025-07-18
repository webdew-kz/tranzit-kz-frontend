"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { findAll } from '../actions'
import { IVacancy } from '@/shared/types/vacancy.type'
import VacancySearchItem from './VacancySearchItem'
import { useVacancySearchStore } from '@/shared/store/useVacancySearchStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'



export default function VacancySearchList() {


	const { rates, loading } = useCurrencyRates()
	const { searchVacancys, setSearchVacancys } = useVacancySearchStore()
	const [vacancys, setVacancys] = useState<IVacancy[]>([])
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(false);

	const [wishlistLength, setWishlistLength] = useState(0)

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("wishlistVacancy") || "[]");
		setWishlistLength(stored.length);
	}, []);

	const loadMore = async () => {
		if (!hasMore) return;

		setPage(prev => prev + 1); // сразу увеличиваем

		try {
			const res = await findAll(page);
			setVacancys(prev => {
				const merged = [...prev, ...res.vacancys];

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
			setVacancys(res.vacancys);
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

	const handleShowAllVacancys = useCallback(async () => {
		setSearchVacancys([])
		setVacancys([])
		firstLoad()
	}, [])




	if (isLoad || loading) {
		return <Loader />
	}

	return (
		searchVacancys.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center">
						<span>Найдено: {searchVacancys.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllVacancys}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все грузы</Button>
					</div>
					{searchVacancys.map((vacancy) => (
						<VacancySearchItem
							key={vacancy.id}
							vacancy={vacancy}
							loading={loading}
							rates={rates}
						/>
					))}
				</div>
			</>
		) : (
			vacancys.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5">
							<span>Всего грузов: {total}</span>

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/vacancy/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/vacancy/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{vacancys.map((vacancy) => (
							<VacancySearchItem
								key={vacancy.id}
								vacancy={vacancy}
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
					<span>Вакансии не найдены</span>
					<Button
						variant='link'
						onClick={() => firstLoad()}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все вакансии</Button>
				</div>
			)
		)
	)
}
