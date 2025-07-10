import PartsFormCopy from './_ui/PartsFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<PartsFormCopy id={id} />
	)
}