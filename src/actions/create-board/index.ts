'use server'

import { createAuditLog } from '@/lib/create-audit-log'
import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { hasAvailableCount, incrementAvailableCount } from '@/lib/org-limit'
import { auth } from '@clerk/nextjs'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { CreateBoard } from './schema'
import { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const canCreate = await hasAvailableCount()

	if (!canCreate) {
		return {
			error:
				'You have reached your limit of free boards. Please upgrade to create more.',
		}
	}

	const { title, image } = data

	const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
		image.split('|')

	if (
		!imageId ||
		!imageThumbUrl ||
		!imageFullUrl ||
		!imageUserName ||
		!imageLinkHTML
	) {
		return {
			error: 'Missing fields. Failed to create board.',
		}
	}

	let board

	try {
		board = await dbPrisma.board.create({
			data: {
				title,
				orgId,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageUserName,
				imageLinkHTML,
			},
		})

		await incrementAvailableCount()

		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.BOARD,
		})
	} catch (error) {
		return {
			error: 'Failed to create',
		}
	}
	revalidatePath(`/board/${board.id}`)
	return { data: board }
}

export const createBoard = createSafeAction(CreateBoard, handler)
