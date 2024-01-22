'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { updateList } from './schema'
import { ReturnType, TypeInput } from './types'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: TypeInput): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unathorized',
		}
	}

	const { title, id, boardId } = data

	let list

	try {
		list = await dbPrisma.list.update({
			where: {
				id,
				boardId,
				board: {
					orgId,
				},
			},
			data: {
				title,
			},
		})

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			action: ACTION.UPDATE,
			entityType: ENTITY_TYPE.LIST,
		})
	} catch (error) {
		return {
			error: 'Failed to update',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: list }
}

export const UpdateList = createSafeAction(updateList, handler)
