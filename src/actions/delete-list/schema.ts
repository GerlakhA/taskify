import { z } from 'zod'

export const deleteList = z.object({
	id: z.string(),
	boardId: z.string(),
})
