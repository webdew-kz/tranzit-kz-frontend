
import TransportSearchList from './_ui/TransportSearchList';
import TransportFormSearch from './_ui/TransportFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<TransportFormSearch />
			<TransportSearchList />
		</div>
	)
}
