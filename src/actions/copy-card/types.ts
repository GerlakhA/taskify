import { ActionState } from '@/lib/create-safe-action'
import { Card } from '@prisma/client'
import { z } from 'zod'
import { copyCard } from './schema'

export type TypeInput = z.infer<typeof copyCard>
export type ReturnType = ActionState<TypeInput, Card>
