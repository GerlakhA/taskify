'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../copy-card/types'
import { deleteCard } from './schema'
import { ReturnType } from './types'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

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
		card = await dbPrisma.card.delete({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
		})

		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			action: ACTION.DELETE,
			entityType: ENTITY_TYPE.CARD,
		})
	} catch (error) {
		return {
			error: 'Failed to delete.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: card }
}

export const DeleteCard = createSafeAction(deleteCard, handler)
