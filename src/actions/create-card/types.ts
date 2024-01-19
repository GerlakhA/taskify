import { ActionState } from '@/lib/create-safe-action'
import { Card } from '@prisma/client'
import { z } from 'zod'
import { createCard } from './schema'

export type TypeInput = z.infer<typeof createCard>
export type ReturnType = ActionState<TypeInput, Card>
