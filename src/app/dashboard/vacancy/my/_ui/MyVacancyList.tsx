'use client'
import { IVacancy } from '@/shared/types/vacancy.type';
import { useEffect, useState, useTransition } from 'react'
import MyVacancyItem from './MyVacancyItem';
import { Card, CardContent } from '@/shared/components/ui/card';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import { activateMany, archivateMany, findByUserId } from '../actions';
import Loader from '@/shared/components/widgets/Loader';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

export default function MyVacancyList() {

	const { rates, loading } = useCurrencyRates()

	const [vacancys, setVacancys] = useState<IVacancy[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()
	const path = usePathname();

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {

		if (!hasMore) return;

		setPage(prev => prev + 1);

		try {
			console.log("page", page);

			const res = await findByUserId(page);

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
			const data = await findByUserId(page)

			if (data.length === 0) {
				toast.error("У вас нет активных вакансий", {
					position: 'top-center',
				});

				return

			} else {

				// const sortedData = data.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));

				setVacancys(data.vacancys)
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
		if (selectedIds.length === vacancys.length) {
			clearSelection();
		} else {
			const allIds = vacancys.map(vacancy => vacancy.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}

	const handleActivateMany = () => {
		startTransition(() => {
			activateMany({ ids: selectedIds })
				.then(() => {
					toast.success("Вакансии повторены", {
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

	const handleAchivateMany = () => {
		startTransition(() => {
			archivateMany({ ids: selectedIds })
				.then(() => {
					toast.success("Вакансии сняты", {
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
					<div className=" grid grid-cols-2 w-full lg:flex ">
						<Button asChild className={cn(path === '/dashboard/vacancy/my' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-r-none')}>
							<Link href="/dashboard/vacancy/my">
								Активные
							</Link>
						</Button>
						<Button asChild className={cn(path === '/dashboard/vacancy/my/archive' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-l-none')}>
							<Link href="/dashboard/vacancy/my/archive">
								Архив
							</Link>
						</Button>
					</div>
					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
						{vacancys.length > 0 && (
							<div className="flex items-center gap-3">
								<Checkbox
									id="terms"
									checked={(selectedIds.length === vacancys.length) || (vacancys.length > selectedIds.length && selectedIds.length > 0 && 'indeterminate')}
									onCheckedChange={handleSelectAll}
									className='border-(--dark-accent)'
								/>
								<label
									htmlFor="terms"
									className="text-sm cursor-pointer flex"
								>
									<span className='text-(--dark-accent) underline underline-offset-2'>
										{selectedIds.length === vacancys.length ? `Отменить` : 'Выбрать все'}
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
										onClick={handleActivateMany}
									>
										Повторить
									</Button>
									<Button
										variant='link'
										onClick={handleAchivateMany}
									>
										Снять
									</Button>
								</PopoverContent>
							</Popover>
						)}
					</div>
				</CardContent>
			</Card>
			<div className=' grid gap-5'>
				{vacancys.length > 0 && vacancys.map((vacancy) => (
					<MyVacancyItem
						vacancyInitial={vacancy}
						key={vacancy.id}
						selected={selectedIds.includes(vacancy.id!)}
						onToggle={() => toggleSelect(vacancy.id!)}
						setVacancys={setVacancys}
						rates={rates}
						loading={pending}
					/>
				))}

				{!vacancys.length && (
					<div className='flex justify-center items-center'>
						<p className='text-muted-foreground'>У вас нет активных вакансий</p>
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
