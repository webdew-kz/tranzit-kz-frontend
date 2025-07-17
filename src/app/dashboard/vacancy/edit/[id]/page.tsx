
import VacancyFormEdit from './_ui/VacancyFormEdit'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<VacancyFormEdit id={id} />
	)
}
