'use client'

import { useUserStore } from '@/shared/store/useUserStore';
import ReviewFormSearch from './_ui/ReviewFormSearch';
import ReviewSearchList from './_ui/ReviewSearchList';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
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

	if (isAllowed === null) return null; // предотвращает рендер до проверки

	if (!isAllowed) return null; // безопасное завершение

	return (
		<div className='grid gap-5  pb-[60px]'>
			<ReviewFormSearch />
			<ReviewSearchList />
		</div>
	);
}
