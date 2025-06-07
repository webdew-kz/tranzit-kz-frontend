import Trailer from './_ui/Trailer'


export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<Trailer id={id} />
	)
}
