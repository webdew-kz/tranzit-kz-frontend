
import BrokerFormEdit from './_ui/BrokerFormEdit'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<BrokerFormEdit id={id} />
	)
}
