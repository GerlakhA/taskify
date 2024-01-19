'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { updateCardOrder } from './schema'
import { ReturnType, TypeInput } from './types'

const handler = async (data: TypeInput): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { items, boardId } = data
	let updatedCards

	try {
		const transaction = items.map(card =>
			dbPrisma.card.update({
				where: {
					id: card.id,
					list: {
						board: {
							orgId,
						},
					},
				},
				data: {
					order: card.order,
					listId: card.listId,
				},
			})
		)

		updatedCards = await dbPrisma.$transaction(transaction)
	} catch (error) {
		return {
			error: 'Failed to reorder.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: updatedCards }
}

export const UpdateCardOrder = createSafeAction(updateCardOrder, handler)
