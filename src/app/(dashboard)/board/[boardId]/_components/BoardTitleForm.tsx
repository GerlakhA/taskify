'use client'

import { UpdateBoard } from '@/actions/update-board'
import { FormInput } from '@/components/form/Form-Input'
import { Button } from '@/components/ui/button'
import { useAction } from '@/lib/use-action'
import { Board } from '@prisma/client'
import { ElementRef, FC, useRef, useState } from 'react'
import { toast } from 'sonner'

interface IBoardTitleForm {
	data: Board
}

const BoardTitleForm: FC<IBoardTitleForm> = ({ data }) => {
	const formRef = useRef<ElementRef<'form'>>(null)
	const inputRef = useRef<ElementRef<'input'>>(null)

	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(data.title)

	const { execute } = useAction(UpdateBoard, {
		onSuccess: data => {
			toast.success(`Update title board: ${data.title} successfully`)
			setTitle(data.title)
			disabledEditing()
		},
		onError: error => {
			toast.error(error)
		},
	})

	const enabledEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef.current?.focus()
			inputRef.current?.select()
		})
	}

	const disabledEditing = () => {
		setIsEditing(false)
	}

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string
		console.log('submitted', title)
		execute({ title, id: data.id })
	}

	const onBlur = () => {
		formRef.current?.requestSubmit()
	}

	if (isEditing) {
		return (
			<form
				ref={formRef}
				action={onSubmit}
				className='flex items-center gap-x-2'
			>
				<FormInput
					ref={inputRef}
					id='title'
					onBlur={onBlur}
					defaultValue={title}
					className='text-lg font-bold px-[7px] py-1 h-7 bg-transparent
          focus-visible:outline-none focus-visible:ring-transparent border-none'
				/>
			</form>
		)
	}

	return (
		<Button
			onClick={enabledEditing}
			variant={'transparent'}
			className='h-auto w-auto font-bold text-lg p-1 px-2'
		>
			{title}
		</Button>
	)
}

export default BoardTitleForm
