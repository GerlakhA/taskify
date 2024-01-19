import { useCallback, useState } from 'react'
import { ActionState, TypeFieldErrors } from './create-safe-action'

type Action<TInput, TOutput> = (
	data: TInput
) => Promise<ActionState<TInput, TOutput>>

interface IUseActionOptions<TOutput> {
	onSuccess?: (data: TOutput) => void
	onError?: (error: string) => void
	onComplete?: () => void
}

export const useAction = <TInput, TOutput>(
	action: Action<TInput, TOutput>,
	options: IUseActionOptions<TOutput> = {}
) => {
	const [fieldErrors, setFieldErrors] = useState<
		TypeFieldErrors<TInput> | undefined
	>(undefined)

	const [error, setError] = useState<string | undefined>(undefined)
	const [data, setData] = useState<TOutput | undefined>(undefined)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const execute = useCallback(
		async (input: TInput) => {
			setIsLoading(true)

			try {
				const result = await action(input)
				if (!result) return

				setFieldErrors(result.fieldErrors)

				if (result.error) {
					setError(result.error)
					options.onError?.(result.error)
				}

				if (result.data) {
					setData(result.data)
					options.onSuccess?.(result.data)
				}
			} catch (error) {
			} finally {
				setIsLoading(false)
				options.onComplete?.()
			}
		},
		[action, options]
	)

	return {
		execute,
		error,
		fieldErrors,
		isLoading,
		data,
	}
}
