import { ActionState } from '@/lib/create-safe-action'
import { List } from '@prisma/client'
import { z } from 'zod'
import { deleteList } from './schema'

export type TypeInput = z.infer<typeof deleteList>
export type ReturnType = ActionState<TypeInput, List>
