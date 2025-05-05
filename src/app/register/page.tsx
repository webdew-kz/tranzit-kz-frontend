
import Link from 'next/link';
import RegisterForm from './_ui/RegisterForm';



export default function Register() {

	return (
		<div className="h-[calc(100vh-48px)] sm:h-[calc(100vh-60px)] bg-[url(/images/bg-home.jpg)] md:bg-[url(/images/bg-home-full.jpg)] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center">
			<div className="flex flex-col gap-5 items-center justify-center p-5 bg-background w-[calc(100vw-32px)] max-w-full sm:max-w-xs -translate-y-6 rounded-lg opacity-95 border-(--dark-accent) border">
				<h2
					className='text-2xl font-semibold text-center'
				>Регистрация</h2>

				<RegisterForm />

				<div className=" flex justify-between w-full">
					<Link
						href={'/login'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>Уже есть аккаунт?</Link>
					<Link
						href={'/'}
						className='text-[12px] text-(--dark-accent) hover:text-(--foreground) border-b border-dashed border-(--dark-accent) hover:border-(--foreground)'
					>На главную</Link>
				</div>

			</div>
		</div>
	);
}
