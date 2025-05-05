import { cn } from '@/shared/lib/utils'
import { ReactNode } from 'react'

interface props {
	className?: string
	children: ReactNode
}

export default function Container({ children, className }: props) {
	return (
		<div className={cn('max-w-300 px-4 mx-auto w-full', className)}>
			{children}
		</div>
	)
}
