
import TrailerFormEdit from './_ui/TrailerFormEdit'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TrailerFormEdit id={id} />
	)
}
