'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../create-list/types'
import { createList } from './schema'
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

	const { title, boardId } = data
	let list

	try {
		const board = await dbPrisma.board.findUnique({
			where: {
				id: boardId,
				orgId,
			},
		})

		if (!board) {
			return {
				error: 'Board not found',
			}
		}

		const lastList = await dbPrisma.list.findFirst({
			where: { boardId: boardId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrder = lastList ? lastList.order + 1 : 1

		list = await dbPrisma.list.create({
			data: {
				title,
				boardId,
				order: newOrder,
			},
		})

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.LIST,
		})
	} catch (error) {
		console.log(error)
		return {
			error: 'Failed to create.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: list }
}

export const CreateList = createSafeAction(createList, handler)
