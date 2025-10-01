"use client"
import { Card, CardContent } from '@/shared/components/ui/card'
import { ArrowBigDown } from 'lucide-react'
import React, { memo, SetStateAction } from 'react'
import { IPayment } from '@/shared/types/payment.type'

interface MyPaymentItemProps {
	paymentInitial: IPayment
	selected: boolean
	setPayments: (value: SetStateAction<IPayment[]>) => void
	rates?: any
	loading?: boolean
}

const MyPaymentItem = ({
	paymentInitial,
	selected,
	setPayments,
	rates,
	loading,
}: MyPaymentItemProps) => {

	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>
	}

	return (
		<Card className='p-0 border-1 border-(--dark-accent) '>
			<CardContent className='p-3 lg:p-5 flex flex-col justify-between'>
				<div className=" flex flex-col lg:flex-row justify-between w-full lg:items-center mb-2">

					<div className=" flex flex-col order-2 lg:order-1 gap-1 lg:flex-row lg:gap-4 mb-3">

						<span className=' flex items-center gap-1'>
							<ArrowBigDown size={16} />
							<span className='truncate block text-sm'>
								<span className=' mr-2 font-light'>Оплачено:</span>
								<span className=' font-medium'>{paymentInitial.createdAt
									? new Date(paymentInitial.createdAt).toLocaleString('ru-RU')
									: ''}</span>
							</span>
						</span>
					</div>

					<div className=" flex items-center order-1 lg:order-2 gap-4 justify-end">
					</div>
				</div>

				<div className=" flex flex-col lg:flex-row gap-2 w-full lg:justify-between lg:items-center mb-3">

					<div className=" grid gap-2 lg:gap-4">

						<div className="flex items-center gap-2">
							<span>Пользователь:</span>
							<span className="block">
								{paymentInitial.user?.login || paymentInitial.user?.phone}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span>Назначение:</span>
							<span className="block">
								{paymentInitial.descr}
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span>Платеж на сумму:</span>
							<span className="block">
								{paymentInitial.amount} ₸
							</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default MyPaymentItem
