import { cn } from '@/shared/lib/utils'
import Image from 'next/image'
import React from 'react'

interface LogoProps {
	size?: number
	className?: string
}

export default function Logo({ size = 48, className }: LogoProps) {
	return (
		<div
			className={cn(`${className}`, 'flex items-center gap-1')}
			style={{ height: size, width: size, position: 'relative' }}
		>
			<Image
				src='/images/logo.png'
				alt='logo'
				width={size}
				height={size}
				priority
				style={{ height: 'auto', aspectRatio: '1/1' }}
			/>
		</div>
	)
}
