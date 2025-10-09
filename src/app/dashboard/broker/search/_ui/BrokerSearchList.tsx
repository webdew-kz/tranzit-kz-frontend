"use client"
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { findAll } from '../actions'
import { IBroker } from '@/shared/types/broker.type'
import BrokerSearchItem from './BrokerSearchItem'
import { useBrokerSearchStore } from '@/shared/store/useBrokerSearchStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { getUser } from '../../add/actions'
import { useUserStore } from '@/shared/store/useUserStore'



export default function BrokerSearchList() {


	const { user, setUser } = useUserStore()
	const { rates, loading } = useCurrencyRates()
	const { searchBrokers, setSearchBrokers } = useBrokerSearchStore()
	const [brokers, setBrokers] = useState<IBroker[]>([])
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

	// useEffect(() => {
	// 	const stored = JSON.parse(localStorage.getItem("wishlistBroker") || "[]");
	// 	setWishlistLength(stored.length);
	// }, []);

	const loadMore = async () => {
		if (!hasMore) return;

		setPage(prev => prev + 1); // сразу увеличиваем

		try {
			const res = await findAll(page);
			setBrokers(prev => {
				const merged = [...prev, ...res.brokers];

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
			setBrokers(res.brokers);
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

	const handleShowAllBrokers = useCallback(async () => {
		setSearchBrokers([])
		setBrokers([])
		firstLoad()
	}, [])




	if (isLoad || loading || pending) {
		return <Loader />
	}

	return (
		(searchBrokers?.length && searchBrokers?.length > 0) ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center">
						<span>Найдено: {searchBrokers.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllBrokers}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все объявления</Button>
					</div>
					{searchBrokers.map((broker) => (
						<BrokerSearchItem
							key={broker.id}
							broker={broker}
							loading={loading}
							rates={rates}
						/>
					))}
				</div>
			</>
		) : (
			(brokers?.length && brokers?.length > 0) ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 px-3">
							<span>Всего грузов: {total}</span>

							<Link
								href='/dashboard/broker/wishlist'
								className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

							>
								<Star size={16} />
								<span>Избранное</span>
							</Link>

						</div>
						{brokers.map((broker) => (
							<BrokerSearchItem
								key={broker.id}
								broker={broker}
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
					<span>Объявления не найдены</span>
					<Button
						variant='link'
						onClick={() => firstLoad()}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все объявления</Button>
				</div>
			)
		)
	)
}
