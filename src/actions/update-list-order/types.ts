import { ActionState } from '@/lib/create-safe-action'
import { List } from '@prisma/client'
import { z } from 'zod'
import { updateListOrder } from './schema'

export type TypeInput = z.infer<typeof updateListOrder>
export type ReturnType = ActionState<TypeInput, List[]>
