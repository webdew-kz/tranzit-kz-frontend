"use client"
import React, { use, useCallback, useEffect, useState, useTransition } from 'react'
import { findAll } from '../actions'
import { ITransport } from '@/shared/types/transport.type'
import TransportSearchItem from './TransportSearchItem'
import { useTransportSearchStore } from '@/shared/store/useTransportSearchStore'
import { useTransportStore } from '@/shared/store/useTransportStore'
import { Button } from '@/shared/components/ui/button'
import Loader from '@/shared/components/widgets/Loader'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates'
import { Loader2, Star } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/shared/store/useUserStore'
import { getUser } from '@/app/dashboard/cargo/add/actions'



export default function TransportSearchList() {


	const { rates, loading } = useCurrencyRates()
	const { searchTransports, setSearchTransports } = useTransportSearchStore()
	const [transports, setTransports] = useState<ITransport[]>([])
	const [total, setTotal] = useState(0)

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoad, setIsLoad] = useState(false);

	const [wishlistLength, setWishlistLength] = useState(0)

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

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem("wishlistTransport") || "[]");
		setWishlistLength(stored.length);
	}, []);

	const loadMore = async () => {
		if (!hasMore) return;

		setPage(prev => prev + 1); // сразу увеличиваем

		try {
			const res = await findAll(page);
			setTransports(prev => {
				const merged = [...prev, ...res.transports];

				// Удаляем дубликаты по `id`
				const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

				return unique;
			});

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка затранспортки:", err);
		}
	};

	const firstLoad = async () => {

		setIsLoad(true)
		try {
			const res = await findAll(page);
			setTransports(res.transports);
			setTotal(res.total)
		} catch (error) {
			console.error("Ошибка затранспортки:", error);
		} finally {
			setIsLoad(false)
		}

	}

	useEffect(() => {
		firstLoad();
	}, []);

	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	const handleShowAllTransports = useCallback(async () => {
		setSearchTransports([])
		setTransports([])
		firstLoad()
	}, [])




	if (isLoad || loading || pending) {
		return <Loader />
	}

	return (
		searchTransports.length > 0 ? (
			<>
				<div className='grid gap-5'>
					<div className=" flex justify-between items-center">
						<span>Найдено: {searchTransports.length}</span>
						<Button
							variant='link'
							onClick={handleShowAllTransports}
							className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
						>Показать все транспорты</Button>
					</div>
					{searchTransports.map((transport) => (
						<TransportSearchItem
							key={transport.id}
							transport={transport}
							loading={loading}
							rates={rates}
						/>
					))}
				</div>
			</>
		) : (
			transports?.length > 0 ? (
				<>
					<div className='grid gap-5'>
						<div className=" flex justify-between items-center sticky top-30 md:top-15 bg-background py-5 px-3">
							<span></span>
							{/* <span>Всего транспортов: {total}</span> */}

							{wishlistLength > 0 ? (
								<Link
									href='/dashboard/transport/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} fill='#b4802e' />
									<span>{`В избранном (${wishlistLength})`}</span>
								</Link>
							) : (
								<Link
									href='/dashboard/transport/wishlist'
									className=' underline underline-offset-4  text-(--dark-accent) flex gap-1.5 items-center'

								>
									<Star size={16} />
									<span>Избранное</span>
								</Link>
							)}

						</div>
						{transports.map((transport) => (
							<TransportSearchItem
								key={transport.id}
								transport={transport}
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
					<span>Транспорты не найдены</span>
					<Button
						variant='link'
						onClick={() => firstLoad()}
						className=' underline underline-offset-3 decoration-dotted text-(--dark-accent) hover:text-muted-foreground'
					>Показать все транспорты</Button>
				</div>
			)
		)
	)
}
