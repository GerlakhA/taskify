'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { TypeInput } from '../create-card/types'
import { createCard } from './schema'
import { ReturnType } from './types'

const handler = async (data: TypeInput): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized',
		}
	}

	const { title, boardId, listId } = data
	let card

	try {
		const list = await dbPrisma.list.findUnique({
			where: {
				id: listId,
				board: {
					orgId,
				},
			},
		})

		if (!list) {
			return {
				error: 'List not found',
			}
		}

		const lastCard = await dbPrisma.card.findFirst({
			where: { listId },
			orderBy: { order: 'desc' },
			select: { order: true },
		})

		const newOrder = lastCard ? lastCard.order + 1 : 1

		card = await dbPrisma.card.create({
			data: {
				title,
				listId,
				order: newOrder,
			},
		})
	} catch (error) {
		console.log(error)
		return {
			error: 'Failed to create.',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: card }
}

export const CreateCard = createSafeAction(createCard, handler)
