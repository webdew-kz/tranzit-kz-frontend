import { useUserStore } from '@/shared/store/useUserStore';
import MyPaymentList from './_ui/MyPaymentList'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default async function page() {

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
		<MyPaymentList />
	)
}
