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
import { getAll } from '../actions';
import Loader from '@/shared/components/widgets/Loader';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';

export default function MyPaymentList() {

	const { rates, loading } = useCurrencyRates()

	const [payments, setPayments] = useState<IPayment[]>([]);

	const [totalAmount, setTotalAmount] = useState<number | null>(null);
	const [selectedIds, setSelectedIds] = useState<string[]>([])

	const [pending, startTransition] = useTransition()
	const path = usePathname();

	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);

	const loadMore = async () => {

		if (!hasMore) return;

		setPage(prev => prev + 1);

		try {

			const res = await getAll(page);

			setPayments(prev => {
				const merged = [...prev, ...res.payments];

				// Удаляем дубликаты по `id`
				const unique = Array.from(new Map(merged.map(c => [c.id, c])).values());

				return unique;
			});

			setTotalAmount(res.totalAmount)

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
			const data = await getAll(page)

			if (data.length === 0) {
				toast.error("Нет платежей", {
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


	if (loading || pending) {
		return <Loader />
	}

	return (
		<>
			<Card className='w-full mb-3 lg:mb-5 sticky top-[120px] md:top-[60px] p-0 rounded-t-none'>
				<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>
					<div className=" grid w-full lg:flex ">
						<Button asChild className='bg-background text-muted-foreground hover:text-background rounded-r-none'>
							<span>
								Всего: {(totalAmount as number)?.toLocaleString('ru-RU')} ₸
							</span>
						</Button>
						{/* <Button asChild className={cn(path === '/dashboard/cargo/my/archive' ? 'bg-(--dark-accent)' : 'bg-background text-muted-foreground hover:text-background', 'rounded-l-none')}>
							<Link href="/dashboard/cargo/my/archive">
								Архив
							</Link>
						</Button> */}
					</div>
					<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">

					</div>
				</CardContent>
			</Card>
			<div className=' grid gap-5'>
				{payments.length > 0 && payments.map((payment) => (
					<MyPaymentItem
						paymentInitial={payment}
						key={payment.id}
						selected={selectedIds.includes(payment.id!)}
						setPayments={setPayments}
						rates={rates}
						loading={pending}
					/>
				))}

				{!payments.length && (
					<div className='flex justify-center items-center'>
						<p className='text-muted-foreground'>Нет платежей</p>
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
