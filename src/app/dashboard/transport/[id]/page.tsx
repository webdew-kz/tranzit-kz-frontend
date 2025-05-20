import Transport from './_ui/Transport'


export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<Transport id={id} />
	)
}
