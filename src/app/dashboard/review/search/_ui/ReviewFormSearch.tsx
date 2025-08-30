"use client"
import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { z } from "zod"
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useReviewSearchStore } from '@/shared/store/useReviewSearchStore';
import { findByIin } from '../actions';
import { cn } from '@/shared/lib/utils';

export default function ReviewFormSearch() {

	const { setSearchReviews } = useReviewSearchStore()

	const setAverageRating = useReviewSearchStore(state => state.setAverageRating);

	const [pending, startTransition] = useTransition()

	const reviewSchema = z.object({
		iin: z.preprocess((val) => {
			if (typeof val === 'string') {
				// Удаляем все символы кроме цифр
				return val.replace(/[^\d]/g, '')
			}
			return val
		}, z.string().min(11, { message: 'минимум 11 цифр если номер телефона, 12 цифр если ИИН' })),
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
				setSearchReviews([])
				setAverageRating('')

				const res = await findByIin(data)

				toast.success(res.message, {
					position: 'top-center',
				})

				setSearchReviews(res.reviews)
				setAverageRating(res.averageRating)
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
		<Card className="w-full p-3 md:p-5 gap-3 md:gap-5 pb-[60px]">
			<CardHeader className='px-0'>
				<CardTitle className='text-xl text-center'>Поиск отзыва</CardTitle>
			</CardHeader>
			<CardContent className='px-0'>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className=' grid gap-3 md:gap-5'
				>
					<div className={cn('grid w-full gap-3 md:gap-5 items-start')}>
						<Input
							type='text'
							placeholder="Укажите номер телефона или ИИН/БИН"
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
							{pending ? (<><Loader2 className="animate-spin stroke-accent" /> Найти отзывы</>) : "Найти отзывы"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
