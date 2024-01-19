import { ActionState } from '@/lib/create-safe-action'
import { Card } from '@prisma/client'
import { z } from 'zod'
import { updateCard } from './schema'

export type TypeInput = z.infer<typeof updateCard>
export type ReturnType = ActionState<TypeInput, Card>
