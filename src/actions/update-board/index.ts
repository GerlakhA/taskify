'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { updateBoard } from './schema'
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

	const { title, id } = data

	let board

	try {
		board = await dbPrisma.board.update({
			where: {
				id,
				orgId,
			},
			data: {
				title,
			},
		})

		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			action: ACTION.UPDATE,
			entityType: ENTITY_TYPE.BOARD,
		})
	} catch (error) {
		return {
			error: 'Failed to update',
		}
	}

	revalidatePath(`/board/${id}`)
	return { data: board }
}

export const UpdateBoard = createSafeAction(updateBoard, handler)
