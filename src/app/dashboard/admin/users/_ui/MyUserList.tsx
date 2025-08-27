'use client'
import { useEffect, useState, useTransition } from 'react'
import MyUserItem from './MyUserItem';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import Loader from '@/shared/components/widgets/Loader';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/shared/store/useUserStore';
import { findAllUsersByPage, lockMany, removeMany, unlockMany } from '../actions';
import { User } from '@/shared/types/user.type';

export default function MyUserList() {
	const { user } = useUserStore()

	const { rates, loading } = useCurrencyRates()

	const [users, setUsers] = useState<User[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {

		if (!hasMore) return;

		setPage(prev => prev + 1);

		try {

			const res = await findAllUsersByPage(page);

			setUsers(prev => {
				const merged = [...prev, ...res.users];

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
			const res = await findAllUsersByPage(page)

			if (res.length === 0) {
				toast.error("Нет зарегистрированных пользователей", {
					position: 'top-center',
				});

				return

			} else {

				setUsers(res.users)
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
		if (selectedIds.length === users.length) {
			clearSelection();
		} else {
			const allIds = users.map(user => user.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}

	const handleUnlockMany = async () => {
		startTransition(async () => {

			try {
				const res = await unlockMany({ ids: selectedIds })

				toast.success(res.message, {
					position: 'top-center',
				})

				setSelectedIds([])

				setUsers(res.users)

				// window.location.reload()

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при разблокировки', {
					position: 'top-center',
				})
			}
		})
	}

	const handleLockMany = async () => {
		startTransition(async () => {

			try {
				const res = await lockMany({ ids: selectedIds })

				toast.success(res.message, {
					position: 'top-center',
				})

				setSelectedIds([])

				setUsers(res.users)

				// window.location.reload()

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при блокировки', {
					position: 'top-center',
				})
			}
		})
	}

	const handleRemoveMany = async () => {
		startTransition(async () => {

			try {
				const res = await removeMany({ ids: selectedIds })

				toast.success(res.message, {
					position: 'top-center',
				})

				setSelectedIds([])

				setUsers(prev => prev.filter(user => !selectedIds.includes(user.id)))

				// window.location.reload()

			} catch (error) {
				console.error(error)
				toast.error('Ошибка при разблокировки', {
					position: 'top-center',
				})
			}
		})
	}

	if (loading || pending || !user) {
		return <Loader />
	}

	if (user?.role !== 'ADMIN') return null

	return (
		<div className='pb-[60px]'>
			<Card className='w-full mb-3 lg:mb-5 sticky top-[120px] md:top-[60px] p-0 rounded-t-none'>
				<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>

					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
						{users && users.length > 0 && (
							<div className="flex items-center gap-3">
								<Checkbox
									id="terms"
									checked={(selectedIds.length === users.length) || (users.length > selectedIds.length && selectedIds.length > 0 && 'indeterminate')}
									onCheckedChange={handleSelectAll}
									className='border-(--dark-accent)'
								/>
								<label
									htmlFor="terms"
									className="text-sm cursor-pointer flex"
								>
									<span className='text-(--dark-accent) underline underline-offset-2'>
										{selectedIds.length === users.length ? `Отменить` : 'Выбрать все'}
									</span>
								</label>
								<span>{selectedIds.length > 0 && `Выбрано: ${selectedIds.length}`}</span>
							</div>
						)}
						{selectedIds && selectedIds.length > 0 && (
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
										onClick={handleUnlockMany}
									>
										Разблокировать
									</Button>
									<Button
										variant='link'
										onClick={handleLockMany}
									>
										Заблокировать
									</Button>
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
				{users && users.length > 0 && users.map((user) => (
					<MyUserItem
						userInitial={user}
						key={user.id}
						selected={selectedIds.includes(user.id!)}
						onToggle={() => toggleSelect(user.id!)}
						setUsers={setUsers}
						rates={rates}
						loading={pending}
					/>
				))}

				{!users.length && (
					<div className='flex justify-center items-center'>
						<p className='text-muted-foreground'>У вас нет активных грузов</p>
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
		</div>
	)
}
