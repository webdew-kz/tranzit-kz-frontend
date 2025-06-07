
import TractorSearchList from './_ui/TractorSearchList';
import TractorFormSearch from './_ui/TractorFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<TractorFormSearch />
			<TractorSearchList />
		</div>
	)
}
