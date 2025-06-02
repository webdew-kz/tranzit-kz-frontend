
import TruckFormEdit from './_ui/TruckFormEdit'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TruckFormEdit id={id} />
	)
}
