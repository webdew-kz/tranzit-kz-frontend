"use client";
import BrokerSearchList from './_ui/BrokerSearchList';
import BrokerFormSearch from './_ui/BrokerFormSearch';

export default function page() {
	return (
		<div className='grid gap-5'>
			<BrokerFormSearch />
			<BrokerSearchList />
		</div>
	)
}
