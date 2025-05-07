import React from 'react'
import ResetForm from '../../widgets/ResetForm'
import Link from 'next/link'

export default function HeroSection() {
	return (
		<div className="h-[100vh] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border">
				<h2
					className='text-2xl font-semibold text-center'
				>Сброс пароля</h2>

				<ResetForm />

				<div className=" flex justify-between w-full">
					<Link
						href={'/register'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>Нет аккаунта?</Link>
					<Link
						href={'/reset'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>Забыли пароль?</Link>
				</div>
			</div>
		</div>
	)
}
