import React from 'react'
import ResetForm from '../../widgets/ResetForm'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { ShieldUser } from 'lucide-react'

export default function HeroSection() {
	return (
		<div className="h-[100vh] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border">
				<h2
					className='text-2xl font-semibold text-center'
				>Инструкция по восстановлению пароля</h2>


				<ol>
					<li>С номера телефона, который был указан при регистрации аккаунта, отправьте в Telegram сообщение с новым паролем. (Пример сообщения: 123456789)</li>
					<li>После отправки сообщения ожидайте подтверждение — в течение <strong>1–24 часов</strong> вы получите в Telegram чат сообщение об успешном изменении пароля.</li>
				</ol>


				<p>Пароль должен содержать только латинские буквы и цифры</p>




				<Button
					variant='default'
					className='w-full sm:hidden bg-accent'
					asChild
				>

					<Link
						href='https://t.me/itranzit_kz'
						target='_blank'
						className='flex gap-3 items-center justify-start'
					>
						Отправить новый пароль
					</Link>
				</Button>


				<hr />
				<div className="note">Важно: сообщение должно быть отправлено <strong>с того же номера</strong>, который привязан к вашему аккаунту. Пароли, отправленные с других номеров, обработаны не будут.</div>

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
