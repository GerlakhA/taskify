import { z } from 'zod'

export const copyList = z.object({
	id: z.string(),
	boardId: z.string(),
})
