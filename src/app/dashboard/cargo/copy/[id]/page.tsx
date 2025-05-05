import CargoFormCopy from './_ui/CargoFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<CargoFormCopy cargoId={id} />
	)
}