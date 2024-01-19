import { ActionState } from '@/lib/create-safe-action'
import { List } from '@prisma/client'
import { z } from 'zod'
import { copyList } from './schema'

export type TypeInput = z.infer<typeof copyList>
export type ReturnType = ActionState<TypeInput, List>
