import TractorFormCopy from './_ui/TractorFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TractorFormCopy id={id} />
	)
}