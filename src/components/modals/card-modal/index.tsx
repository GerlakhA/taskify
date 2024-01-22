'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { fetcher } from '@/lib/fetcher'
import { CardsWithList } from '@/types'
import { AuditLog } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import Actions from './Actions'
import Activity from './Activity'
import Description from './Description'
import Header from './Header'

const CardModal = () => {
	const id = useCardModal(state => state.id)
	const onClose = useCardModal(state => state.onClose)
	const onOpen = useCardModal(state => state.onOpen)
	const isOpen = useCardModal(state => state.isOpen)

	const { data: cardData } = useQuery<CardsWithList>({
		queryKey: ['card', id],
		queryFn: () => fetcher(`/api/cards/${id}`),
	})

	const { data: auditLogsData } = useQuery<AuditLog[]>({
		queryKey: ['card-logs', id],
		queryFn: () => fetcher(`/api/cards/${id}/logs`),
	})

	console.log(cardData?.title)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				{!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
				<div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
					<div className='col-span-3'>
						<div className='w-full space-y-6'>
							{!cardData ? (
								<Description.Skeleton />
							) : (
								<Description data={cardData} />
							)}
							{!auditLogsData ? (
								<Activity.Skeleton />
							) : (
								<Activity items={auditLogsData} />
							)}
						</div>
					</div>
					{!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default CardModal
