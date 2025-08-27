'use client'
import { ITruck } from '@/shared/types/truck.type';
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
import { findAllArchivedByUserId, removeMany } from '../actions';
import MyTruckArchiveItem from './MyTruckArchiveItem';
import { useUserStore } from '@/shared/store/useUserStore';

export default function MyTruckArchiveList() {

	const [trucks, setTrucks] = useState<ITruck[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()
	const path = usePathname();

	useEffect(() => {

		startTransition(async () => {
			try {
				const data = await findAllArchivedByUserId()

				if (data.length === 0) {
					toast.error("У вас нет активных грузов", {
						position: 'top-center',
					});

					return

				} else {

					setTrucks(data.trucks)
					toast.success(data.message, {
						position: 'top-center',
					});
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Ошибка загрузки:", error);
			}
		})

	}, [])

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
		if (selectedIds.length === trucks.length) {
			clearSelection();
		} else {
			const allIds = trucks.map(truck => truck.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}

	const handleActivateMany = () => {

		startTransition(async () => {
			try {

				const res = await activateMany({ ids: selectedIds });

				toast.success(res.message, {
					position: 'top-center',
				});

				setTrucks(prev => prev.filter(truck => !selectedIds.includes(truck.id!)))

				setSelectedIds([])

			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Произошла ошибка', {
					position: 'top-center',
				});
			}
		})
	}

	const handleRemoveMany = () => {

		startTransition(async () => {
			try {
				const res = await removeMany({ ids: selectedIds });


				toast.success(res.message, {
					position: 'top-center',
				});

				setTrucks(prev => prev.filter(truck => !selectedIds.includes(truck.id!)))

				setSelectedIds([])

			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Произошла ошибка', {
					position: 'top-center',
				});
			}
		})
	}

	if (pending || isLoading) {
		return <Loader />
	}

	const { user } = useUserStore()

	if (!user?.isRegistered && user?.role === 'USER') {
		return (
			<div className="flex flex-col justify-center w-full gap-3 md:gap-5 items-center">
				<div className="text-center">Доступ в данный раздел доступен по абонентской плате — 1000 тенге в месяц.</div>
				<Button
					className=' bg-(--dark-accent)'
					asChild
				>
					<Link href='/dashboard/payment/pay-register'>Перейти к оплате</Link>
				</Button>
			</div>


		)
	}

	return (
		<>
			<Card className='w-full mb-3 lg:mb-5 sticky top-[60px] p-0 rounded-t-none'>
				<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>
					<div className=" grid grid-cols-2 w-full lg:flex ">
						<Button asChild className={cn(path === '/dashboard/trade/truck/my' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-r-none')}>
							<Link href="/dashboard/trade/truck/my">
								Активные
							</Link>
						</Button>
						<Button asChild className={cn(path === '/dashboard/trade/truck/my/archive' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-l-none')}>
							<Link href="/dashboard/trade/truck/my/archive">
								Архив
							</Link>
						</Button>
					</div>
					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
						{trucks.length > 0 && (
							<div className="flex items-center gap-3">
								<Checkbox
									id="terms"
									checked={(selectedIds.length === trucks.length) || (trucks.length > selectedIds.length && selectedIds.length > 0 && 'indeterminate')}
									onCheckedChange={handleSelectAll}
									className='border-(--dark-accent)'
								/>
								<label
									htmlFor="terms"
									className="text-sm cursor-pointer flex"
								>
									<span className='text-(--dark-accent) underline underline-offset-2'>
										{selectedIds.length === trucks.length ? `Отменить` : 'Выбрать все'}
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
				{trucks.length > 0 && trucks.map((truck) => (
					<MyTruckArchiveItem
						truckInitial={truck}
						key={truck.id}
						selected={selectedIds.includes(truck.id!)}
						onToggle={() => toggleSelect(truck.id!)}
						setTrucks={setTrucks}
					/>
				))}
				{!trucks.length && (
					<div className='flex justify-center items-center'>
						<span className='text-muted-foreground'>Нет архивных грузов</span>
					</div>
				)}
			</div>
		</>
	)
}
