import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function HeroSection() {
	return (
		<div className="h-[100vh] sm:h-[100vh] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex items-center justify-center flex-col gap-5">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border" style={{ marginBottom: '60px' }}>
				<h2 className='text-xl text-center'>Добро пожаловать на платформу <span className='text-(--dark-accent)'>TRANZIT</span></h2>
				<Button className=' w-full bg-(--dark-accent) hover:bg-(--foreground)' asChild>
					<Link href='/login'>Вход</Link>
				</Button>
				<Button className=' w-full border-(--dark-accent) dark:border-(--dark-accent) hover:bg-(--foreground) hover:border-(--foreground) hover:text-(--background) hover:dark:bg-(--foreground) hover:dark:border-(--foreground) hover:dark:text-(--background)' variant="outline" asChild>
					<Link href='/register'>Регистрация</Link>
				</Button>
			</div>
			<div className="flex flex-col gap-3 text-center">
				<Link href='/policy' className='text-white hover:text-(--foreground)'>Политика конфиденциальности</Link>
				<Link href='/aferta' className='text-white hover:text-(--foreground)'>Договор аферты</Link>
				<Link href='/rekvizit' className='text-white hover:text-(--foreground)'>Реквизиты</Link>
			</div>
		</div>
	)
}
