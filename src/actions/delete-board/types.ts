import { ActionState } from '@/lib/create-safe-action'
import { Board } from '@prisma/client'
import { z } from 'zod'
import { deleteBoard } from './schema'

export type TypeInput = z.infer<typeof deleteBoard>
export type ReturnType = ActionState<TypeInput, Board>
