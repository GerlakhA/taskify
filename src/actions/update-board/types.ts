import { ActionState } from '@/lib/create-safe-action'
import { Board } from '@prisma/client'
import { z } from 'zod'
import { updateBoard } from './schema'

export type TypeInput = z.infer<typeof updateBoard>
export type ReturnType = ActionState<TypeInput, Board>
