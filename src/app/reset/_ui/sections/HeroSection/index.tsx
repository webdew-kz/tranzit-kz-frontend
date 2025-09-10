import React from 'react'
import ResetForm from '../../widgets/ResetForm'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { ShieldUser } from 'lucide-react'

export default function HeroSection() {
	return (
		<div className="min-h-[100vh] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center overflow-y-auto pt-[80px]">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border text-xs">
				<h2
					className='text-2xl font-semibold text-center'
				>Инструкция по восстановлению пароля</h2>


				<ol>
					<li className='mb-3'>1. С номера телефона, который был указан при регистрации аккаунта, отправьте в Telegram сообщение с новым паролем. (Пример сообщения: Пароль 123456789)</li>
					<li className='mb-3'>2. После отправки сообщения ожидайте подтверждение — в течение <strong>1–24 часов</strong> вы получите в Telegram чат сообщение "Пароль успешно изменен".</li>
					<li>3. Авторизуйтесь (войдите) в личный кабинет с новым паролем.</li>
				</ol>


				<p className='text-(--dark-accent)'>Пароль должен содержать только латинские буквы и цифры</p>


				<Button className=' w-full bg-(--dark-accent) hover:bg-(--foreground)' asChild>
					<Link
						href='https://t.me/itranzit_kz'
						target='_blank'
					>Отправить новый пароль</Link>
				</Button>

				<div className="rounded-lg  border-(--dark-accent) border p-3">Важно: сообщение должно быть отправлено <strong>с того же номера</strong>, который привязан к вашему аккаунту. Пароли, отправленные с других номеров, обработаны не будут.</div>

				{/* <ResetForm /> */}

				{/* <div className=" flex justify-between w-full">
					<Link
						href={'/register'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>Нет аккаунта?</Link>
					<Link
						href={'/reset'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>Забыли пароль?</Link>
				</div> */}
			</div>
		</div>
	)
}
