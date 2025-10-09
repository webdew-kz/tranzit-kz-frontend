import Broker from './_ui/Broker'


export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<Broker id={id} />
	)
}
