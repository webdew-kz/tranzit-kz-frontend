
import PartsFormEdit from './_ui/PartsFormEdit'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<PartsFormEdit id={id} />
	)
}
