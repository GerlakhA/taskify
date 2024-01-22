'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TypeInput } from '../delete-board/types'
import { deleteBoard } from './schema'
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

	const { id } = data
	let board

	try {
		board = await dbPrisma.board.delete({
			where: {
				id,
				orgId,
			},
		})

		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			action: ACTION.DELETE,
			entityType: ENTITY_TYPE.BOARD,
		})
	} catch (error) {
		return {
			error: 'Failed to delete.',
		}
	}

	revalidatePath(`/organization/${orgId}`)
	redirect(`/organization/${orgId}`)
}

export const DeleteBoard = createSafeAction(deleteBoard, handler)
