import { z } from 'zod'

export const copyCard = z.object({
	id: z.string(),
	boardId: z.string(),
})
