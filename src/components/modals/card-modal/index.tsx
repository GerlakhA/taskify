'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { fetcher } from '@/lib/fetcher'
import { CardsWithList } from '@/types'
import { useQuery } from '@tanstack/react-query'
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

	console.log(cardData?.title)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				{!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
				<Description />
			</DialogContent>
		</Dialog>
	)
}

export default CardModal
