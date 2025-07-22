"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { MultiCityInput } from '@/shared/components/widgets/InputCity';
import { z } from "zod"
import { useEffect, useTransition } from 'react';
import { IReview } from '@/shared/types/review.type'
import { MultiSelect } from '@/shared/components/widgets/MultiSelect';
import { DatePicker } from '@/shared/components/widgets/DatePicker';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore';
import { findManyByFilter } from '../actions';
import { useUserStore } from '@/shared/store/useUserStore';
import { cn } from '@/shared/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CityInput } from '@/shared/components/widgets/CityInput';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import MultiCheckbox from '@/shared/components/widgets/MultiCheckbox';
import { useReviewStore } from '@/shared/store/useReviewStore';
import { useRouter } from 'next/navigation';

export default function ReviewFormSearch() {

	const { user } = useUserStore()

	const { setSearchReviews } = useReviewSearchStore()

	const { reviews, setReviews } = useReviewStore()

	const [pending, startTransition] = useTransition()

	// const router = useRouter();

	// useEffect(() => {
	// 	if (user?.balance !== undefined && user.balance < 500) {
	// 		router.push('/dashboard'); // замените на нужный путь
	// 	}

	// }, [user, router]);

	const reviewSchema = z.object({
		iin: z.string()
	});

	type IReview = z.infer<typeof reviewSchema>

	const form = useForm({
		resolver: zodResolver(reviewSchema),
		defaultValues: {
			iin: undefined
		},
	})

	const onSubmit = async (data: IReview) => {

		startTransition(async () => {

			try {
				const res = await findManyByFilter(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				setSearchReviews(res.reviews)
				setReviews([])
			} catch (error) {
				console.error(error)
				toast.error('Ошибка при поиске ИИН/БИН', {
					position: 'top-center',
				})
			}
		})

	}

	const onError = (errors: any) => {
		toast.error(errors.message ?? 'Некорректные данные', {
			position: 'top-center',
		})
		console.error(errors);

	};

	return (
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Поиск по ИИН/БИН</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className={cn('grid w-full gap-3 md:gap-5 items-start')}>
						<Input
							type='text'
							placeholder="Укажите ИИН/БИН"
							className='text-sm'
							required
							{...form.register('iin')}
						/>
					</div>

					<div className="grid sm:grid-cols-2 md:grid-cols-6  w-full gap-3 md:gap-5 items-start">

						<Button
							type='submit'
							className=' bg-(--dark-accent) lg:col-start-3 col-span-6 lg:col-span-2 mt-4 '
							disabled={pending}
						>
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти отзывы</>) : "Найти вакансию"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
