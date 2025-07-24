
import ReviewFormSearch from './_ui/ReviewFormSearch';
import ReviewSearchList from './_ui/ReviewSearchList';

export default function page() {
	return (
		<div className='grid gap-5'>
			<ReviewFormSearch />
			<ReviewSearchList />
		</div>
	)
}
