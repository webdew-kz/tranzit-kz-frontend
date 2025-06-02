import TruckFormCopy from './_ui/TruckFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TruckFormCopy id={id} />
	)
}