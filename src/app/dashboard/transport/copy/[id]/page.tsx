import TransportFormCopy from './_ui/TransportFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<TransportFormCopy transportId={id} />
	)
}