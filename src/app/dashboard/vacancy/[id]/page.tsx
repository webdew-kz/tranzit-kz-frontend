import Vacancy from './_ui/Vacancy'


export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	return (
		<Vacancy id={id} />
	)
}
