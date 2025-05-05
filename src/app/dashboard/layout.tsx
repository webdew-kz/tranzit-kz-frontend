import Aside from './_ui/Aside'
import MobileMenu from './_ui/MobileMenu'

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<div className="grid grid-cols-12 pt-[60px]">
				<Aside />
				<main className="col-span-12 md:col-span-10 p-4 pb-[80px]">
					{children}
				</main>
			</div>
			<MobileMenu />
		</>
	)
}