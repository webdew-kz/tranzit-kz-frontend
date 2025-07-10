
import PartsSearchList from './_ui/PartsSearchList';
import PartsFormSearch from './_ui/PartsFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<PartsFormSearch />
			<PartsSearchList />
		</div>
	)
}
