
import CargoSearchList from './_ui/CargoSearchList';
import CargoFormSearch from './_ui/CargoFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<CargoFormSearch />
			<CargoSearchList />
		</div>
	)
}
