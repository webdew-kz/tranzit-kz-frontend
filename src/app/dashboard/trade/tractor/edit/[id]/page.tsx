
import TractorFormEdit from './_ui/TractorFormEdit'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TractorFormEdit id={id} />
	)
}
