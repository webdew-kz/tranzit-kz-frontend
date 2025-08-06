import Link from 'next/link'
import React from 'react'

export default function TariffSection() {
	return (
		<div className="h-[100%] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex flex-col items-center overflow-y-auto" style={{
			paddingTop: '100px'
		}}>
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full md:w-[calc(50vw-32px)] -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border">
				<h2
					className='text-2xl font-semibold text-center'
				>Тарифы</h2>

				<div className="">
					<p>Регистрация на платформе - <strong>1 000 ₸</strong></p>
					<br />
					<p>Добавление отзыва - <strong>1 000 ₸</strong></p>
					<br />
					<p>Запрос на удаление отзыва - <strong>5 000 ₸</strong></p>
					<br />
				</div>

				<div className=" flex justify-center w-full">
					<Link
						href={'/'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>На главную</Link>
				</div>
			</div>
		</div >
	)
}
