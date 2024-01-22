'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../copy-list/types'
import { copyList } from './schema'
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
	let list

	try {
		const listToCopy = await dbPrisma.list.findUnique({
			where: { id, boardId, board: { orgId } },
			include: { cards: true },
		})

		if (!listToCopy) {
			return { error: 'List not found' }
		}

		const lastList = await dbPrisma.list.findFirst({
			where: { boardId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrder = lastList ? lastList.order + 1 : 1

		list = await dbPrisma.list.create({
			data: {
				boardId: listToCopy.boardId,
				title: `${listToCopy.title} - copy`,
				order: newOrder,
				cards: {
					createMany: {
						data: listToCopy.cards.map(card => ({
							title: card.title,
							description: card.description,
							order: card.order,
						})),
					},
				},
			},
			include: {
				cards: true,
			},
		})

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.LIST,
		})
	} catch (error) {
		return {
			error: 'Failed copy.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: list }
}

export const CopyList = createSafeAction(copyList, handler)
