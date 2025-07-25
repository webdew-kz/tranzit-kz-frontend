'use client'
import { useUserStore } from '@/shared/store/useUserStore';
import MyPaymentList from './_ui/MyPaymentList'
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

	if (isAllowed === null) return null;

	if (!isAllowed) return null;

	return <MyPaymentList />;
}
