'use client'
import { IReview } from '@/shared/types/review.type';
import { useEffect, useState, useTransition } from 'react'
import MyReviewItem from './MyReviewItem';
import { Card, CardContent } from '@/shared/components/ui/card';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import { findAllByUserId, removeMany } from '../actions';
import Loader from '@/shared/components/widgets/Loader';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

export default function MyReviewList() {

	const { rates, loading } = useCurrencyRates()

	const [reviews, setReviews] = useState<IReview[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {

		if (!hasMore) return;

		setPage(prev => prev + 1);

		try {

			const res = await findAllByUserId(page);

			setReviews(prev => {
				const merged = [...prev, ...res.reviews];

				// Удаляем дубликаты по `id`
				const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

				return unique;
			});

			setHasMore(res.hasMore);

		} catch (err) {
			console.error("Ошибка загрузки:", err);
		}

	};



	const { bottomRef, isLoading } = useInfiniteScroll({ loadMore, hasMore })

	useEffect(() => {

		fetchData().catch((error) => console.error(error));

		const interval = setInterval(() => {
			fetchData().catch(console.error);
		}, 60_000); // каждые 60 секунд

		return () => clearInterval(interval);

	}, [])

	const fetchData = async () => {

		try {
			const data = await findAllByUserId(page)

			if (data.length === 0) {
				toast.error("У вас нет отзывов", {
					position: 'top-center',
				});

				return

			} else {

				// const sortedData = data.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));

				setReviews(data.reviews)
			}
		} catch (error) {
			console.error("Ошибка загрузки:", error);
		}

	};

	const toggleSelect = (id: string) => {
		setSelectedIds(prev =>
			prev.includes(id)
				? prev.filter(i => i !== id)
				: [...prev, id]
		)
	}

	const clearSelection = () => {
		setSelectedIds([])
	}

	const handleSelectAll = () => {
		if (selectedIds.length === reviews.length) {
			clearSelection();
		} else {
			const allIds = reviews.map(review => review.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}

	// const handleActivateMany = () => {
	// 	startTransition(() => {
	// 		activateMany({ ids: selectedIds })
	// 			.then(() => {
	// 				toast.success("Вакансии повторены", {
	// 					position: 'top-center',
	// 				});
	// 				fetchData().catch((error) => console.error(error));
	// 				setSelectedIds([])
	// 			})
	// 			.catch((error) => {
	// 				toast.error(error.message, {
	// 					position: 'top-center',
	// 				});
	// 			});
	// 	})
	// }

	// const handleAchivateMany = () => {
	// 	startTransition(() => {
	// 		archivateMany({ ids: selectedIds })
	// 			.then(() => {
	// 				toast.success("Вакансии сняты", {
	// 					position: 'top-center',
	// 				});
	// 				fetchData().catch((error) => console.error(error));
	// 				setSelectedIds([])
	// 			})
	// 			.catch((error) => {
	// 				toast.error(error.message, {
	// 					position: 'top-center',
	// 				});
	// 			});
	// 	})
	// }

	const handleRemoveMany = () => {
		startTransition(() => {
			removeMany({ ids: selectedIds })
				.then(() => {
					toast.success("Отзывы удалены", {
						position: 'top-center',
					});
					fetchData().catch((error) => console.error(error));

					setSelectedIds([])
				})
				.catch((error) => {
					toast.error(error.message, {
						position: 'top-center',
					});
				});
		})
	}

	if (loading || pending) {
		return <Loader />
	}

	return (
		<>
			<Card className='w-full mb-3 lg:mb-5 sticky top-[120px] md:top-[60px] p-0 rounded-t-none'>
				<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>
					{/* <div className=" grid grid-cols-2 w-full lg:flex ">
						<Button asChild className={cn(path === '/dashboard/review/my' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-r-none')}>
							<Link href="/dashboard/review/my">
								Активные
							</Link>
						</Button>
						<Button asChild className={cn(path === '/dashboard/review/my/archive' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-l-none')}>
							<Link href="/dashboard/review/my/archive">
								Архив
							</Link>
						</Button>
					</div> */}
					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
						{reviews.length > 0 && (
							<div className="flex items-center gap-3">
								<Checkbox
									id="terms"
									checked={(selectedIds.length === reviews.length) || (reviews.length > selectedIds.length && selectedIds.length > 0 && 'indeterminate')}
									onCheckedChange={handleSelectAll}
									className='border-(--dark-accent)'
								/>
								<label
									htmlFor="terms"
									className="text-sm cursor-pointer flex"
								>
									<span className='text-(--dark-accent) underline underline-offset-2'>
										{selectedIds.length === reviews.length ? `Отменить` : 'Выбрать все'}
									</span>
								</label>
								<span>{selectedIds.length > 0 && `Выбрано: ${selectedIds.length}`}</span>
							</div>
						)}
						{selectedIds.length > 0 && (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										className='border border-(--dark-accent) bg-(--dark-accent) hover:bg-accent hover:text-muted-foreground'
									>
										Действия
									</Button>
								</PopoverTrigger>
								<PopoverContent
									align='end'
									className='w-full grid justify-end'
								>
									<Button
										variant='link'
										onClick={handleRemoveMany}
									>
										Удалить
									</Button>
								</PopoverContent>
							</Popover>
						)}
					</div>
				</CardContent>
			</Card>
			<div className=' grid gap-5'>
				{reviews.length > 0 && reviews.map((review) => (
					<MyReviewItem
						reviewInitial={review}
						key={review.id}
						selected={selectedIds.includes(review.id!)}
						onToggle={() => toggleSelect(review.id!)}
						setReviews={setReviews}
						rates={rates}
						loading={pending}
					/>
				))}

				{!reviews.length && (
					<div className='flex justify-center items-center'>
						<p className='text-muted-foreground'>У вас нет отзывов</p>
					</div>
				)}
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
	)
}
