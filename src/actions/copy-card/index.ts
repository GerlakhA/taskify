'use server'

import { createAuditLog } from '@/lib/create-audit-log'
import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../copy-card/types'
import { copyCard } from './schema'
import { ReturnType } from './types'

const handler = async (data: TypeInput): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { id, boardId } = data
	let card

	try {
		const cardToCopy = await dbPrisma.card.findUnique({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		})

		if (!cardToCopy) return { error: 'Failed to copy.' }

		const lastCard = await dbPrisma.card.findFirst({
			where: {
				listId: cardToCopy.listId,
			},
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrderCard = lastCard ? lastCard.order + 1 : 1

		card = await dbPrisma.card.create({
			data: {
				title: `${cardToCopy.title} - Copy`,
				description: cardToCopy.description,
				order: newOrderCard,
				listId: cardToCopy.listId,
			},
		})

		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.CARD,
		})
	} catch (error) {
		return {
			error: 'Failed copy.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: card }
}

export const CopyCard = createSafeAction(copyCard, handler)
