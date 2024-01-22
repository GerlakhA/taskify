'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../delete-list/types'
import { deleteList } from './schema'
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
		list = await dbPrisma.list.delete({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
		})

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			action: ACTION.DELETE,
			entityType: ENTITY_TYPE.LIST,
		})
	} catch (error) {
		return {
			error: 'Failed to delete.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: list }
}

export const DeleteList = createSafeAction(deleteList, handler)
