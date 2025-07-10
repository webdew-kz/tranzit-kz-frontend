import Parts from './_ui/Parts'


export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<Parts id={id} />
	)
}
