'use server'

import { createSafeAction } from '@/lib/create-safe-action'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { updateList } from './schema'
import { ReturnType, TypeInput } from './types'

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
	} catch (error) {
		return {
			error: 'Failed to update',
		}
	}

	revalidatePath(`/board/${boardId}`)
	return { data: list }
}

export const UpdateList = createSafeAction(updateList, handler)
