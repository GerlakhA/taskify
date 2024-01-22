import { z } from 'zod'

export const deleteCard = z.object({
	id: z.string(),
	boardId: z.string(),
})
