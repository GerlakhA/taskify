import { ActionState } from '@/lib/create-safe-action'
import { List } from '@prisma/client'
import { z } from 'zod'
import { updateList } from './schema'

export type TypeInput = z.infer<typeof updateList>
export type ReturnType = ActionState<TypeInput, List>
