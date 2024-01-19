'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../update-list-order/types'
import { updateListOrder } from './schema'
import { ReturnType } from './types'

const handler = async (data: TypeInput): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { items, boardId } = data
	let lists

	try {
		const transaction = items.map(list =>
			dbPrisma.list.update({
				where: {
					id: list.id,
					board: {
						orgId,
					},
				},
				data: {
					order: list.order,
				},
			})
		)

		lists = await dbPrisma.$transaction(transaction)
	} catch (error) {
		return {
			error: 'Failed to reorder.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: lists }
}

export const UpdateListOrder = createSafeAction(updateListOrder, handler)
