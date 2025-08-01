

import { getPrefLangCookie } from '@/shared/lib/getPrefLangCookie'
import Logo from '@/shared/components/widgets/logo'
import { ThemeToggle } from '@/shared/components/widgets/theme-toggle'
import { isAuth } from '@/shared/lib/isCookies'
import Logout from './Logout'
import { GoogleTranslate } from '../../widgets/GoogleTranslate'

export default async function TopBar() {

	const isAuthUser = await isAuth()

	return (
		<section className='h-15 flex items-center px-4 w-full border-b border-(--dark-accent) z-1 fixed !top-0 bg-background'>
			<div className=" flex gap-4 justify-between items-center w-full">
				<a href='/' className='md:grow flex items-center gap-2'>
					<Logo size={32} />
					<div className=" hidden md:flex flex-col items-center">
						<h1 className=' text-[20px] uppercase m-0 leading-none text-(--light-accent)'>Транзит</h1>
						<p className=' text-[11px] m-0 leading-none text-(--dark-accent)'>Imperial Logistic</p>
					</div>
				</a>
				<GoogleTranslate prefLangCookie={await getPrefLangCookie()} />
				<ThemeToggle />
				<Logout isAuthUser={isAuthUser} />
			</div>
		</section>
	)
}
