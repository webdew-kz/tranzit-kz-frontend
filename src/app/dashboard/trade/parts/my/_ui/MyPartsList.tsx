'use client'
import { IParts } from '@/shared/types/parts.type';
import { use, useEffect, useState, useTransition } from 'react'
import { Card, CardContent } from '@/shared/components/ui/card';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import { activateMany, archivateMany, findAllActiveByUserId } from '../actions';
import Loader from '@/shared/components/widgets/Loader';
import MyPartsItem from './MyPartsItem';

export default function MyPartsList() {

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [partss, setPartss] = useState<IParts[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()
	const path = usePathname();

	useEffect(() => {

		startTransition(async () => {
			try {
				const data = await findAllActiveByUserId()

				if (data.length === 0) {
					toast.error("У вас нет объявлений", {
						position: 'top-center',
					});

					return

				} else {

					setPartss(data.partss)
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
		if (selectedIds.length === partss.length) {
			clearSelection();
		} else {
			const allIds = partss.map(parts => parts.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}

	const handleActivateMany = () => {

		startTransition(async () => {
			try {
				setPartss(prev => prev.filter(parts => !selectedIds.includes(parts.id!)))

				const res = await activateMany({ ids: selectedIds });

				toast.success(res.message, {
					position: 'top-center',
				});

				setPartss(prev => {
					const updatedPartss = res.partss;
					return [...updatedPartss, ...prev];
				})

				setSelectedIds([])

			} catch (error) {
				toast.error(error instanceof Error ? error.message : 'Произошла ошибка', {
					position: 'top-center',
				});
			}
		})
	}

	const handleAchivateMany = () => {
		startTransition(async () => {
			try {
				setPartss(prev => prev.filter(parts => !selectedIds.includes(parts.id!)))

				const res = await archivateMany({ ids: selectedIds })

				toast.success(res.message, {
					position: 'top-center',
				});

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

	return (
		<>
			<Card className='w-full mb-3 lg:mb-5 sticky top-[119px] md:top-[60px] p-0 rounded-t-none z-10'>
				<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>
					<div className=" grid grid-cols-2 w-full lg:flex ">
						<Button asChild className={cn(path === '/dashboard/trade/parts/my' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-r-none')}>
							<Link href="/dashboard/trade/parts/my">
								Активные
							</Link>
						</Button>
						<Button asChild className={cn(path === '/dashboard/trade/parts/my/archive' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-l-none')}>
							<Link href="/dashboard/trade/parts/my/archive">
								Архив
							</Link>
						</Button>
					</div>
					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
						{partss.length > 0 && (
							<div className="flex items-center gap-3">
								<Checkbox
									id="terms"
									checked={(selectedIds.length === partss.length) || (partss.length > selectedIds.length && selectedIds.length > 0 && 'indeterminate')}
									onCheckedChange={handleSelectAll}
									className='border-(--dark-accent)'
								/>
								<label
									htmlFor="terms"
									className="text-sm cursor-pointer flex"
								>
									<span className='text-(--dark-accent) underline underline-offset-2'>
										{selectedIds.length === partss.length ? `Отменить` : 'Выбрать все'}
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
				{partss.length > 0 && partss.map((parts) => (
					<MyPartsItem
						partsInitial={parts}
						key={parts.id}
						selected={selectedIds.includes(parts.id!)}
						onToggle={() => toggleSelect(parts.id!)}
						setPartss={setPartss}
						loading={pending}
					/>
				))}

				{!partss.length && (
					<div className='flex justify-center items-center'>
						<p className='text-muted-foreground'>У вас нет активных грузов</p>
					</div>
				)}
				{/* {isLoading &&
					<div className="flex justify-center items-center">
						<Loader2 className="animate-spin" />
					</div>
				} */}
			</div>
			{/* {hasMore && (
				<div ref={bottomRef} className="h-10" />
			)} */}
		</>
	)
}
