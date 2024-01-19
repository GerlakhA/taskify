'use client'

import { UpdateList } from '@/actions/update-list'
import { FormInput } from '@/components/form/Form-Input'
import { useAction } from '@/lib/use-action'
import { List } from '@prisma/client'
import { ElementRef, FC, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'
import ListOptions from './ListOptions'

interface IListHeader {
	data: List
	onAddCard: () => void
}

const ListHeader: FC<IListHeader> = ({ data, onAddCard }) => {
	const [title, setTitle] = useState(data.title)
	const { execute } = useAction(UpdateList, {
		onSuccess: data => {
			toast.success(`Renamed to ${data.title}`)
			setTitle(data.title)
			disableEditing()
		},
		onError: error => {
			toast.error(error)
		},
	})
	const formRef = useRef<ElementRef<'form'>>(null)
	const inputRef = useRef<ElementRef<'input'>>(null)
	const [isEditing, setIsEditing] = useState(false)

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string
		const id = formData.get('id') as string
		const boardId = formData.get('boardId') as string

		if (title === data.title) {
			return disableEditing()
		}

		execute({ title, id, boardId })
	}

	const onBlur = () => {
		formRef.current?.requestSubmit()
	}

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			inputRef.current?.focus()
			inputRef.current?.select()
		})
	}

	const disableEditing = () => {
		setIsEditing(false)
	}

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			disableEditing()
		}
	}

	useEventListener('keydown', onKeyDown)
	useOnClickOutside(formRef, disableEditing)

	return (
		<div className='pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'>
			{isEditing ? (
				<form ref={formRef} action={onSubmit} className='flex-1 px-[2px]'>
					<input hidden id='id' name='id' value={data.id} />
					<input hidden id='boardId' name='boardId' value={data.boardId} />
					<FormInput
						ref={inputRef}
						onBlur={onBlur}
						id='title'
						defaultValue={title}
						className='text-sm font-medium px-[7px] py-1 h-7 bg-transparent truncate
            focus-visible:outline-none focus-visible:ring-transparent border-none focus:bg-white'
					/>
					<button type='submit' hidden />
				</form>
			) : (
				<div
					onClick={enableEditing}
					className='w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent'
				>
					{data.title}
				</div>
			)}
			<ListOptions onAddCard={onAddCard} data={data} />
		</div>
	)
}

export default ListHeader
