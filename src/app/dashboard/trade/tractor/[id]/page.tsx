import Tractor from './_ui/Tractor'


export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<Tractor id={id} />
	)
}
