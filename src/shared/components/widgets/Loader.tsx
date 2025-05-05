import { Loader2 } from 'lucide-react'
import React from 'react'

export default function Loader() {
	return (
		<div className=" fixed inset-0 z-50 bg-background flex justify-center items-center">
			<Loader2 className="animate-spin stroke-(--dark-accent)" size={60} />
		</div>
	)
}
