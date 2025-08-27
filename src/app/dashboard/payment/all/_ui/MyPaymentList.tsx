'use client'
import { IPayment } from '@/shared/types/payment.type';
import { useEffect, useState, useTransition } from 'react'
import MyPaymentItem from './MyPaymentItem';
import { Card, CardContent } from '@/shared/components/ui/card';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { toast } from 'sonner';
import { deleteAll, getAll } from '../actions';
import Loader from '@/shared/components/widgets/Loader';
import { useCurrencyRates } from '@/shared/hooks/useCurrencyRates';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/shared/store/useUserStore';

export default function MyPaymentList() {



	const { user } = useUserStore();
	const router = useRouter();
	const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

	useEffect(() => {
		if (user?.role !== 'ADMIN') {
			router.replace('/dashboard');
			setIsAllowed(false);
		} else {
			setIsAllowed(true);
		}
	}, [user, router]);

	if (isAllowed === null) return null;

	if (!isAllowed) return null;

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


				setTotalAmount(data.totalAmount)
				setPayments(data.payments)
			}
		} catch (error) {
			console.error("Ошибка загрузки:", error);
		}

	};

	const handleDeleteAll = async () => {
		try {
			const confirmed = window.confirm("Вы уверены, что хотите удалить все платежи?");

			if (!confirmed) return;

			await deleteAll();

			setPayments([])
			setTotalAmount(null)

			alert("Все платежи успешно удалены.");
		} catch (error) {
			console.error("Ошибка удаления:", error);
			alert("Произошла ошибка при удалении.");
		}
	};

	if (loading || pending || !user) {
		return <Loader />
	}

	return (
		<>
			{(totalAmount && totalAmount > 0) ? (
				<Card className='w-full mb-3 lg:mb-5 sticky top-[120px] md:top-[60px] p-0 rounded-t-none'>
					<CardContent className=' flex flex-col lg:flex-row gap-3 p-3 lg:p-5 justify-between items-center'>

						<div className=" grid w-full lg:flex ">
							<Button asChild className='bg-background text-white hover:text-background rounded-r-none'>
								<span>
									Всего: {(totalAmount as number)?.toLocaleString('ru-RU')} ₸
								</span>
							</Button>

						</div>
						<div className="flex items-center gap-4 justify-between w-full lg:justify-end h-[36px]">
							<Button
								type='button'
								className=' bg-(--dark-accent) md:col-start-2 w-full'
								onClick={handleDeleteAll}
							>
								Очистить платежи
							</Button>
						</div>

					</CardContent>
				</Card>
			) : null}
			<div className=' grid gap-5'>
				{(payments.length && payments.length > 0) ? payments.map((payment) => (
					<MyPaymentItem
						paymentInitial={payment}
						key={payment.id}
						selected={selectedIds.includes(payment.id!)}
						setPayments={setPayments}
						rates={rates}
						loading={pending}
					/>
				)) : (
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
