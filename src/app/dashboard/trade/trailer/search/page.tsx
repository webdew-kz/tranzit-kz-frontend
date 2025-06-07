
import TrailerSearchList from './_ui/TrailerSearchList';
import TrailerFormSearch from './_ui/TrailerFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<TrailerFormSearch />
			<TrailerSearchList />
		</div>
	)
}
