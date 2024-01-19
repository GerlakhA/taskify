import { ActionState } from '@/lib/create-safe-action'
import { Card } from '@prisma/client'
import { z } from 'zod'
import { updateCardOrder } from './schema'

export type TypeInput = z.infer<typeof updateCardOrder>
export type ReturnType = ActionState<TypeInput, Card[]>
