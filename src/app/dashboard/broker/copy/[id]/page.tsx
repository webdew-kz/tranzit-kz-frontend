import BrokerFormCopy from './_ui/BrokerFormCopy'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {

	const { id } = await params

	return (
		<BrokerFormCopy brokerId={id} />
	)
}