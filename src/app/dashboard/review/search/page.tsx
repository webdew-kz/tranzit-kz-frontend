
import ReviewSearchList from './_ui/ReviewSearchList';
import ReviewFormSearch from './_ui/ReviewFormSearch';

export default function page() {
	return (
		<div className='grid gap-5 pb-[60px]'>
			<ReviewFormSearch />
			<ReviewSearchList />
		</div>
	)
}
