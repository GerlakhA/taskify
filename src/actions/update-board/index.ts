'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { updateBoard } from './schema'
import { ReturnType, TypeInput } from './types'

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
	} catch (error) {
		return {
			error: 'Failed to update',
		}
	}

	revalidatePath(`/board/${id}`)
	return { data: board }
}

export const UpdateBoard = createSafeAction(updateBoard, handler)
