
import TruckSearchList from './_ui/TruckSearchList';
import TruckFormSearch from './_ui/TruckFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<TruckFormSearch />
			<TruckSearchList />
		</div>
	)
}
