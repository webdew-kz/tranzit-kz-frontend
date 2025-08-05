'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Undo2 } from 'lucide-react'

const EXCLUDED_PATHS = [
	'/',
	'/dashboard',
	'/register',
	'/login',
	'/policy',
	'/oferta',
	'/reset'
]

export default function BtnBack() {
	const router = useRouter()
	const pathname = usePathname()
	const [canGoBack, setCanGoBack] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const hasHistory = window.history.length > 1
			const isExcluded = EXCLUDED_PATHS.includes(pathname)
			setCanGoBack(hasHistory && !isExcluded)
		}
	}, [pathname])

	if (!canGoBack) return null

	return (

		<Button
			type='button'
			variant='outline'
			onClick={() => router.back()}
			className=' fixed left-[16px] top-[130px] z-50'
		>
			<Undo2 />
			<span className='block md:hidden'>Назад</span>
		</Button>
	)
}
