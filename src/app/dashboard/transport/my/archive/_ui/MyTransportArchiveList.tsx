'use client'
import { useUserStore } from '@/shared/store/useUserStore';
import { ITransport } from '@/shared/types/transport.type';
import { useEffect, useState, useTransition } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import Loader from '@/shared/components/widgets/Loader';
import { activateMany } from '../../actions';
import { removeMany } from '../actions';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import MyTransportArchiveItem from './MyTransportArchiveItem';

export default function MyTransportArchiveList() {

	const { rates, loading } = useCurrencyRates()

	const [transports, setTransports] = useState<ITransport[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()
	const path = usePathname();

	useEffect(() => {

		fetchData().catch((error) => console.error(error));

		const interval = setInterval(() => {
			fetchData().catch(console.error);
		}, 60_000); // каждые 60 секунд

		return () => clearInterval(interval);

	}, [transports])

	const fetchData = async () => {

		const userStorage = localStorage.getItem("user-storage");
		const token = localStorage.getItem("accessToken");

		if (!userStorage) {
			console.error("User storage is null");
			return;
		}

		const parsedUserStorage = JSON.parse(userStorage);
		if (!parsedUserStorage.state?.user?.id) {
			console.error("Invalid user storage structure");
			return;
		}

		const res = await fetch(`${process.env.SERVER_URL}/transport/find-archive-by-user-id/${parsedUserStorage.state.user.id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		const data: ITransport[] = await res.json();

		if (data.length === 0) {
			toast.error("У вас нет активных грузов", {
				position: 'top-center',
			});

			return

		} else {

			setTransports(data)
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
		if (selectedIds.length === transports.length) {
			clearSelection();
		} else {
			const allIds = transports.map(transport => transport.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}

	const handleActivateMany = () => {
		startTransition(() => {
			activateMany({ ids: selectedIds })
				.then(() => {
					toast.success("Грузы активированы", {
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

	const handleRemoveMany = () => {
		startTransition(() => {
			removeMany({ ids: selectedIds })
				.then(() => {
					toast.success("Грузы удалены", {
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

	if (pending || loading) {
		return <Loader />
	}

	return (
		<>
			<Card className='w-full mb-3 lg:mb-5 sticky top-[60px] p-0 rounded-t-none'>
				<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>
					<div className=" grid grid-cols-2 w-full lg:flex ">
						<Button asChild className={cn(path === '/dashboard/transport/my' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-r-none')}>
							<Link href="/dashboard/transport/my">
								Активные
							</Link>
						</Button>
						<Button asChild className={cn(path === '/dashboard/transport/my/archive' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-l-none')}>
							<Link href="/dashboard/transport/my/archive">
								Архив
							</Link>
						</Button>
					</div>
					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
						{transports.length > 0 && (
							<div className="flex items-center gap-3">
								<Checkbox
									id="terms"
									checked={(selectedIds.length === transports.length) || (transports.length > selectedIds.length && selectedIds.length > 0 && 'indeterminate')}
									onCheckedChange={handleSelectAll}
									className='border-(--dark-accent)'
								/>
								<label
									htmlFor="terms"
									className="text-sm cursor-pointer flex"
								>
									<span className='text-(--dark-accent) underline underline-offset-2'>
										{selectedIds.length === transports.length ? `Отменить` : 'Выбрать все'}
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
										Активировать
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
				{transports.length > 0 && transports.map((transport) => (
					<MyTransportArchiveItem
						transportInitial={transport}
						key={transport.id}
						selected={selectedIds.includes(transport.id!)}
						onToggle={() => toggleSelect(transport.id!)}
						setTransports={setTransports}
						rates={rates}
						loading={loading}
					/>
				))}
				{!transports.length && (
					<div className='flex justify-center items-center'>
						<span className='text-muted-foreground'>У вас нет архивных транспортов</span>
					</div>
				)}
			</div>
		</>
	)
}
