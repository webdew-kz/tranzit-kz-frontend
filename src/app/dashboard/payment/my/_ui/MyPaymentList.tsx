'use client'
import { IPayment } from '@/shared/types/payment.type';
import { useEffect, useState, useTransition } from 'react'
import MyPaymentItem from './MyPaymentItem';
import { Card, CardContent } from '@/shared/components/ui/card';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import { getByUserId } from '../actions';
import Loader from '@/shared/components/widgets/Loader';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

export default function MyPaymentList() {

	const { rates, loading } = useCurrencyRates()

	const [payments, setPayments] = useState<IPayment[]>([]);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()
	const path = usePathname();

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {

		if (!hasMore) return;

		setPage(prev => prev + 1);

		try {

			const res = await getByUserId(page);

			setPayments(prev => {
				const merged = [...prev, ...res.payments];

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
			const data = await getByUserId(page)

			if (data.length === 0) {
				toast.error("У вас нет платежей", {
					position: 'top-center',
				});

				return

			} else {

				// const sortedData = data.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));

				setPayments(data.payments)
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
		if (selectedIds.length === payments.length) {
			clearSelection();
		} else {
			const allIds = payments.map(payment => payment.id).filter((id): id is string => id !== undefined);
			setSelectedIds(allIds);
		}
	}


	if (loading || pending) {
		return <Loader />
	}

	return (
		<>
			<div className=' grid gap-5'>
				{payments.length > 0 && payments.map((payment) => (
					<MyPaymentItem
						paymentInitial={payment}
						key={payment.id}
						selected={selectedIds.includes(payment.id!)}
						onToggle={() => toggleSelect(payment.id!)}
						setPayments={setPayments}
						rates={rates}
						loading={pending}
					/>
				))}

				{!payments.length && (
					<div className='flex justify-center items-center'>
						<p className='text-muted-foreground'>У вас нет платежей</p>
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
