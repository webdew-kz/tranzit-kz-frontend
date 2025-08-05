'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Undo2 } from 'lucide-react'

export default function BtnBack() {
	const router = useRouter()
	const [canGoBack, setCanGoBack] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setCanGoBack(window.history.length > 1)
		}
	}, [])

	if (!canGoBack) return null

	return (

		<Button
			type='button'
			variant='outline'
			onClick={() => router.back()}
			className=' fixed left-[20px] top-[140px] z-50'
		>
			<Undo2 />
			<span className='block md:hidden'>Назад</span>
		</Button>
	)
}
