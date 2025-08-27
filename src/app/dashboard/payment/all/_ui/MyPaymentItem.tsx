"use client"
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import Loader from '@/shared/components/widgets/Loader'
import { convertFromKZT, convertToKZT, getCurrencySymbol } from '@/shared/lib/convertToKZT'
import { formatRelativeDate } from '@/shared/lib/formatRelativeDate'
import { getCountryCode } from '@/shared/lib/getCountryCode'
import { checkEndDate, isEndedDate } from '@/shared/lib/isEndedDate'
import { cn } from '@/shared/lib/utils'
import { ArrowBigDown, ArrowBigUp, BanknoteArrowUp, Box, CalendarDays, ChevronDown, Container, Copy, Eye, HandCoins, MessageCircleMore, Move3d, MoveHorizontal, MoveRight, RefreshCcw, SquarePen, Star, Trash, Truck, User, Wallet, Weight, X } from 'lucide-react'
import React, { memo, SetStateAction, useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { IPayment } from '@/shared/types/payment.type'

interface MyPaymentItemProps {
	paymentInitial: IPayment
	selected: boolean
	setPayments: (value: SetStateAction<IPayment[]>) => void
	rates?: any
	loading?: boolean
}

function MyPaymentItemComponent({ paymentInitial, selected, setPayments, rates, loading }: MyPaymentItemProps) {
	const [payment, setPayment] = useState<IPayment>(paymentInitial);

	if (loading) {
		return <p className='text-center py-5'>Загрузка ...</p>;
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
								<span className=' font-medium'>
									{payment.createdAt
										? new Date(payment.createdAt).toLocaleString('ru-RU')
										: ''}
								</span>
							</span>
						</span>
					</div>
				</div>

				<div className=" flex flex-col lg:flex-row gap-2 w-full lg:justify-between lg:items-center mb-3">
					<div className=" grid gap-2 lg:gap-4">
						<div className="flex items-center gap-2">
							<span>Платеж на сумму:</span>
							<span className="block">{payment.amount} ₸</span>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

const MyPaymentItem = memo(MyPaymentItemComponent);
export default MyPaymentItem;
