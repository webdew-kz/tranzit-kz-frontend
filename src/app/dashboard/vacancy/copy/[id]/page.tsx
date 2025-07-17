import VacancyFormCopy from './_ui/VacancyFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<VacancyFormCopy vacancyId={id} />
	)
}