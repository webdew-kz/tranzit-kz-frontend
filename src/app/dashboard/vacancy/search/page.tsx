
import VacancySearchList from './_ui/VacancySearchList';
import VacancyFormSearch from './_ui/VacancyFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<VacancyFormSearch />
			<VacancySearchList />
		</div>
	)
}
