import { z } from 'zod'

export const deleteBoard = z.object({
	id: z.string(),
})
