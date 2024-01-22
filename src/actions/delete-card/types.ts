import { ActionState } from '@/lib/create-safe-action'
import { Card } from '@prisma/client'
import { z } from 'zod'
import { deleteCard } from './schema'

export type TypeInput = z.infer<typeof deleteCard>
export type ReturnType = ActionState<TypeInput, Card>
