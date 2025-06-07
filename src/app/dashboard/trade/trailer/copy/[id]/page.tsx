import TrailerFormCopy from './_ui/TrailerFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TrailerFormCopy id={id} />
	)
}