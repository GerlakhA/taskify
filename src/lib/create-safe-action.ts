import { z } from 'zod'

export type TypeFieldErrors<T> = {
	[K in keyof T]?: string[]
}

export type ActionState<TInput, TOutput> = {
	fieldErrors?: TypeFieldErrors<TInput>
	error?: string | null
	data?: TOutput
}

export const createSafeAction = <TInput, TOutput>(
	schema: z.Schema<TInput>,
	handler: (validateData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
	return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
		const validationResult = schema.safeParse(data)

		if (!validationResult.success) {
			return {
				fieldErrors: validationResult.error.flatten()
					.fieldErrors as TypeFieldErrors<TInput>,
			}
		}

		return handler(validationResult.data)
	}
}
