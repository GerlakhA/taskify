'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { updateCard } from './schema'
import { ReturnType, TypeInput } from './types'

const handler = async (data: TypeInput): Promise<ReturnType> => {
	const { userId, orgId } = auth()

	if (!userId || !orgId) {
		return {
			error: 'Unathorized',
		}
	}

	const { id, boardId, ...values } = data

	let card

	try {
		card = await dbPrisma.card.update({
			where: {
				id,
				list: {
					board: {
						orgId,
					},
				},
			},
			data: {
				...values,
			},
		})
	} catch (error) {
		return {
			error: 'Failed to update',
		}
	}

	revalidatePath(`/board/${id}`)
	return { data: card }
}

export const UpdateCard = createSafeAction(updateCard, handler)
