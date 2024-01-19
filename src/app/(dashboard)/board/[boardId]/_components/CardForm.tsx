'use client'

import { CreateCard } from '@/actions/create-card'
import { FormSubmit } from '@/components/form/Form-Submit'
import { FormTextarea } from '@/components/form/Form-Textarea'
import { Button } from '@/components/ui/button'
import { useAction } from '@/lib/use-action'
import { Plus, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ElementRef, KeyboardEventHandler, forwardRef, useRef } from 'react'
import { toast } from 'sonner'
import { useEventListener, useOnClickOutside } from 'usehooks-ts'

interface ICardForm {
	isEditing: boolean
	disableEditing: () => void
	enableEditing: () => void
	listId: string
}

const CardForm = forwardRef<HTMLTextAreaElement, ICardForm>(
	({ isEditing, enableEditing, disableEditing, listId }, ref) => {
		const params = useParams()
		const formRef = useRef<ElementRef<'form'>>(null)
		const { execute, fieldErrors } = useAction(CreateCard, {
			onSuccess: data => {
				toast.success(`Card ${data.title} created`)
				formRef.current?.reset()
			},
			onError: error => {
				toast.error(error)
			},
		})

		const onCreate = (formData: FormData) => {
			const title = formData.get('title') as string
			const listId = formData.get('listId') as string
			const boardId = params.boardId as string

			execute({ title, listId, boardId })
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				disableEditing()
			}
		}

		useOnClickOutside(formRef, disableEditing)
		useEventListener('keydown', onKeyDown)

		const onTextareakeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				formRef.current?.requestSubmit()
			}
		}

		if (isEditing) {
			return (
				<form
					ref={formRef}
					action={onCreate}
					className='m-1 py-0.5 px-1 space-y-4'
				>
					<FormTextarea
						ref={ref}
						id='title'
						onKeyDown={onTextareakeyDown}
						errors={fieldErrors}
						placeholder='Enter a title for this card..'
					/>
					<input hidden id='listId' name='listId' value={listId} />
					<div className='flex items-center gap-x-1'>
						<FormSubmit>Add card</FormSubmit>
						<Button onClick={disableEditing} variant={'ghost'} size={'sm'}>
							<X className='h-4 w-4' />
						</Button>
					</div>
				</form>
			)
		}
		return (
			<div className='pt-2 px-2'>
				<Button
					onClick={enableEditing}
					variant={'ghost'}
					className='h-auto w-full px-2 py-1.5 justify-start text-muted-foreground text-sm shadow-sm'
				>
					<Plus className='h-4 w-4 mr-2' />
					Add card
				</Button>
			</div>
		)
	}
)

export default CardForm

CardForm.displayName = 'CardForm'
