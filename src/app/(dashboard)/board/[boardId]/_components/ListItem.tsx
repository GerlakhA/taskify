'use client'

import { cn } from '@/lib/utils'
import { ListWithCards } from '@/types'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { ElementRef, FC, useRef, useState } from 'react'
import CardForm from './CardForm'
import CardItem from './CardItem'
import ListHeader from './ListHeader'

interface IListItem {
	data: ListWithCards
	index: number
}

const ListItem: FC<IListItem> = ({ data, index }) => {
	const textareaRef = useRef<ElementRef<'textarea'>>(null)

	const [isEditing, setIsEditing] = useState(false)

	const disableEditing = () => {
		setIsEditing(false)
	}

	const enableEditing = () => {
		setIsEditing(true)
		setTimeout(() => {
			textareaRef.current?.focus()
		})
	}

	return (
		<Draggable draggableId={data.id} index={index}>
			{provided => (
				<li
					{...provided.draggableProps}
					ref={provided.innerRef}
					className='shrink-0 w-[272px] h-full select-none'
				>
					<div
						{...provided.dragHandleProps}
						className='w-full bg-[#f1f2f4] rounded-md pb-2 shadow-sm'
					>
						<ListHeader onAddCard={() => {}} data={data} />
						<Droppable droppableId={data.id} type='card'>
							{provided => (
								<ol
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={cn(
										'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
										data.cards.length > 0 ? 'mt-2' : 'mt-0'
									)}
								>
									{data.cards.map((card, index) => (
										<CardItem index={index} key={card.id} data={card} />
									))}
									{provided.placeholder}
								</ol>
							)}
						</Droppable>
						<CardForm
							ref={textareaRef}
							listId={data.id}
							isEditing={isEditing}
							disableEditing={disableEditing}
							enableEditing={enableEditing}
						/>
					</div>
				</li>
			)}
		</Draggable>
	)
}

export default ListItem
