'use client'

import { CopyList } from '@/actions/copy-list'
import { DeleteList } from '@/actions/delete-list'
import { FormSubmit } from '@/components/form/Form-Submit'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useAction } from '@/lib/use-action'
import { List } from '@prisma/client'
import { MoreHorizontal, X } from 'lucide-react'
import { ElementRef, FC, useRef } from 'react'
import { toast } from 'sonner'

interface IListOptions {
	data: List
	onAddCard: () => void
}

const ListOptions: FC<IListOptions> = ({ data, onAddCard }) => {
	const closeRef = useRef<ElementRef<'button'>>(null)

	const { execute: executeDelete } = useAction(DeleteList, {
		onSuccess: data => {
			toast.success(`Delete ${data.title} successfull`)
			closeRef.current?.click()
		},
		onError: error => {
			toast.error(error)
		},
	})

	const { execute: executeCopy } = useAction(CopyList, {
		onSuccess: data => {
			toast.success(`Copy ${data.title} successfull`)
			closeRef.current?.click()
		},
		onError: error => {
			toast.error(error)
		},
	})

	const handleDelete = (formData: FormData) => {
		const id = formData.get('id') as string
		const boardId = formData.get('boardId') as string

		executeDelete({ id, boardId })
	}

	const handleCopy = (formData: FormData) => {
		const id = formData.get('id') as string
		const boardId = formData.get('boardId') as string

		executeCopy({ id, boardId })
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className='h-auto w-auto p-2' variant='ghost'>
					<MoreHorizontal className='h-4 w-4' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='px-0 pt-3 pb-3' side='bottom' align='start'>
				<div className='text-sm font-medium text-center text-neutral-600 pb-4'>
					List actions
				</div>
				<PopoverClose ref={closeRef} asChild>
					<Button
						className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
						variant='ghost'
					>
						<X className='h-4 w-4' />
					</Button>
				</PopoverClose>
				<Button
					onClick={onAddCard}
					className='w-full rounded-none h-auto p-2 px-5 justify-start font-normal text-sm'
					variant={'ghost'}
				>
					Add card...
				</Button>
				<form action={handleCopy}>
					<input hidden id='id' name='id' value={data.id} />
					<input hidden id='boardId' name='boardId' value={data.boardId} />
					<FormSubmit
						className='w-full rounded-none h-auto p-2 px-5 justify-start font-normal text-sm'
						variant={'ghost'}
					>
						Copy list...
					</FormSubmit>
				</form>
				<Separator />
				<form action={handleDelete}>
					<input hidden id='id' name='id' value={data.id} />
					<input hidden id='boardId' name='boardId' value={data.boardId} />
					<FormSubmit
						className='w-full rounded-none h-auto p-2 px-5 justify-start font-normal text-sm'
						variant={'ghost'}
					>
						Delete this list
					</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	)
}

export default ListOptions
